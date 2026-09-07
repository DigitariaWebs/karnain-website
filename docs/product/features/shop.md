# Shop — product page & bag

**Status:** live · **Slices:** src/features/catalog (product UI), src/features/cart · **Routes:** /parfums/[slug], /panier
**Spec history:** specs/002-shop-product-and-cart (2026-06-07); checkout in specs/011-checkout-orders + 012-admin-integration-settings (2026-06-08)

## What it does (user terms)

A visitor opens a fragrance at `/parfums/<slug>`: an enlargeable gallery, the name and
collection, mood, description, scent notes, and price, with an “Ajouter au panier”
button. Adding opens a bag drawer and updates a header bag count; the bag (drawer and the
`/panier` page) shows lines, quantity controls, per-line removal, and a subtotal. The bag
persists across reloads. From the bag, **Commander** runs Stripe Checkout when configured
(otherwise it shows “paiement bientôt”); a paid order lands in the admin Orders back office. No
WhatsApp, no customer login.

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
  `loading`/`error`/`not-found`); `app/panier` → `CartView`; `app/collection` — the catalog
  grid with scent-family filters via `searchParams` (`?famille=…`, URL-as-state,
  server-rendered, works without client JS). `Fragrance.family` + `getFamilies()` back the
  filters (CUJ-C).

## Decisions & gotchas

- 2026-06-07: Commerce model changed from inquiry/WhatsApp to **cart/bag** (LV/JPG style).
  WhatsApp removed everywhere; contact is email only. See `docs/product/overview.md`.
- 2026-09-07: the **“Nous appeler” CTA is gone** (issue #1) from the homepage contact section
  and the footer, along with `site.phoneNumber`/`telLink` — the number was never more than a
  placeholder (`+33 1 00 00 00 00`) and the brand takes enquiries by email.
- 2026-06-08: **Checkout shipped (Stripe).** `CheckoutButton` asks `GET /api/checkout` whether
  checkout is live, then posts the bag to `/api/checkout` → Stripe Checkout Session; the webhook
  marks the order `paid`; `/commande/merci` confirms + clears the bag. Gated on config (no keys →
  “paiement bientôt”). Credentials are admin-managed (`/admin/parametres`). See spec 011/012,
  ADR-0006, and `docs/product/features/admin.md`. Legal/CGV copy still pending.
- 2026-06-07: Bag is a **guest bag** persisted in `localStorage` (`karnain-cart`); the
  count is hydration-guarded so server HTML and first client render match.
- 2026-06-08: Catalog content is the brand’s **real copy + full notes** (spec 009); descriptions
  render multi-paragraph; cards show Nouveau/Best-seller badges. Admins upload photos to Supabase
  Storage (spec 010) — `Fragrance.images` holds repo paths and/or Storage URLs. **Sucre Addictée +
  Rose des Bois** still have no photos (tonal placeholder) until uploaded.

## CUJs covered

- CUJ-B — Explore a fragrance, fill the bag ([critical-user-journeys.md](../critical-user-journeys.md))
