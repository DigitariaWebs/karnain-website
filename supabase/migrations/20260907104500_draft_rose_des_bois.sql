-- Rose des Bois leaves the public catalog (ProgixDev/karnain-website#2).
-- Draft, not delete: the fragrance still has no approved bottle photograph, so it stays in the
-- admin (and in the old WooCommerce site, where it is a draft too) ready to be republished once
-- imagery exists. RLS on `fragrances` hides drafts from anon, so the public site loses it
-- immediately with no application-level filtering. The in-code seed drops the row entirely —
-- the seed mirrors published rows only.
update public.fragrances
set status = 'draft', is_new = false
where slug = 'rose-des-bois';
