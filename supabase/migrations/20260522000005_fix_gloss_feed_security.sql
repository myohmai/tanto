-- =====================================================
-- gloss_feed の SECURITY DEFINER 警告を修正
--
-- 問題1: gloss_feed が user_rooms の user_name を JOIN で取得
--        → user_rooms_select は user_id = auth.uid() のみ許可
--        → SECURITY INVOKER だと他ユーザーの user_name が NULL になる
--
-- 問題2: gloss_reports_select が reporter_id = auth.uid() のみ
--        → SECURITY INVOKER だと自分のレポートしか集計されず
--          calcNotification の重み計算が壊れる
--
-- 修正:
--   1. glosses.user_name 列を追加（投稿時スナップショット）
--   2. gloss_reports を全認証ユーザー読み取り可に変更
--      ※現在の SECURITY DEFINER ビュー経由で既に全員が参照できているため
--        RLS を正式化するだけで公開範囲は変わらない
--   3. gloss_feed を security_invoker = true で再作成
-- =====================================================

-- 1. glosses テーブルに user_name スナップショット列を追加
ALTER TABLE glosses
    ADD COLUMN IF NOT EXISTS user_name TEXT;

-- 既存グロスを user_rooms から補完（マイグレーション実行者権限で RLS バイパス）
UPDATE glosses g
SET user_name = (
    SELECT ur.user_name
    FROM user_rooms ur
    WHERE ur.user_id = g.user_id
      AND ur.room_id = g.room_id
    LIMIT 1
);

-- 2. gloss_reports_select を全認証ユーザー読み取り可に変更
DROP POLICY IF EXISTS "gloss_reports_select" ON gloss_reports;

CREATE POLICY "gloss_reports_select"
    ON gloss_reports FOR SELECT
    USING (auth.uid() IS NOT NULL);

-- 3. gloss_stats を security_invoker = true で再作成（gloss_reports RLS 修正後は不要な DEFINER を外せる）
DROP VIEW IF EXISTS gloss_stats;

CREATE VIEW gloss_stats
WITH (security_invoker = true)
AS
SELECT
    g.gloss_id,
    COALESCE((SELECT COUNT(*)::int FROM fonds f        WHERE f.gloss_id = g.gloss_id), 0)                    AS fond_count,
    COALESCE((SELECT COUNT(*)::int FROM gloss_reports r WHERE r.gloss_id = g.gloss_id), 0)                   AS report_count,
    COALESCE((SELECT COUNT(*)::int FROM glosses reply  WHERE reply.reply_to_gloss_id = g.gloss_id), 0)       AS reply_count
FROM glosses g;

-- 4. gloss_feed を security_invoker = true で再作成
--    user_rooms JOIN を削除し glosses.user_name を使用
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
    g.revaluation,
    g.topic_id,
    g.posted_at,
    g.reply_to_gloss_id,
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
