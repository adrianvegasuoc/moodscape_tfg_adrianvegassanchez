-- =========================================================
-- Moodscape: RLS y Storage policies
-- =========================================================
--
-- Este script:
-- 1. Activa RLS en public.posts
-- 2. Permite leer posts propios y posts publicos de otros usuarios
-- 3. Crea o actualiza el bucket publico generated-images
-- 4. Restringe subida, actualizacion y borrado de imagenes
--    a la carpeta del usuario autenticado: <auth.uid()>/...

-- =========================================================
-- 1. RLS en public.posts
-- =========================================================
alter table public.posts enable row level security;

drop policy if exists "Users can insert their own posts" on public.posts;
drop policy if exists "Users can view own and public posts" on public.posts;
drop policy if exists "Users can update their own posts" on public.posts;
drop policy if exists "Users can delete their own posts" on public.posts;

create policy "Users can insert their own posts"
on public.posts
for insert
to authenticated
with check (
  auth.uid() = user_id
);

create policy "Users can view own and public posts"
on public.posts
for select
to authenticated
using (
  auth.uid() = user_id
  or is_public = true
);

create policy "Users can update their own posts"
on public.posts
for update
to authenticated
using (
  auth.uid() = user_id
)
with check (
  auth.uid() = user_id
);

create policy "Users can delete their own posts"
on public.posts
for delete
to authenticated
using (
  auth.uid() = user_id
);

-- =========================================================
-- 2. Bucket publico para imagenes generadas
-- =========================================================
insert into storage.buckets (id, name, public)
values ('generated-images', 'generated-images', true)
on conflict (id) do update
set public = true;

-- =========================================================
-- 3. Policies de storage.objects para generated-images
-- =========================================================
drop policy if exists "Users can upload their own generated images" on storage.objects;
drop policy if exists "Users can read generated images" on storage.objects;
drop policy if exists "Users can update their own generated images" on storage.objects;
drop policy if exists "Users can delete their own generated images" on storage.objects;

-- Solo se permite subir archivos al bucket generated-images
-- dentro de la carpeta del usuario autenticado.
create policy "Users can upload their own generated images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'generated-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- El bucket es publico y las URLs finales pueden leerse publicamente.
create policy "Users can read generated images"
on storage.objects
for select
to public
using (
  bucket_id = 'generated-images'
);

create policy "Users can update their own generated images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'generated-images'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'generated-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can delete their own generated images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'generated-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);
