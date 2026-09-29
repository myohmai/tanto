-- =====================================================
-- 通報判定(偏り検知)の集計を DB 側で行う
--
-- 問題: 通報判定には「通報者」の参加 Room・興味 Entity・興味なし Entity が必要だが、
--       user_rooms / user_room_entities / user_dis_interests は RLS で本人しか読めず、
--       画面側では閲覧者本人の分しか使えていなかった(実質「通報5件以上」だけが効いていた)。
--
-- 修正: SECURITY DEFINER の関数で通報者ごとの重み・同Room判定・共通Entity数を集計し、
--       通報種別ごとの集計値だけを返す(個人の興味データは外に出さない)。
--       最終的な注意書きの種類の決定は従来どおりアプリ側
--       (src/app/logic/report/calcNotification.ts の calcNotificationFromAggregates)で行う。
--
-- 集計ルール(旧 calcNotification と同じ):
--   weight            : 通報者の「興味なし」Entity が Room の Entity(名寄せ+祖先まで展開)と重なれば 0.3、それ以外 1.0
--   same_room_weight  : 対象 Room のメンバー(user_rooms)である通報者の weight 合計
--   total_weight      : 全通報者の weight 合計
--   top_entity_reporters : Room 外の通報者について、対象 Room 以外で興味を持つ Entity(名寄せ後)ごとの人数の最大値
-- =====================================================

