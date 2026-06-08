# Plan 009 — Catalog enrichment

Builds on the live Supabase catalog (spec 005). Schema changes go to the live project via the
Supabase MCP and are mirrored in the repo migration + seed.

## Schema (Supabase, via MCP `apply_migration`; mirror in `supabase/migrations`)

- `fragrances`: add `status text not null default 'published'` (+ check in
  `('published','draft')`), `is_new boolean not null default false`,
  `is_best_seller boolean not null default false`.
- Replace the fragrances SELECT policy so **drafts are hidden from non‑admins at the DB level**:
  `using (status = 'published' or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')`.
  → public (anon key) reads see published only; the admin (role claim) sees all. No app‑level
  filtering needed; `generateStaticParams` (anon at build) naturally excludes drafts.

## Catalog slice

- `types.ts`: `Fragrance` gains `status: "published" | "draft"`, `isNew`, `isBestSeller`.
- `supabase-repo.ts`: extend the zod row schema + mapping (`status`, `is_new`, `is_best_seller`).
- `data.ts` (seed): add the fields to all 7; public seed selectors filter `status === "published"`
  for local/CI parity (admin uses Supabase only).
- `fragrance-card.tsx`: discreet badge — “Best‑seller” (priority) or “Nouveau”.

## Public rendering (`app/(site)`)

- Product page: render the description as **paragraphs** (split on blank lines), not one block.

## Admin slice

- `product-form.tsx`: add `status` (Publié/Brouillon select), `is_new`, `is_best_seller` toggles.
- `actions.ts`: zod adds `status` (enum), `isNew`, `isBestSeller`; included in the upsert.
- `product-table.tsx`: show a “Brouillon” badge for drafts.

## Content sync (real copy + notes)

- A subagent extracts the authentic descriptions + full notes from the live product pages →
  update the Supabase rows (via MCP `execute_sql`) **and** the in‑code seed to match.

## i18n

- Add `badges` (`new`, `bestSeller`) + admin `status`/`draft`/`published` labels to `messages/fr.ts`.

## Verification

- `pnpm verify` green; CUJ‑A/B/C pass (drafts never appear publicly).
- Apply migration to live Supabase; re‑run `get_advisors` (security) → expect clean.
- Spot‑check live: set one fragrance to draft → it disappears from the public collection but
  remains in admin; revert.

## Conflict check

Touches `catalog` + `admin` slices, the live Supabase schema, and product/card rendering. No
other active spec overlaps. Image upload (Storage) and checkout are separate, later specs.
