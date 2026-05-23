-- =====================================================
-- OpenRoom: Entityに紐づくHostなしRoom
--
-- 変更点:
--   1. entities に外部サービス連携フィールド追加
--   2. rooms に is_open_room フラグ追加
--   3. salons RLS を OpenRoom メンバーにも解放
-- =====================================================

-- 1. entities: 外部サービス連携フィールド追加
ALTER TABLE entities
    ADD COLUMN IF NOT EXISTS external_service TEXT,
    ADD COLUMN IF NOT EXISTS external_id      TEXT,
    ADD COLUMN IF NOT EXISTS thumbnail_url    TEXT;

-- 同一外部サービスの同一IDでのエンティティ重複防止
CREATE UNIQUE INDEX IF NOT EXISTS idx_entities_external
    ON entities(external_service, external_id)
    WHERE external_service IS NOT NULL AND external_id IS NOT NULL;

-- 2. rooms: OpenRoom フラグ追加
ALTER TABLE rooms
    ADD COLUMN IF NOT EXISTS is_open_room BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_rooms_is_open ON rooms(is_open_room) WHERE is_open_room = TRUE;

-- 3. salons RLS: OpenRoomのメンバーもSalon操作可能に
DROP POLICY IF EXISTS "salons_insert" ON salons;
CREATE POLICY "salons_insert"
    ON salons FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM rooms
            WHERE rooms.room_id = salons.room_id
            AND (
                rooms.host_user_id = auth.uid()
                OR (
                    rooms.is_open_room = TRUE
                    AND EXISTS (
                        SELECT 1 FROM user_rooms
                        WHERE user_rooms.room_id = salons.room_id
                        AND user_rooms.user_id = auth.uid()
                    )
                )
            )
        )
    );

DROP POLICY IF EXISTS "salons_update" ON salons;
CREATE POLICY "salons_update"
    ON salons FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM rooms
            WHERE rooms.room_id = salons.room_id
            AND (
                rooms.host_user_id = auth.uid()
                OR (
                    rooms.is_open_room = TRUE
                    AND EXISTS (
                        SELECT 1 FROM user_rooms
                        WHERE user_rooms.room_id = salons.room_id
                        AND user_rooms.user_id = auth.uid()
                    )
                )
            )
        )
    );

DROP POLICY IF EXISTS "salons_delete" ON salons;
CREATE POLICY "salons_delete"
    ON salons FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM rooms
            WHERE rooms.room_id = salons.room_id
            AND (
                rooms.host_user_id = auth.uid()
                OR (
                    rooms.is_open_room = TRUE
                    AND EXISTS (
                        SELECT 1 FROM user_rooms
                        WHERE user_rooms.room_id = salons.room_id
                        AND user_rooms.user_id = auth.uid()
                    )
                )
            )
        )
    );
