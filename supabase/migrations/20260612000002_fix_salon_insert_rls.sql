-- =====================================================
-- salons_insert RLS 修正
--
-- 問題: host_create_salon = FALSE のとき UI はメンバーに
--       Salon 作成ボタンを表示するが、RLS が host / OpenRoom
--       メンバーしか許可しておらず INSERT が失敗する。
--
-- 修正: host_create_salon = FALSE かつ room メンバーであれば
--       Salon 作成を許可する条件を追加。
-- =====================================================

DROP POLICY IF EXISTS "salons_insert" ON salons;

CREATE POLICY "salons_insert"
    ON salons FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM rooms
            WHERE rooms.room_id = salons.room_id
            AND (
                -- host は常に作成可
                rooms.host_user_id = auth.uid()
                -- OpenRoom: メンバーなら作成可
                OR (
                    rooms.is_open_room = TRUE
                    AND EXISTS (
                        SELECT 1 FROM user_rooms
                        WHERE user_rooms.room_id = salons.room_id
                        AND user_rooms.user_id = auth.uid()
                    )
                )
                -- host_create_salon = FALSE: メンバーなら作成可
                OR (
                    rooms.host_create_salon = FALSE
                    AND EXISTS (
                        SELECT 1 FROM user_rooms
                        WHERE user_rooms.room_id = salons.room_id
                        AND user_rooms.user_id = auth.uid()
                    )
                )
            )
        )
    );
