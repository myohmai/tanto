-- =====================================================
-- 本番のダッシュボードで直接作っていたものをマイグレーションに起こす
-- (supabase db diff --linked --schema public,storage で生成し、手で整理)
--
--   - user_contacts テーブル(お問い合わせ: bug / deletion / open_room)と RLS
--   - gloss_reports / turntables に追加されていた管理者向けポリシー
--       ※ gloss_reports の2つは既存の gloss_reports_select / gloss_reports_insert と
--         中身が重なるが、本番と揃えるため残している
--   - Storage: media バケット(public)と、投稿画像(gloss/ 配下)のアップロード許可
--
-- 本番では適用済みのため、本番の履歴には
--   supabase migration repair --status applied 20260929012743
-- で「適用済み」として記録する(本番では実行しない)。
--
-- 生成結果に含まれていた public.rls_auto_enable()(Supabase が自動で作る
-- RLS 自動有効化用のイベントトリガー関数)は、アプリのスキーマではないため除外した。
-- =====================================================
  create table "public"."user_contacts" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "type" text not null,
    "title" text not null,
    "body" text not null,
    "status" text not null default 'pending'::text,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."user_contacts" enable row level security;

CREATE UNIQUE INDEX user_contacts_pkey ON public.user_contacts USING btree (id);

alter table "public"."user_contacts" add constraint "user_contacts_pkey" PRIMARY KEY using index "user_contacts_pkey";

alter table "public"."user_contacts" add constraint "user_contacts_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'reviewed'::text, 'resolved'::text]))) not valid;

alter table "public"."user_contacts" validate constraint "user_contacts_status_check";

alter table "public"."user_contacts" add constraint "user_contacts_type_check" CHECK ((type = ANY (ARRAY['bug'::text, 'deletion'::text, 'open_room'::text]))) not valid;

alter table "public"."user_contacts" validate constraint "user_contacts_type_check";

alter table "public"."user_contacts" add constraint "user_contacts_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_contacts" validate constraint "user_contacts_user_id_fkey";


grant delete on table "public"."user_contacts" to "anon";

grant insert on table "public"."user_contacts" to "anon";

grant references on table "public"."user_contacts" to "anon";

grant select on table "public"."user_contacts" to "anon";

grant trigger on table "public"."user_contacts" to "anon";

grant truncate on table "public"."user_contacts" to "anon";

grant update on table "public"."user_contacts" to "anon";

grant delete on table "public"."user_contacts" to "authenticated";

grant insert on table "public"."user_contacts" to "authenticated";

grant references on table "public"."user_contacts" to "authenticated";

grant select on table "public"."user_contacts" to "authenticated";

grant trigger on table "public"."user_contacts" to "authenticated";

grant truncate on table "public"."user_contacts" to "authenticated";

grant update on table "public"."user_contacts" to "authenticated";

grant delete on table "public"."user_contacts" to "service_role";

grant insert on table "public"."user_contacts" to "service_role";

grant references on table "public"."user_contacts" to "service_role";

grant select on table "public"."user_contacts" to "service_role";

grant trigger on table "public"."user_contacts" to "service_role";

grant truncate on table "public"."user_contacts" to "service_role";

grant update on table "public"."user_contacts" to "service_role";


  create policy "admins can read all gloss reports"
  on "public"."gloss_reports"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.user_id = auth.uid()))));



  create policy "users can insert gloss reports"
  on "public"."gloss_reports"
  as permissive
  for insert
  to public
with check ((auth.uid() = reporter_id));



  create policy "Admin can delete open room turntables"
  on "public"."turntables"
  as permissive
  for delete
  to public
using (((EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.user_id = auth.uid()))) AND (EXISTS ( SELECT 1
   FROM public.rooms
  WHERE ((rooms.room_id = turntables.room_id) AND (rooms.is_open_room = true))))));



  create policy "admins can read all contacts"
  on "public"."user_contacts"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.user_id = auth.uid()))));



  create policy "admins can update contacts"
  on "public"."user_contacts"
  as permissive
  for update
  to public
using ((EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.user_id = auth.uid()))));



  create policy "users can insert own contacts"
  on "public"."user_contacts"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



-- Storage: media バケット(本番の設定: public / サイズ制限なし / MIME 制限なし)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, null, null)
on conflict (id) do nothing;


  create policy "Authenticated users can upload gloss media"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check (((bucket_id = 'media'::text) AND (name ~~ 'gloss/%'::text)));



