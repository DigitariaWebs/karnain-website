-- Product images Storage bucket (public read, admin-only write) for the admin uploader.

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

drop policy if exists "product-images read" on storage.objects;
drop policy if exists "product-images admin insert" on storage.objects;
drop policy if exists "product-images admin update" on storage.objects;
drop policy if exists "product-images admin delete" on storage.objects;

create policy "product-images read" on storage.objects for select to anon, authenticated
  using (bucket_id = 'product-images');
create policy "product-images admin insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'product-images' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "product-images admin update" on storage.objects for update to authenticated
  using (bucket_id = 'product-images' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check (bucket_id = 'product-images' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "product-images admin delete" on storage.objects for delete to authenticated
  using (bucket_id = 'product-images' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
