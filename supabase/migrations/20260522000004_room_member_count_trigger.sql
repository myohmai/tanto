-- =====================================================
-- rooms.member_count をトリガーで管理する
-- SECURITY DEFINER VIEW (room_stats) を廃止
-- =====================================================

-- 1. rooms テーブルに member_count 列を追加
ALTER TABLE rooms
    ADD COLUMN IF NOT EXISTS member_count INTEGER NOT NULL DEFAULT 0;

-- 2. 現在の user_rooms から件数を初期化
UPDATE rooms r
SET member_count = (
    SELECT COUNT(*)::int FROM user_rooms ur WHERE ur.room_id = r.room_id
);

-- 3. user_rooms の INSERT / DELETE で member_count を更新するトリガー関数
CREATE OR REPLACE FUNCTION trg_update_room_member_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE rooms SET member_count = member_count + 1 WHERE room_id = NEW.room_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE rooms SET member_count = GREATEST(member_count - 1, 0) WHERE room_id = OLD.room_id;
    END IF;
    RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_user_rooms_member_count ON user_rooms;

CREATE TRIGGER trg_user_rooms_member_count
AFTER INSERT OR DELETE ON user_rooms
FOR EACH ROW EXECUTE FUNCTION trg_update_room_member_count();

-- 4. room_stats VIEW を SECURITY INVOKER で再作成 (gloss 統計のみ)
DROP VIEW IF EXISTS room_stats;

CREATE VIEW room_stats
WITH (security_invoker = true)
AS
SELECT
    r.room_id,
    COUNT(DISTINCT g.gloss_id)::int                     AS gloss_count,
    COUNT(DISTINCT g_recent.gloss_id)::int              AS recent_gloss_count
FROM rooms r
LEFT JOIN glosses g       ON g.room_id = r.room_id
LEFT JOIN glosses g_recent
    ON g_recent.room_id  = r.room_id
    AND g_recent.posted_at > NOW() - INTERVAL '24 hours'
GROUP BY r.room_id;
