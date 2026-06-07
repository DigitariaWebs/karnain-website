# Plan 005 — Supabase data layer & admin

Fallback-first: nothing breaks without keys. `@supabase/ssr` for App Router.

## Config + clients (`src/core/supabase`)

- `config.ts` (plain, no `server-only`): reads `NEXT_PUBLIC_SUPABASE_URL` +
  `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (fallback `…_ANON_KEY`). `isSupabaseConfigured()`.
  Safe in client + server + tests.
- `server.ts` (`server-only`): `createServerClient` with `cookies()` (`getAll`/`setAll`,
  try/catch for RSC where set is a no-op). Returns the client; callers check config first.
- `client.ts`: `createBrowserClient` factory for client components (admin login).

## Catalog repository + fallback (`src/features/catalog`)

- `supabase-repo.ts` (`server-only`): query `collections`/`fragrances`, map rows → domain
  types; return `null` on error so callers fall back.
- `data.ts`: keep the seed + pure seed selectors (still unit-tested). Each public selector:
  `if (isSupabaseConfigured()) { const repo = await import("./supabase-repo"); … ?? seed }`.
  Dynamic import keeps `server-only` out of tests/client; unconfigured → seed (today’s path).

## Schema (`supabase/migrations/<ts>_init_catalog.sql`)

- `collections` (slug pk, name, baseline, description, sort_order).
- `fragrances` (slug pk, collection_slug fk, family, name, price_eur, mood, description,
  notes jsonb, images text[], featured bool, sort_order).
- RLS enabled on both; `select` policy for `anon`+`authenticated`; `insert/update/delete`
  for `authenticated`. Grants accordingly. Seed insert of the 7 fragrances + collection.

## Admin (`src/app/(admin)`, `src/features/admin`)

- Route groups: move public routes under `src/app/(site)` (current shell layout); admin
  under `src/app/(admin)/admin` with its own minimal layout (no public header/footer/cart).
  Route groups don’t change URLs — e2e unaffected.
- `(admin)/admin/login/page.tsx`: client login form → `signInWithPassword`. If unconfigured,
  show the “connect Supabase” notice.
- `(admin)/admin/page.tsx`: server, `getUser()`; unauth → redirect to login; lists fragrances.
- `features/admin`: `actions.ts` (`"use server"`, zod-validated create/update/delete using the
  server client; re-check session), product form + list components. Guarded on config.

## Env, deps, docs

- `core/env.ts`: add optional `SUPABASE_SERVICE_ROLE_KEY` (server, optional — not used yet)
  and document public vars. `.env.example` with all Supabase vars (empty).
- New deps `@supabase/ssr` + `@supabase/supabase-js` → ADR-0005 (Supabase is the chosen data
  layer per the brief; record it). Add ADR to the decisions index.

## Verification

- `pnpm verify` green with NO keys (fallback path). Catalog unit tests unchanged.
- Drive `/admin` locally (unconfigured) → shows the connect-Supabase notice; screenshot.
- e2e CUJs A/B/C still green (URLs unchanged by route groups).

## Conflict check

Builds on 004 (in `main`). New `core/supabase`, `features/admin`, `app/(admin)`, route-group
move of public pages, catalog repo. No other active spec overlaps.
