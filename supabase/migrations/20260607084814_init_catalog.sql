-- Karnain catalog schema: collections + fragrances.
-- RLS enabled on both: public read (anon + authenticated); write restricted to admins,
-- identified by an `app_metadata.role = 'admin'` JWT claim (set on admin users in the
-- Supabase dashboard). This is independent of the project's sign-up setting.

create table if not exists public.collections (
  slug text primary key,
  name text not null,
  baseline text not null default '',
  description text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.fragrances (
  slug text primary key,
  collection_slug text not null references public.collections (slug) on delete restrict,
  family text not null default '',
  name text not null,
  price_eur integer not null default 0,
  mood text not null default '',
  description text not null default '',
  notes jsonb not null default '{"head":[],"heart":[],"base":[]}'::jsonb,
  images text[] not null default '{}',
  featured boolean not null default false,
  status text not null default 'published' check (status in ('published', 'draft')),
  is_new boolean not null default false,
  is_best_seller boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists fragrances_collection_slug_idx
  on public.fragrances (collection_slug);

-- Row Level Security
alter table public.collections enable row level security;
alter table public.fragrances enable row level security;

create policy "collections public read"
  on public.collections for select to anon, authenticated using (true);
create policy "collections admin write"
  on public.collections for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Public reads see published only; admins (role claim) see drafts too.
create policy "fragrances read"
  on public.fragrances for select to anon, authenticated
  using (status = 'published' or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "fragrances admin write"
  on public.fragrances for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Data API grants (RLS still governs which rows are visible/writable).
grant select on public.collections, public.fragrances to anon, authenticated;
grant insert, update, delete on public.collections, public.fragrances to authenticated;

-- Seed: mirrors src/features/catalog/data.ts (idempotent).
insert into public.collections (slug, name, baseline, description, sort_order) values
  ('karnain-addicte', 'Karnain Addicte', 'La collection signature', 'Des parfums d''exception — les classiques que les amoureux du parfum se doivent de posséder.', 0)
on conflict (slug) do nothing;

insert into public.fragrances
  (slug, collection_slug, family, name, price_eur, mood, description, notes, images, featured, sort_order)
values
  ('tobacco', 'karnain-addicte', 'Boisés & ambrés', 'Tobacco', 195, 'Chaud, boisé, enveloppant.', 'Un tabac blond adouci d''épices et de vanille, pour un sillage chaleureux qui s''attarde.', '{"head":["Bergamote"],"heart":["Tabac blond","Épices douces"],"base":["Vanille","Bois précieux"]}', '{"/images/fragrances/tobacco-1.png"}', true, 0),
  ('cuir-90', 'karnain-addicte', 'Boisés & ambrés', 'Cuir 90', 195, 'Cuir noble, fumé, racé.', 'Un cuir précieux relevé de safran et d''iris, signé d''une base d''oud et d''ambre.', '{"head":["Safran"],"heart":["Cuir","Iris"],"base":["Oud","Ambre"]}', '{"/images/fragrances/cuir-90-1.png","/images/fragrances/cuir-90-2.png"}', true, 1),
  ('rose-des-iles', 'karnain-addicte', 'Floraux', 'Rose des Îles', 195, 'Rose solaire, voyageuse.', 'Une rose de Mai lumineuse, portée par le jasmin et adoucie d''un musc poudré.', '{"head":["Poivre rose"],"heart":["Rose de Mai","Jasmin"],"base":["Musc","Bois de santal"]}', '{"/images/fragrances/rose-des-iles-1.png","/images/fragrances/rose-des-iles-2.png"}', true, 2),
  ('tentation', 'karnain-addicte', 'Gourmands', 'Tentation', 195, 'Gourmand, sensuel, irrésistible.', 'Fleur d''oranger et praline sur un fond de vanille et de fève tonka — une gourmandise.', '{"head":["Mandarine"],"heart":["Fleur d''oranger","Praline"],"base":["Vanille","Fève tonka"]}', '{"/images/fragrances/tentation-1.png","/images/fragrances/tentation-2.png"}', true, 3),
  ('sucre-addictee', 'karnain-addicte', 'Gourmands', 'Sucre Addictée', 195, 'Sucré, addictif, lumineux.', 'Un cœur de caramel et de fleurs blanches, addictif comme une note d''enfance.', '{"head":["Fruits rouges"],"heart":["Caramel","Fleurs blanches"],"base":["Vanille","Musc"]}', '{}', false, 4),
  ('rose-des-bois', 'karnain-addicte', 'Floraux', 'Rose des Bois', 195, 'Rose boisée, profonde.', 'Une rose ample posée sur le cèdre et le patchouli, élégante et tenace.', '{"head":["Bergamote"],"heart":["Rose","Pivoine"],"base":["Cèdre","Patchouli"]}', '{}', false, 5),
  ('cherry-je-taime', 'karnain-addicte', 'Gourmands', 'Cherry Je t''aime', 195, 'Cerise pétillante, audacieuse.', 'La cerise gourmande rencontre l''amande et la rose, sur un fond tonka et vanille.', '{"head":["Cerise"],"heart":["Amande","Rose"],"base":["Fève tonka","Vanille"]}', '{"/images/fragrances/cherry-je-taime-1.png"}', false, 6)
on conflict (slug) do nothing;
