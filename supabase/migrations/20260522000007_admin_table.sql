-- =====================================================
-- admins テーブル: OpenRoom の管理権限を RLS で制御
-- =====================================================

-- 1. admins テーブル作成
CREATE TABLE IF NOT EXISTS admins (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- 全ユーザーが参照可（isAdmin チェックに使用）
DROP POLICY IF EXISTS "admins_select" ON admins;
CREATE POLICY "admins_select"
    ON admins FOR SELECT
    USING (true);

-- INSERT/UPDATE/DELETE はサービスロールのみ
-- （Supabase Dashboard の Table Editor から手動で追加する）

-- 2. rooms_update: host または admin が更新可
DROP POLICY IF EXISTS "rooms_update" ON rooms;
CREATE POLICY "rooms_update"
    ON rooms FOR UPDATE
    USING (
        host_user_id = auth.uid()
        OR (
            is_open_room = TRUE
            AND EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
        )
    );

-- 3. rooms_delete: host または admin が削除可
DROP POLICY IF EXISTS "rooms_delete" ON rooms;
CREATE POLICY "rooms_delete"
    ON rooms FOR DELETE
    USING (
        host_user_id = auth.uid()
        OR (
            is_open_room = TRUE
            AND EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
        )
    );
