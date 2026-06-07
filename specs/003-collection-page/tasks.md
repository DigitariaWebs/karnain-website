# Tasks 003 — Collection page

Each task maps to acceptance criteria in `spec.md`.

## Catalog

- [ ] `Fragrance.family` on type + tag 7 seed fragrances — AC-2
- [ ] `getFamilies()` selector + export — AC-2

## Route + wiring

- [ ] `app/collection/page.tsx`: grid + family filter chips via `searchParams` — AC-1, AC-2, AC-3, AC-5
- [ ] `collectionPage` strings in `messages/fr.ts` — AC-1
- [ ] Point nav/hero/back/cart links to `/collection` — AC-4

## Verify

- [ ] `e2e/collection.spec.ts` CUJ-C (list, filter via URL, open product) — AC-1…AC-5
- [ ] Register CUJ-C; update living feature doc(s)
- [ ] `pnpm verify` green + `pnpm e2e:shots` inspected
