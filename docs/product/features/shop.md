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
  Storage (spec 010) — `Fragrance.images` holds repo paths and/or Storage URLs.
- 2026-09-07: **Rose des Bois left the public catalog** (issue #2) — dropped from the seed and set
  to `draft` in Supabase, so RLS hides it from anon with no app-level filtering. All six published
  fragrances now have a real bottle photograph; the tonal placeholder no longer shows in the grid.
- 2026-09-07: **`/api/checkout` hardened.** The bag is untrusted input, so its normalisation now
  lives in `normaliseBagLines` (`src/features/cart`) with tests for forged prices, unknown slugs,
  repeated slugs, a 5000-item flood and non-numeric quantities. Three fixes: the catalog is read
  **once** per request (it used to be re-read per item, so N items cost N round-trips);
  quantities **merge per slug**, bounding line count by catalog size (past Stripe's 100-item
  limit the Session fails _after_ the pending order is written, orphaning rows); and
  `success_url` no longer comes from `new URL(request.url).origin`, which reflects the `Host`
  header — a forged Host could land a buyer on an attacker's page with a real `session_id`.
- 2026-09-07: **`NEXT_PUBLIC_SITE_URL` is the canonical return origin** for Stripe redirects
  (`checkoutReturnOrigin`), falling back to Vercel's production domain and only then to the
  request. **Update it when the domain moves to karnain.fr**, or buyers keep returning to the
  vercel.app host after paying.
- 2026-09-07: the webhook now also handles `checkout.session.expired` and
  `async_payment_failed` → `cancelled`, scoped to `status = 'pending'` so a late duplicate can't
  walk a paid order backwards. Before this, abandoned checkouts sat `pending` forever and looked
  identical to one still being paid.
- 2026-09-07: ⚠️ **`checkout.session.completed` does not mean paid.** The Stripe account
  (`acct_1HiYqIGlrIp4MYll`, mp-parfum.fr) has **Klarna, iDEAL, Bancontact and BLIK** enabled, and
  a delayed method completes its Session with `payment_status: "unpaid"` while funds are still in
  flight. The old handler marked such an order `paid` — i.e. the back office would show a bottle
  as sold and shippable before the money landed. An order now moves to `paid` only on
  `payment_status === "paid"` or a later `async_payment_succeeded`; the buyer's details are still
  recorded on an unpaid session so a waiting order is identifiable.
- 2026-09-07: **Stripe is wired in TEST mode.** Webhook endpoint
  `we_1UD0RdGlrIp4MYllsoTBrBCd` → `/api/stripe/webhook`, subscribed to the four
  `checkout.session.*` events the handler implements. The account also serves the **live**
  WooCommerce shop (endpoint `https://www.karnain.fr/?wc-api=wc_stripe`, both modes) — leave that
  one alone.
- 2026-09-07: ⚠️ `STRIPE_SECRET_KEY` in Vercel is currently the **Stripe CLI's** test key, which
  **expires 2026-12-06**. It is fine for proving the flow, but replace it with a dashboard key
  (or the live keys at domain cutover) before relying on it — an expired key fails checkout
  silently, exactly like the paused-Supabase outage did.

## CUJs covered

- CUJ-B — Explore a fragrance, fill the bag ([critical-user-journeys.md](../critical-user-journeys.md))
