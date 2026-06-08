# Tasks 009 — Catalog enrichment

## Schema

- [x] Migration: `status` + `is_new` + `is_best_seller` on `fragrances`; draft‑hiding SELECT policy — AC-1
- [x] Apply to live Supabase (MCP) + mirror in `supabase/migrations`; advisors clean — AC-6

## Catalog

- [x] `types.ts`: status/isNew/isBestSeller — AC-1
- [x] `supabase-repo.ts`: zod + mapping — AC-1
- [x] `data.ts` seed: fields + public selectors filter published — AC-1, AC-5
- [x] `fragrance-card.tsx`: Nouveau / Best‑seller badge — AC-3
- [x] product page: multi‑paragraph description — AC-2

## Admin

- [x] `product-form.tsx`: status + flags fields — AC-4
- [x] `actions.ts`: zod + upsert — AC-4
- [x] `product-table.tsx`: draft badge — AC-4

## Content + i18n

- [x] Sync real descriptions + notes (subagent) → Supabase rows + seed — AC-5
- [x] `messages/fr.ts`: badge + admin status labels — AC-3, AC-4

## Verify

- [x] `pnpm verify` green; CUJ‑A/B/C pass
- [x] Live spot‑check (draft hides publicly, visible in admin), then deploy
