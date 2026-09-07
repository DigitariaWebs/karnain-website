-- Sync the Supabase catalog with the in-code seed (`src/features/catalog/data.ts`).
--
-- The 2026-06-07 init migration carries the *original* short placeholder copy. The brand's real
-- descriptions and full note pyramids were entered later through the admin, so they lived only in
-- the old Supabase project — which is now unreachable. `data.ts` is the surviving record of that
-- content, so this migration replays it into the database: a fresh project rebuilt from
-- migrations alone now matches what the site actually serves instead of regressing to the
-- placeholder copy.
--
-- Idempotent upsert. Runs after the Rose des Bois draft migration and does not touch that row, so
-- it stays a draft.

insert into public.collections (slug, name, baseline, description, sort_order) values
  ('karnain-addicte', 'Karnain Addicte', 'La collection signature', 'Des parfums d''exception — les classiques que les amoureux du parfum se doivent de posséder.', 0)
on conflict (slug) do update set
  name = excluded.name, baseline = excluded.baseline, description = excluded.description;

insert into public.fragrances
  (slug, collection_slug, family, name, price_eur, mood, description, notes, images,
   featured, status, is_new, is_best_seller, sort_order)
values
  ('tobacco', 'karnain-addicte', 'Boisés & ambrés', 'Tobacco', 195, 'Chaud, boisé, enveloppant.', 'Tobacco est un mélange délicieusement complexe de notes chaudes et fraîches. La base de tabac crée une sensation de sophistication et de mystère, tandis que la framboise ajoute une touche de fraîcheur et d''élégance.

Au cœur, le cuir robuste et fumé se marie avec la profondeur aromatique du tabac, créant une ambiance chaleureuse et enveloppante. Les fleurs délicates de violette, de muguet et de rose apportent un contraste doux et floral.

Le fond repose sur une base sensuelle où l''ambre et le musc s''entrelacent. La vanille douce, associée aux nuances terreuses du patchouli et de la fève tonka, ajoute une dimension addictive et chaleureuse.',
   '{"head": ["Framboise", "Safran", "Bergamote"], "heart": ["Cuir", "Tabac", "Violette", "Muguet", "Rose"], "base": ["Ambre", "Musc", "Vanille", "Patchouli", "Fève Tonka"]}'::jsonb, '{"/images/fragrances/tobacco.png"}',
   true, 'published', false, true, 0),
  ('cuir-90', 'karnain-addicte', 'Boisés & ambrés', 'Cuir 90', 195, 'Cuir noble, fumé, racé.', '« Cuir 90 » est un parfum de niche audacieux, un hommage à la fusion entre le raffinement et la puissance brute. Dès l''ouverture, une framboise juteuse éclate avec une vivacité fruitée, avant de laisser place à un cœur dominé par une note de cuir intense et fumé, renforcée par la fève tonka et l''encens.

En fond, le parfum se pose sur un accord sensuel de musc enveloppant, enrichi de vanille crémeuse. L''ambre ajoute une touche de chaleur dorée, tandis que le bois de cèdre structure l''ensemble avec une élégance boisée et intemporelle.',
   '{"head": ["Framboise"], "heart": ["Cuir", "Fève Tonka", "Encens"], "base": ["Musc", "Vanille", "Ambre", "Bois de cèdre"]}'::jsonb, '{"/images/fragrances/cuir-90.png"}',
   true, 'published', false, true, 1),
  ('rose-des-iles', 'karnain-addicte', 'Floraux', 'Rose des Îles', 195, 'Rose solaire, voyageuse.', '« Rose des Îles » est un mélange équilibré de notes florales de rose et de bergamote, combiné à des notes plus profondes de musc et de vanille — parfait pour toutes les occasions.

La rose apporte une touche de fraîcheur et de sensualité, tandis que la bergamote ajoute une note citronnée qui réveille les sens. Le musc et la vanille apportent une profondeur et une chaleur à la fragrance.',
   '{"head": ["Bergamote"], "heart": ["Rose", "Muguet"], "base": ["Vanille", "Musc", "Ambre"]}'::jsonb, '{"/images/fragrances/rose-des-iles.png"}',
   true, 'published', false, true, 2),
  ('tentation', 'karnain-addicte', 'Gourmands', 'Tentation', 195, 'Gourmand, sensuel, irrésistible.', '« Tentation » est une véritable gourmandise olfactive, un parfum qui séduit par son audace sucrée et sa profondeur sensuelle. Dès les premières notes, une fraise éclatante se mêle à la richesse sombre du cacao.

Au cœur, le parfum s''intensifie avec des accords de chocolat fondant et de barbe à papa, un mélange sucré et nostalgique. En fond, une base crémeuse de vanille douce, renforcée par un musc sensuel et une touche ambrée.',
   '{"head": ["Fraise", "Cacao"], "heart": ["Chocolat", "Barbe à papa", "Sucré"], "base": ["Vanille", "Musc", "Ambre"]}'::jsonb, '{"/images/fragrances/tentation.png"}',
   true, 'published', false, true, 3),
  ('sucre-addictee', 'karnain-addicte', 'Gourmands', 'Sucre Addictée', 195, 'Sucré, addictif, lumineux.', '« Sucre Addictée » est une explosion de gourmandise pure. Dès les premières notes, une barbe à papa aérienne se mêle à la pomme d''amour croquante, rappelant les douceurs de l''enfance.

Au cœur, la gourmandise devient plus intense avec un accord de sucre noir et de caramel fondant, relevé d''une touche d''anis. Le fond est dominé par la vanille crémeuse et une base ambrée chaude et réconfortante.',
   '{"head": ["Barbe à papa", "Pomme d''amour"], "heart": ["Sucre noir", "Caramel", "Anis"], "base": ["Vanille", "Ambre"]}'::jsonb, '{}',
   false, 'published', true, false, 4),
  ('cherry-je-taime', 'karnain-addicte', 'Gourmands', 'Cherry Je t''aime', 195, 'Cerise pétillante, audacieuse.', '« Cherry, Je t''aime » est une fragrance vibrante où les fruits rouges rencontrent des épices et des bois précieux. L''ouverture est éclatante avec un mélange juteux de cassis et de framboise, dynamisé par la bergamote et le safran.

Au cœur, la cerise pulpeuse s''entrelace avec la fève tonka et l''amande, créant un accord gourmand et addictif, rehaussé de rose et de jasmin. En fond, l''ambre chaud, le musc et les bois de gaïac, vétiver et santal forment une base luxueuse, adoucie par la vanille.',
   '{"head": ["Cassis", "Framboise", "Safran", "Bergamote"], "heart": ["Fève Tonka", "Cerise", "Amande", "Patchouli", "Rose", "Jasmin"], "base": ["Ambre", "Musc", "Vétiver", "Bois de gaïac", "Santal", "Vanille"]}'::jsonb, '{"/images/fragrances/cherry-je-taime.png"}',
   false, 'published', true, false, 5)
on conflict (slug) do update set
  collection_slug = excluded.collection_slug,
  family          = excluded.family,
  name            = excluded.name,
  price_eur       = excluded.price_eur,
  mood            = excluded.mood,
  description     = excluded.description,
  notes           = excluded.notes,
  images          = excluded.images,
  featured        = excluded.featured,
  status          = excluded.status,
  is_new          = excluded.is_new,
  is_best_seller  = excluded.is_best_seller,
  sort_order      = excluded.sort_order;

-- Rows the seed does not carry (drafts kept for the admin) sort after it, so the admin list has a
-- stable order instead of colliding with a seeded sort_order. Guarded so re-runs are idempotent.
update public.fragrances
set sort_order = 100 + sort_order
where sort_order < 100
  and slug not in ('tobacco', 'cuir-90', 'rose-des-iles', 'tentation', 'sucre-addictee', 'cherry-je-taime');
