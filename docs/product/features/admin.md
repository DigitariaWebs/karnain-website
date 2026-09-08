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
- 2026-09-07: **Rose des Bois is now a draft here too** (issue #2), matching the old site —
  migration `20260907104500_draft_rose_des_bois.sql`. It stays visible and editable in the admin;
  only anon reads lose it.
- 2026-09-07: **the original Supabase project was abandoned and replaced.**
  `kjpwmhprxnltnpnmmwls` paused (free-tier projects pause after ~7 days idle) and Supabase drops
  the API subdomain of a paused project, so it went to NXDOMAIN: `/admin` login could not reach
  GoTrue and every catalog read fell back to the in-code seed. The public site looked healthy
  throughout — that is the fallback-first design (ADR-0005) working, and it is why the outage was
  silent. **Watch for that:** a silent fallback means the admin can be dead for days without a
  visible symptom.
- 2026-09-07: **now on project `woiyirrztyefnkdrykgh`**, rebuilt from the repo migrations. The old
  project's data was unrecoverable, so the catalog was replayed from `src/features/catalog/data.ts`
  via `20260907120000_sync_catalog_with_seed.sql` — the init migration alone would have restored
  the 2026-06-07 _placeholder_ copy, not the brand's real descriptions. Admin user
  `admin@karnain.fr` recreated with the `admin` role claim (plus the `auth.identities` row current
  GoTrue needs for password sign-in — users hand-inserted without it fail with “Invalid login
  credentials”). Verified live: anon reads 6 published rows, admin reads 7 including the draft,
  anon writes rejected with 42501, `app_settings` and `orders` unreadable by anon.

## Account security (2026-09-08)

- **`/admin/securite`** holds both controls: change password, and enrol/remove a TOTP second
  factor. Linked from the dashboard and from Paramètres.
- **Password change re-checks the current password** before applying, which Supabase does not
  require. Without it, anyone reaching an unlocked laptop with a live session could lock the owner
  out of their own shop in two clicks.
- **Second factor is TOTP (authenticator app).** Supabase Auth offers TOTP and phone only — there
  is **no WebAuthn/passkey factor**, confirmed against the docs, so passkeys are not available
  here however desirable. TOTP is the better of the two on offer: offline, free per sign-in, and
  immune to SIM swap.
- **Enforcement is the part that matters.** A verified factor leaves a password-only session at
  `aal1`; `getAdminUser` reports that as `mfaRequired` and **`guardAdminPage` treats it exactly
  like signed out**. Every admin page now goes through that one guard rather than repeating its
  own check — six copies of a two-line check is how a new screen forgets the third condition.
- **Server actions are held to the same bar** via `getAdminClient`. RLS keys on the `role` claim,
  which an `aal1` session already carries, so checking only for a user would have left MFA
  guarding the screens while every write stayed open. `signOutAdmin` is deliberately exempt —
  you must be able to leave a half-authenticated session.
- Resolving the assurance level **fails closed**: any error is treated as “MFA required”.
- Gotcha: Supabase refuses a second enrolment while an unverified factor is outstanding, so the
  form clears stale attempts before starting a new one — otherwise an abandoned enrolment wedges
  the screen permanently.
- **Recovery:** losing the authenticator means the factor must be deleted from the Supabase
  dashboard (Authentication → Users → the user). There is no self-service reset.

## Image upload (spec 010)

- Photos upload to a public Supabase Storage bucket **`product-images`**; RLS allows public read
  but **admin-only write** (`app_metadata.role = 'admin'`). The admin form's `ImageUploader`
  (client) uploads via the browser Supabase client and stores the public URLs in
  `fragrances.images`; the first image is primary. `next.config` `remotePatterns` lets
  `next/image` serve Storage URLs (repo `/images/...` paths still work).
- Removing a thumbnail drops it from the list but does not delete the Storage object (orphan
  cleanup is a later concern). Verified live end-to-end (admin upload, public read, anon denied).

## Checkout + Orders (spec 011)

- Bag → `/api/checkout` (app route): **re-prices from the catalog** (client prices never
  trusted), creates a `pending` order via the **service-role** client, then a Stripe Checkout
  Session; `/api/stripe/webhook` marks it `paid`. `/commande/merci` confirms + clears the bag.
- Orders (`orders` + `order_items`) are **admin-only** (RLS role claim); the admin reads them
  with their own session. `/admin/commandes` lists orders; `/admin/commandes/[id]` shows items
  and a status update (`pending → paid → fulfilled → cancelled`).
- Gated on config: no Stripe keys ⇒ the bag shows “paiement bientôt” and `pnpm verify` stays
  green. Going live needs `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`,
  `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`. See ADR-0006.

## CUJs covered

- No public CUJ (admin is internal). Public CUJs A/B/C are unaffected by the route-group move.
