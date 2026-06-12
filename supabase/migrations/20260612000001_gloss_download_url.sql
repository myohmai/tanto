-- =====================================================
-- glosses テーブルに download_url カラムを追加
-- admin が素材配布用のダウンロードリンクを投稿に付与できるようにする
-- =====================================================

-- 1. glosses テーブルに download_url カラムを追加
ALTER TABLE glosses
    ADD COLUMN IF NOT EXISTS download_url TEXT;

-- 2. gloss_feed ビューを再作成（download_url を含める）
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

-- 3. gloss_feed ビューへの SELECT 権限を付与（5/30以降の必須対応）
GRANT SELECT ON gloss_feed TO anon, authenticated;
