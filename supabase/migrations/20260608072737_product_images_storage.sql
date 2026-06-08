-- Product images Storage bucket (public read, admin-only write) for the admin uploader.

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

drop policy if exists "product-images read" on storage.objects;
drop policy if exists "product-images admin read" on storage.objects;
drop policy if exists "product-images admin insert" on storage.objects;
drop policy if exists "product-images admin update" on storage.objects;
drop policy if exists "product-images admin delete" on storage.objects;

-- Public-bucket object URLs serve without a SELECT policy; scope listing to admins so anon
-- can't enumerate the bucket (advisor 0025).
create policy "product-images admin read" on storage.objects for select to authenticated
  using (bucket_id = 'product-images' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "product-images admin insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'product-images' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "product-images admin update" on storage.objects for update to authenticated
  using (bucket_id = 'product-images' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check (bucket_id = 'product-images' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "product-images admin delete" on storage.objects for delete to authenticated
  using (bucket_id = 'product-images' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
