-- =====================================================
-- 再評価(「この評価は適切ですか?」はい / いいえ)を保存する
--
-- 問題: 再評価ボタンはローカル state を更新するだけで DB に保存されていなかった。
--       また glosses.revaluation を直接更新する方式だと、glosses_update が
--       「投稿者本人のみ」なので他人の投稿に投票できない。
--
-- 修正:
--   1. gloss_revaluations テーブルを追加(1ユーザー1Glossにつき1票、投票の変更可)
--   2. gloss_feed.revaluation を gloss_revaluations から集計した値にする
--      (投票が1件もない Gloss は従来の glosses.revaluation をそのまま返す)
--   3. room_stats への SELECT 権限を明示(Room のアクティビティスコア計算で使用)
-- =====================================================

-- 1. gloss_revaluations
CREATE TABLE IF NOT EXISTS gloss_revaluations (
    gloss_id        UUID NOT NULL REFERENCES glosses(gloss_id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    -- true = 「はい(評価は適切)」 / false = 「いいえ」
    is_appropriate  BOOLEAN NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (gloss_id, user_id)
);

ALTER TABLE gloss_revaluations ENABLE ROW LEVEL SECURITY;

-- 集計を gloss_feed(security_invoker)で行うため、ログイン済みなら全件読める
DROP POLICY IF EXISTS "gloss_revaluations_select" ON gloss_revaluations;
CREATE POLICY "gloss_revaluations_select"
    ON gloss_revaluations FOR SELECT
    USING (auth.uid() IS NOT NULL);

-- 本人の票のみ。対象 Gloss が見える(= glosses の SELECT ポリシーを通る)場合に限る
DROP POLICY IF EXISTS "gloss_revaluations_insert" ON gloss_revaluations;
CREATE POLICY "gloss_revaluations_insert"
    ON gloss_revaluations FOR INSERT
    WITH CHECK (
        auth.uid() = user_id
        AND EXISTS (SELECT 1 FROM glosses WHERE glosses.gloss_id = gloss_revaluations.gloss_id)
    );

DROP POLICY IF EXISTS "gloss_revaluations_update" ON gloss_revaluations;
CREATE POLICY "gloss_revaluations_update"
    ON gloss_revaluations FOR UPDATE
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "gloss_revaluations_delete" ON gloss_revaluations;
CREATE POLICY "gloss_revaluations_delete"
    ON gloss_revaluations FOR DELETE
    USING (user_id = auth.uid());

GRANT SELECT, INSERT, UPDATE, DELETE ON gloss_revaluations TO authenticated;

-- 2. gloss_feed を再作成(列の並びは 20260612000001 と同じ。revaluation のみ計算値に変更)
DROP VIEW IF EXISTS gloss_feed;
CREATE VIEW gloss_feed
WITH (security_invoker = true)
AS
SELECT
    g.gloss_id,
    g.room_id,
    g.salon_id,
    g.user_id,
    g.content,
    g.media,
    g.media_embed,
    (
        SELECT CASE
            WHEN COUNT(*) = 0 THEN g.revaluation
            ELSE jsonb_build_object(
                'yesCount', COUNT(*) FILTER (WHERE rv.is_appropriate),
                'noCount',  COUNT(*) FILTER (WHERE NOT rv.is_appropriate)
            )
        END
        FROM gloss_revaluations rv
        WHERE rv.gloss_id = g.gloss_id
    ) AS revaluation,
    g.topic_id,
    g.posted_at,
    g.reply_to_gloss_id,
    g.download_url,
    r.room_name,
    s.salon_name,
    g.user_name,
    COALESCE(
        (SELECT COUNT(*)::int FROM fonds f WHERE f.gloss_id = g.gloss_id), 0
    ) AS fond_count,
    COALESCE(
        (SELECT COUNT(*)::int FROM glosses reply WHERE reply.reply_to_gloss_id = g.gloss_id), 0
    ) AS reply_count,
    COALESCE(
        (
            SELECT json_agg(json_build_object(
                'reporterId', gr.reporter_id,
                'type',       gr.type,
                'createdAt',  EXTRACT(EPOCH FROM gr.created_at)::bigint * 1000
            ))
            FROM gloss_reports gr
            WHERE gr.gloss_id = g.gloss_id
        ),
        '[]'::json
    ) AS reports
FROM glosses g
LEFT JOIN rooms  r ON r.room_id  = g.room_id
LEFT JOIN salons s ON s.salon_id = g.salon_id;

-- ビューを作り直すと権限が外れるため付け直す
GRANT SELECT ON gloss_feed TO anon, authenticated;

-- 3. room_stats(アプリから参照するようになったため権限を明示)
GRANT SELECT ON room_stats TO anon, authenticated;
