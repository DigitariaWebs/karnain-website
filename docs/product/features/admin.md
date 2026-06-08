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
  are set in Vercel; the catalog migration is applied (1 collection, 7 fragrances).
- 2026-06-08: an admin user exists (`admin@karnain.fr`) with the `admin` role claim; sign in at
  `/admin`. Credentials are not stored in the repo; rotate the password in the Supabase dashboard.
  Note: GoTrue rejects hand‑inserted `auth.users` rows whose token columns are `NULL` (“Database
  error querying schema”) — set `confirmation_token`/`recovery_token`/`email_change*`/etc. to `''`.

## Decisions & gotchas (spec 009)

- 2026-06-08: fragrances carry **`status`** (`published`/`draft`), **`is_new`**, and
  **`is_best_seller`**. **RLS hides drafts** from non-admins (`status = 'published' or role =
'admin'`), so the app filters nothing — anon reads (incl. `generateStaticParams`) see
  published only; the admin (role claim) sees all. Cards show a discreet Nouveau/Best-seller
  badge; the admin form edits status + flags; the dashboard badges drafts.
- 2026-06-08: the catalog now holds the **brand's real descriptions + full notes** (synced
  from the old WooCommerce site). Old-site has 3 draft-only products (Mon Chéri, Nuit
  Parisienne, and Rose des Bois is a draft there) — not yet added here; tracked in spec 009.

## CUJs covered

- No public CUJ (admin is internal). Public CUJs A/B/C are unaffected by the route-group move.