-- 1. Entity の名寄せ・祖先展開
CREATE OR REPLACE FUNCTION resolve_entity_id(p_entity_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SET search_path = public
AS $$
    SELECT COALESCE(
        (SELECT canonical_entity_id FROM entities WHERE entity_id = p_entity_id),
        p_entity_id
    );
$$;

CREATE OR REPLACE FUNCTION entity_related_ids(p_entity_id UUID)
RETURNS UUID[]
LANGUAGE sql
STABLE
SET search_path = public
AS $$
    WITH RECURSIVE chain AS (
        SELECT resolve_entity_id(p_entity_id) AS id, 0 AS depth
        UNION ALL
        SELECT resolve_entity_id(e.parent_entity_id), c.depth + 1
        FROM chain c
        JOIN entities e ON e.entity_id = c.id
        WHERE e.parent_entity_id IS NOT NULL
          AND c.depth < 20
    )
    SELECT array_agg(DISTINCT id) FROM chain;
$$;

-- 2. 1対象ぶんの集計(内部用。直接は呼ばせない)
--    p_reports: [{ "reporter_id": uuid, "type": report_type }, ...]
CREATE OR REPLACE FUNCTION _aggregate_reports(
    p_room_id         UUID,
    p_room_entity_ids UUID[],
    p_reports         JSONB
)
RETURNS TABLE (
    report_type           TEXT,
    report_count          INTEGER,
    total_weight          NUMERIC,
    same_room_weight      NUMERIC,
    top_entity_reporters  INTEGER
)
LANGUAGE sql
STABLE
SET search_path = public
AS $$
    WITH reports AS (
        SELECT DISTINCT
            (x->>'reporter_id')::uuid AS reporter_id,
            x->>'type'                AS type
        FROM jsonb_array_elements(COALESCE(p_reports, '[]'::jsonb)) x
    ),
    room_related AS (
        SELECT DISTINCT unnest(entity_related_ids(e)) AS id
        FROM unnest(COALESCE(p_room_entity_ids, '{}'::uuid[])) e
    ),
    weighted AS (
        SELECT
            r.reporter_id,
            r.type,
            CASE WHEN EXISTS (
                SELECT 1 FROM user_dis_interests d
                WHERE d.user_id = r.reporter_id
                  AND resolve_entity_id(d.entity_id) IN (SELECT id FROM room_related)
            ) THEN 0.3 ELSE 1.0 END AS weight,
            EXISTS (
                SELECT 1 FROM user_rooms ur
                WHERE ur.user_id = r.reporter_id
                  AND ur.room_id = p_room_id
            ) AS in_room
        FROM reports r
    ),
    outside_entities AS (
        SELECT w.type, e.id AS entity_id, COUNT(DISTINCT w.reporter_id)::int AS n
        FROM weighted w
        CROSS JOIN LATERAL (
            SELECT DISTINCT resolve_entity_id(ure.entity_id) AS id
            FROM user_room_entities ure
            WHERE ure.user_id = w.reporter_id
              AND ure.room_id <> p_room_id
        ) e
        WHERE NOT w.in_room
        GROUP BY w.type, e.id
    )
    SELECT
        w.type,
        COUNT(*)::int,
        SUM(w.weight),
        COALESCE(SUM(w.weight) FILTER (WHERE w.in_room), 0),
        COALESCE((SELECT MAX(oe.n) FROM outside_entities oe WHERE oe.type = w.type), 0)::int
    FROM weighted w
    GROUP BY w.type;
$$;

REVOKE ALL ON FUNCTION _aggregate_reports(UUID, UUID[], JSONB) FROM PUBLIC, anon, authenticated;

-- 3. Gloss 向け(呼び出したユーザーが見える Gloss のみ)
CREATE OR REPLACE FUNCTION get_gloss_report_aggregates(p_gloss_ids UUID[])
RETURNS TABLE (
    target_id             UUID,
    report_type           TEXT,
    report_count          INTEGER,
    total_weight          NUMERIC,
    same_room_weight      NUMERIC,
    top_entity_reporters  INTEGER
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT g.gloss_id, a.*
    FROM glosses g
    JOIN rooms r ON r.room_id = g.room_id
    CROSS JOIN LATERAL _aggregate_reports(
        g.room_id,
        r.entity_ids,
        (
            SELECT jsonb_agg(jsonb_build_object('reporter_id', gr.reporter_id, 'type', gr.type))
            FROM gloss_reports gr
            WHERE gr.gloss_id = g.gloss_id
        )
    ) a
    WHERE g.gloss_id = ANY(p_gloss_ids)
      AND auth.uid() IS NOT NULL
      AND (
          r.room_visibility = 'public'
          OR r.host_user_id = auth.uid()
          OR EXISTS (
              SELECT 1 FROM user_rooms ur
              WHERE ur.room_id = r.room_id AND ur.user_id = auth.uid()
          )
      );
$$;

-- 4. Room 向け(room_reports は RLS で本人分しか読めないため、こちらも DB 側で集計)
CREATE OR REPLACE FUNCTION get_room_report_aggregates(p_room_ids UUID[])
RETURNS TABLE (
    target_id             UUID,
    report_type           TEXT,
    report_count          INTEGER,
    total_weight          NUMERIC,
    same_room_weight      NUMERIC,
    top_entity_reporters  INTEGER
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT r.room_id, a.*
    FROM rooms r
    CROSS JOIN LATERAL _aggregate_reports(
        r.room_id,
        r.entity_ids,
        (
            SELECT jsonb_agg(jsonb_build_object('reporter_id', rr.reporter_id, 'type', rr.type))
            FROM room_reports rr
            WHERE rr.room_id = r.room_id
        )
    ) a
    WHERE r.room_id = ANY(p_room_ids)
      AND auth.uid() IS NOT NULL
      AND (
          r.room_visibility = 'public'
          OR r.host_user_id = auth.uid()
          OR EXISTS (
              SELECT 1 FROM user_rooms ur
              WHERE ur.room_id = r.room_id AND ur.user_id = auth.uid()
          )
      );
$$;

REVOKE ALL ON FUNCTION get_gloss_report_aggregates(UUID[]) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION get_room_report_aggregates(UUID[])  FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION get_gloss_report_aggregates(UUID[]) TO authenticated;
GRANT EXECUTE ON FUNCTION get_room_report_aggregates(UUID[])  TO authenticated;
