# Plan 003 — Collection page

URL-as-state, server-rendered. One feature touched (`catalog`); one new route.

## Catalog (`src/features/catalog`)

- `types.ts`: add `family: string` to `Fragrance` (French scent-family label).
- `data.ts`: tag the 7 seed fragrances — “Boisés & ambrés” (Tobacco, Cuir 90),
  “Floraux” (Rose des Îles, Rose des Bois), “Gourmands” (Tentation, Sucre Addictée,
  Cherry Je t’aime). Add `getFamilies()` → distinct labels in display order.
- `index.ts`: export `getFamilies`.

## Route (`src/app/collection/page.tsx`, server)

- Reads `searchParams` (`{ famille?: string }`, a Promise in Next 16). Filters
  `getFragrances()` by family when `famille` matches a known family; otherwise shows all.
- Renders: page header (eyebrow, “Karnain Addicte”, intro), a row of filter chips — “Tout”
  - each family — as `<Link href="/collection?famille=…">` (active state styled, no client
    JS), then `FragranceGrid`. `generateMetadata` static title.
- URL is the state (docs/conventions/state.md): no store, shareable, bookmarkable.

## Wiring updates (point “collection” at the real page)

- `messages/fr.ts`: `nav.items` Collection href `/#collection` → `/collection`; add
  `collectionPage` strings (title, intro, filterAll, filterLabel).
- Hero primary CTA (`app/page.tsx`) `#collection` → `/collection`.
- Product back link + cart empty CTAs `/#collection` → `/collection`.

## Verification

- e2e `e2e/collection.spec.ts` (CUJ-C): `/collection` lists fragrances; click a family
  filter → URL has `?famille=`, grid narrows; open a fragrance. Desktop + mobile shots.
- `pnpm verify` green; inspect screenshots vs AC-1…AC-5.

## Conflict check

Builds on 002 (in `main`). Touches `catalog` + new `app/collection` route + a few link
hrefs. No other active spec overlaps.
