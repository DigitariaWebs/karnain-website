# Tasks 005 — Supabase data layer & admin

**Complete (scaffold) — `pnpm verify` green on the fallback path; admin renders the
unconfigured notice; CUJs A/B/C still pass (2026-06-07).**

## Data layer

- [x] `@supabase/ssr` + `@supabase/supabase-js` deps; ADR-0005 + index — AC-6
- [x] `core/supabase/{config,server,client}.ts` — AC-2, AC-6
- [x] `catalog/supabase-repo.ts` (zod-parsed) + `data.ts` seed fallback — AC-1, AC-2
- [x] `supabase/migrations/*_init_catalog.sql` (RLS + grants + seed) — AC-3
- [x] `.env.example` + optional `SUPABASE_SERVICE_ROLE_KEY` in `core/env.ts` — AC-6

## Admin

- [x] Route groups: `(site)` (public chrome) + `(admin)` (minimal chrome), URLs unchanged — AC-4
- [x] `features/admin`: `auth.ts`, `actions.ts` (zod, session-checked), components — AC-4, AC-5
- [x] `/admin` dashboard + `/admin/login` + `/admin/nouveau` + `/admin/[slug]` — AC-4, AC-5
- [x] Unconfigured → “connect Supabase” notice (no broken login) — AC-4

## Verify

- [x] `pnpm verify` green with no keys (fallback) — AC-1
- [x] Admin unconfigured state screenshot-verified; public CUJs e2e green
- [x] Feature doc (`docs/product/features/admin.md`), overview + ADR index updated

## Open (needs client)

- [ ] Supabase project URL + publishable key; run migration; create an admin user.
