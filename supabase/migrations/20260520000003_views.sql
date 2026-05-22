-- =====================================================
-- Views for simplified querying
-- =====================================================

-- 既存のgloss_stats viewを再定義（より正確な実装）
DROP VIEW IF EXISTS gloss_stats;
DROP VIEW IF EXISTS room_stats;

CREATE VIEW gloss_stats AS
SELECT
    g.gloss_id,
    (SELECT COUNT(*)::int FROM fonds f WHERE f.gloss_id = g.gloss_id)       AS fond_count,
    (SELECT COUNT(*)::int FROM gloss_reports r WHERE r.gloss_id = g.gloss_id) AS report_count,
    (SELECT COUNT(*)::int FROM glosses reply WHERE reply.reply_to_gloss_id = g.gloss_id) AS reply_count
FROM glosses g;

-- gloss_feed: GlossDataに必要な全フィールドをJOINしたビュー
CREATE VIEW gloss_feed AS
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
    ur.user_name,
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
LEFT JOIN rooms     r  ON r.room_id  = g.room_id
LEFT JOIN salons    s  ON s.salon_id = g.salon_id
LEFT JOIN user_rooms ur
    ON ur.user_id = g.user_id
    AND ur.room_id = g.room_id;

-- room_stats: RoomのアクティビティスコアBI用ビュー
CREATE VIEW room_stats AS
SELECT
    r.room_id,
    COUNT(DISTINCT ur.user_id)::int                     AS member_count,
    COUNT(DISTINCT g.gloss_id)::int                     AS gloss_count,
    COUNT(DISTINCT g_recent.gloss_id)::int              AS recent_gloss_count
FROM rooms r
LEFT JOIN user_rooms ur   ON ur.room_id = r.room_id
LEFT JOIN glosses g       ON g.room_id  = r.room_id
LEFT JOIN glosses g_recent
    ON g_recent.room_id  = r.room_id
    AND g_recent.posted_at > NOW() - INTERVAL '24 hours'
GROUP BY r.room_id;
