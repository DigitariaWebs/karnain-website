# Plan 002 — Shop: fragrance product page & bag

Two slices (`catalog` for product UI, new `cart` for the bag) + two routes. No cross-feature
imports: routes in `app` compose both slices’ public APIs; the header (shared) uses the
cart slice’s public API for the bag button + drawer.

## Cart slice (`src/features/cart`) — the SSR-safe Zustand pattern

- `types.ts`: `CartLine` (slug, name, priceEur, quantity), `CartItemInput`.
- `store.ts`: `createCartStore()` — vanilla `createStore` + `devtools` + `persist`
  (`name: "karnain-cart"`, `partialize` to lines only, `createJSONStorage(() => localStorage)`).
  State: `lines`, `isOpen`; actions `addItem`, `setQuantity`, `removeItem`, `clear`,
  `openCart`, `closeCart`. Per docs/conventions/state.md (factory, never a singleton).
- `provider.tsx` (`"use client"`): context + `useState(() => createCartStore())` per mount +
  `useCartStore(selector)` hook.
- `lib.ts`: pure `cartCount(lines)` / `cartSubtotal(lines)` selectors (unit-tested).
- `components/` (`"use client"`): `add-to-bag-button.tsx`, `bag-button.tsx` (icon + count,
  hydration-guarded), `cart-drawer.tsx` (slide-over, `AnimatePresence`, Esc/focus, lines +
  subtotal + go-to-cart), `cart-line-row.tsx` (qty stepper + remove), `cart-view.tsx`
  (full cart-page body + empty state + checkout-soon).
- `store.test.ts` + `lib.test.ts`: headless (add merges qty, setQuantity 0 removes, subtotal).
- `index.ts`: public API (provider, hook is internal; export the components + `CartStoreProvider`).

Wire `CartStoreProvider` in `app/layout.tsx` around header + main + footer so the bag is
shared everywhere. `bag-button` renders the count only after mount (AC-4, no SSR mismatch).

## Catalog additions (`src/features/catalog`)

- `components/fragrance-gallery.tsx` (`"use client"`): main image + thumbnails; lightbox
  (`m` + `AnimatePresence`, prev/next/close, Escape + arrows, focus the close, scroll lock).
  Accepts `images: readonly { src?: string; alt: string }[]` — absent `src` → tonal
  placeholder, so `next/image` swaps in later.
- `components/scent-notes.tsx` (server): head/heart/base pyramid with labels.
- `components/fragrance-card.tsx`: already linked to `/parfums/<slug>` (done).
- Export gallery + scent-notes from `index.ts`.

## Routes (`app`)

- `parfums/[slug]/page.tsx` (server): `getFragrance` → `notFound()`; gallery + info
  (name, collection, mood, description, `ScentNotes`, price, `AddToBagButton`) + “à
  découvrir aussi”. `generateStaticParams` + `generateMetadata`. `loading.tsx`,
  `error.tsx` (client), `not-found.tsx` (French).
- `panier/page.tsx` (server shell) → `CartView` (client).

## Copy / config changes (WhatsApp removed)

- `messages/fr.ts`: add `cart` + `product` blocks (add-to-bag, bag, panier, subtotal, qty,
  remove, empty, checkout-soon, gallery a11y, notes labels). Remove WhatsApp strings; the
  homepage contact + footer use email + phone (concierge), bag icon replaces WhatsApp CTA.
- `core/site.ts`: drop the WhatsApp helper; add `phoneNumber` + `telLink`. Keep `emailLink`.
- Retrofit `app/page.tsx` (hero secondary + contact section), `site-header.tsx` (+ bag),
  `site-footer.tsx` (commander column → service/contact). Update `e2e/home.spec.ts`
  assertion that referenced WhatsApp.

## Verification

- Unit: cart store + lib tests; existing catalog tests.
- e2e `e2e/product.spec.ts` (CUJ-B): product name + notes + add to bag → drawer + subtotal →
  `/panier`; `/parfums/does-not-exist` not-found. Update home spec (no WhatsApp; bag present).
- `pnpm verify` green; `pnpm e2e:shots` desktop/mobile/lightbox/drawer inspected vs AC-1…AC-7.

## Conflict check

Builds on 001 (in `main`). New `cart` slice + `app/parfums` + `app/panier`; catalog product
UI; header gains the bag. No other active spec overlaps. Commerce-model change recorded in
`docs/product/overview.md` (Article I).
