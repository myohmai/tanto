-- =====================================================
-- Private Room の入室を DB 側で判定する
--
-- 問題:
--   - rooms の SELECT ポリシーにより、非メンバーは Private Room の行を読めず、
--     入室画面(合言葉 / クイズ)もニックネーム設定画面も表示できなかった
--   - 仮に読めても、合言葉・クイズの正解(配点)がブラウザに渡り、判定もブラウザ側だった
--   - user_rooms_insert が「本人なら可」だけなので、判定を通さず直接参加登録できた
--   - ホストが自分の Private Room を参加前に閲覧できなかった
--
-- 修正:
--   1. rooms: ホストは自分の Room を常に閲覧可
--   2. user_rooms への直接 INSERT は public Room / ホストのみに制限
--   3. get_private_room_gate      : 入室画面の表示用情報(合言葉・配点は含めない)
--   4. verify_private_room_entry  : 合言葉 / クイズの判定のみ(画面の途中確認用)
--   5. enter_private_room         : 判定して通れば参加登録(user_rooms + user_room_entities)
--
-- クイズの採点: 各設問で「ちょうど1つ」選ばれた選択肢の score を合計し、
--               rooms.room_quiz_score(合格ライン)以上なら合格。
-- =====================================================

-- 1. ホストは自分の Room を閲覧可
DROP POLICY IF EXISTS "rooms_select_host" ON rooms;
CREATE POLICY "rooms_select_host"
    ON rooms FOR SELECT
    USING (host_user_id = auth.uid());

-- 2. 直接参加できる Room か(RLS の相互参照を避けるため SECURITY DEFINER の関数にする)
CREATE OR REPLACE FUNCTION can_join_room_directly(p_room_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM rooms
        WHERE room_id = p_room_id
          AND (room_visibility = 'public' OR host_user_id = auth.uid())
    );
$$;

DROP POLICY IF EXISTS "user_rooms_insert" ON user_rooms;
CREATE POLICY "user_rooms_insert"
    ON user_rooms FOR INSERT
    WITH CHECK (
        auth.uid() = user_id
        AND can_join_room_directly(room_id)
    );

-- 3. 入室画面用の情報
CREATE OR REPLACE FUNCTION get_private_room_gate(p_room_id UUID)
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT jsonb_build_object(
        'roomId',        r.room_id,
        'roomName',      r.room_name,
        'roomIconUrl',   r.room_icon_url,
        'roomBannerUrl', r.room_banner_url,
        'roomRule',      r.room_rule,
        'roomMemberIni', r.room_member_ini,
        'entrySetting',  r.room_entry_setting,
        'keywordHint',   r.room_key_word_hint,
        -- 設問と選択肢の文言だけ返す(score は返さない)
        'quiz', COALESCE((
            SELECT jsonb_agg(jsonb_build_object(
                'id',       q->>'id',
                'question', q->>'question',
                'option',   COALESCE((
                    SELECT jsonb_agg(jsonb_build_object('id', o->>'id', 'text', o->>'text'))
                    FROM jsonb_array_elements(COALESCE(q->'option', '[]'::jsonb)) o
                ), '[]'::jsonb)
            ))
            FROM jsonb_array_elements(COALESCE(r.room_quiz, '[]'::jsonb)) q
        ), '[]'::jsonb),
        'isMember', EXISTS (
            SELECT 1 FROM user_rooms ur
            WHERE ur.room_id = r.room_id AND ur.user_id = auth.uid()
        )
    )
    FROM rooms r
    WHERE r.room_id = p_room_id
      AND r.room_visibility = 'private'
      AND auth.uid() IS NOT NULL;
$$;

-- 判定本体(内部用)
CREATE OR REPLACE FUNCTION _check_private_room_entry(
    p_room_id  UUID,
    p_keyword  TEXT,
    p_answers  JSONB
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SET search_path = public
AS $$
    SELECT COALESCE((
        SELECT CASE r.room_entry_setting
            WHEN 'keyword' THEN
                r.room_key_word IS NOT NULL
                AND r.room_key_word <> ''
                AND p_keyword IS NOT DISTINCT FROM r.room_key_word
            WHEN 'quiz' THEN
                COALESCE((
                    SELECT SUM(per_question.score)
                    FROM (
                        SELECT CASE WHEN COUNT(*) = 1
                                    THEN MAX(COALESCE((o->>'score')::numeric, 0))
                                    ELSE 0 END AS score
                        FROM jsonb_array_elements(COALESCE(r.room_quiz, '[]'::jsonb)) q
                        JOIN LATERAL jsonb_array_elements(COALESCE(q->'option', '[]'::jsonb)) o
                          ON (o->>'id') IN (
                              SELECT jsonb_array_elements_text(COALESCE(p_answers, '[]'::jsonb))
                          )
                        GROUP BY q->>'id'
                    ) per_question
                ), 0) >= COALESCE(r.room_quiz_score, 0)
            ELSE FALSE
        END
        FROM rooms r
        WHERE r.room_id = p_room_id
          AND r.room_visibility = 'private'
    ), FALSE);
$$;

REVOKE ALL ON FUNCTION _check_private_room_entry(UUID, TEXT, JSONB) FROM PUBLIC, anon, authenticated;

-- 4. 判定のみ
CREATE OR REPLACE FUNCTION verify_private_room_entry(
    p_room_id  UUID,
    p_keyword  TEXT DEFAULT NULL,
    p_answers  JSONB DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT auth.uid() IS NOT NULL
       AND _check_private_room_entry(p_room_id, p_keyword, p_answers);
$$;

-- 5. 判定して参加登録
CREATE OR REPLACE FUNCTION enter_private_room(
    p_room_id    UUID,
    p_keyword    TEXT  DEFAULT NULL,
    p_answers    JSONB DEFAULT NULL,
    p_user_name  TEXT  DEFAULT NULL,
    p_icon_url   TEXT  DEFAULT NULL,
    p_sub_icon   JSONB DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_uid   UUID := auth.uid();
    v_room  rooms%ROWTYPE;
BEGIN
    IF v_uid IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    IF NOT _check_private_room_entry(p_room_id, p_keyword, p_answers) THEN
        RETURN FALSE;
    END IF;

    SELECT * INTO v_room FROM rooms WHERE room_id = p_room_id;

    INSERT INTO user_rooms (user_id, room_id, room_name, icon_url, sub_icon, user_name)
    VALUES (v_uid, p_room_id, v_room.room_name, p_icon_url, p_sub_icon, p_user_name)
    ON CONFLICT (user_id, room_id) DO NOTHING;

    INSERT INTO user_room_entities (user_id, room_id, entity_id)
    SELECT v_uid, p_room_id, e
    FROM unnest(COALESCE(v_room.entity_ids, '{}'::uuid[])) e
    WHERE EXISTS (SELECT 1 FROM entities WHERE entity_id = e)
    ON CONFLICT DO NOTHING;

    RETURN TRUE;
END;
$$;

REVOKE ALL ON FUNCTION get_private_room_gate(UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION verify_private_room_entry(UUID, TEXT, JSONB) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION enter_private_room(UUID, TEXT, JSONB, TEXT, TEXT, JSONB) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION get_private_room_gate(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION verify_private_room_entry(UUID, TEXT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION enter_private_room(UUID, TEXT, JSONB, TEXT, TEXT, JSONB) TO authenticated;
-- can_join_room_directly は RLS ポリシーから呼ばれるため authenticated に実行権限が必要
GRANT EXECUTE ON FUNCTION can_join_room_directly(UUID) TO authenticated;
