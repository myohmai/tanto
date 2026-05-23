-- =====================================================
-- admins テーブルに初期管理者を登録
-- NEXT_PUBLIC_ADMIN_USER_IDS の値を手動で反映
-- =====================================================

INSERT INTO admins (user_id)
VALUES ('dcddeb66-17da-4b7a-91ae-8cdee5484734')
ON CONFLICT (user_id) DO NOTHING;
