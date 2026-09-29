-- =====================================================
-- admins テーブルに初期管理者を登録
-- NEXT_PUBLIC_ADMIN_USER_IDS の値を手動で反映
--
-- ※ 本番の auth.users にしか存在しないユーザーのため、
--   ローカル / 確認用プロジェクトなど、そのユーザーがいない環境では何もしない。
--   (本番では適用済み。書き換えても本番には再実行されない)
--   別環境で管理者が必要な場合は、ログイン後に Studio / Dashboard から
--   admins テーブルに自分の user_id を追加する。
-- =====================================================

INSERT INTO admins (user_id)
SELECT id FROM auth.users
WHERE id = 'dcddeb66-17da-4b7a-91ae-8cdee5484734'
ON CONFLICT (user_id) DO NOTHING;
