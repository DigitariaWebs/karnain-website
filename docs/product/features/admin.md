# Supabase data layer & admin

**Status:** live (scaffolded, seed fallback) · **Slices:** src/core/supabase, src/features/catalog (repo), src/features/admin · **Routes:** /admin, /admin/login, /admin/nouveau, /admin/[slug]
**Spec history:** specs/005-supabase-admin (active 2026-06-07) · ADR-0005

## What it does (user terms)

The catalog can be served from Supabase and managed by an admin, without code deploys. With
no keys, the public site reads the in-code seed exactly as before. When keys are set, the
same pages read from Supabase, and an admin signs in at `/admin` (Supabase Auth, no public
sign-up) to create, edit, and delete fragrances. Visitors never see admin UI.

## How it works

- **Clients/config** (`src/core/supabase`): `config.ts` (`isSupabaseConfigured`, public
  `NEXT_PUBLIC_*`), `server.ts` (`@supabase/ssr` server client, cookies getAll/setAll),
  `client.ts` (browser client). Server-only modules guarded.
- **Read path** (`src/features/catalog`): `data.ts` selectors call `supabase-repo.ts`
  (server-only, zod-parsed rows) when configured, else return the seed — same signatures.
- **Admin** (`src/features/admin` + `src/app/(admin)`): route groups split public `(site)`
  chrome from the minimal `(admin)` chrome (URLs unchanged). `getAdminUser` gates pages;
  `actions.ts` (`"use server"`, zod-validated, re-checks session) does upsert/delete; admin
  components take **structural props** so the admin slice never imports the catalog feature.
- **Schema** (`supabase/migrations/*_init_catalog.sql`): `collections` + `fragrances`, RLS
  (public read, authenticated write), grants, and a seed insert mirroring `data.ts`.

## Decisions & gotchas

- 2026-06-07: **Fallback-first** — zero config required; the site never hard-fails on a data
  hiccup (repo returns `null` → seed). See ADR-0005.
- 2026-06-07: `price_eur` is `integer` (whole euros) so Supabase returns a number, not a
  numeric string (which would fail zod and silently fall back).
- 2026-06-07: write access is gated by RLS on an **`app_metadata.role = 'admin'` JWT claim**
  (not merely being authenticated — robust even if project sign-up is enabled). Set the claim
  on admin users in the Supabase dashboard. Only the URL + publishable key reach the browser;
  service-role key stays server.
- 2026-06-07: **Connected** — `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
  are set in Vercel; the catalog migration is applied (1 collection, 7 fragrances). Remaining:
  create an admin user with the `admin` role to use `/admin`.

## CUJs covered

- No public CUJ (admin is internal). Public CUJs A/B/C are unaffected by the route-group move.
