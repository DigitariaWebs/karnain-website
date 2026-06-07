# Shop — product page & bag

**Status:** live · **Slices:** src/features/catalog (product UI), src/features/cart · **Routes:** /parfums/[slug], /panier
**Spec history:** specs/002-shop-product-and-cart (active 2026-06-07)

## What it does (user terms)

A visitor opens a fragrance at `/parfums/<slug>`: an enlargeable gallery, the name and
collection, mood, description, scent notes, and price, with an “Ajouter au panier”
button. Adding opens a bag drawer and updates a header bag count; the bag (drawer and the
`/panier` page) shows lines, quantity controls, per-line removal, and a subtotal. The bag
persists across reloads. Checkout/online payment is marked as coming soon. No WhatsApp,
no customer login.

## How it works

- **Cart slice** (`src/features/cart`): SSR-safe Zustand factory (`createCartStore`) with
  `persist` (lines only) + `devtools`, provided via `CartStoreProvider` (wrapped in
  `app/layout.tsx`). `lib.ts` has pure `cartCount`/`cartSubtotal`. UI: `AddToBagButton`,
  `BagButton` (count gated by `useHydrated` to avoid SSR mismatch), `CartDrawer`,
  `CartLineRow`, `CartView`. The header (shared) receives `BagButton`/`CartDrawer` from
  `app` as props/elements so shared never imports a feature.
- **Catalog product UI** (`src/features/catalog`): `FragranceGallery` (client lightbox,
  keyboard + reduced-motion), `ScentNotes` (server pyramid), `FragranceCard` (linked).
- **Routes**: `app/parfums/[slug]` (`generateStaticParams` + `generateMetadata`,
  `loading`/`error`/`not-found`); `app/panier` → `CartView`.

## Decisions & gotchas

- 2026-06-07: Commerce model changed from inquiry/WhatsApp to **cart/bag** (LV/JPG style).
  WhatsApp removed everywhere; contact is email + phone concierge. See `docs/product/overview.md`.
- 2026-06-07: **Checkout/payment deferred** — the cart page shows a disabled
  “Passer la commande” + “coming soon”. Stripe + legal/CGV are a separate spec.
- 2026-06-07: Bag is a **guest bag** persisted in `localStorage` (`karnain-cart`); the
  count is hydration-guarded so server HTML and first client render match.
- 2026-06-07: Gallery imagery is placeholder; pass real `src` to `GalleryImage` and render
  `next/image` in `fragrance-gallery.tsx` when the asset zip arrives.

## CUJs covered

- CUJ-B — Explore a fragrance, fill the bag ([critical-user-journeys.md](../critical-user-journeys.md))
