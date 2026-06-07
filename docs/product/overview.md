# Product Overview

Karnain is a luxury perfume house based in France (current site: karnain.fr). This
project rebuilds the brand’s website as a refined, French-inspired showcase: elegant
collection and product storytelling, high-quality campaign imagery, and a low-friction
bag/checkout path — backed by a Supabase-managed catalog and an admin-only back office.
French-only at launch, built on i18n foundations so other locales can follow.

## What this product is

A premium brand and catalog website for Karnain fragrances. Visitors discover the
house, browse collections, read each scent’s mood and notes, view large product
imagery, add fragrances to a bag, and proceed toward checkout without friction. Editors
manage perfumes, collections, and content through an authenticated admin — no developer
deploy to change the catalog. The bet: a more luxurious, consistent, mobile-first
experience than the current site converts more browsers into buyers.

## Users

| User                       | Wants                                                          | Success looks like                                                                      |
| -------------------------- | -------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Perfume customer (visitor) | Discover Karnain, find the right scent, feel the luxury        | Lands → understands the house → finds a fragrance → adds it to the bag without friction |
| Returning admirer          | Re-find a known fragrance, add it to the bag, reach the maison | Goes straight to a product, reads its notes, adds it to the bag                         |
| Brand editor (admin)       | Keep catalog, collections, and content current and on-brand    | Adds/edits a perfume or collection and it appears live, no deploy needed                |

## What we will NOT do (anti-goals)

- No multi-seller marketplace — single-brand house only.
- No complex custom perfume personalization in v1.
- No full ERP / inventory-management system unless required later.
- No customer accounts in v1 — authentication is admin-side only (per brief). The bag is a
  guest bag (no login to shop).
- No online payment in v1 — payment, legal, and compliance are still in discussion. v1
  ships the full bag/cart experience; the checkout/payment step (Stripe) is a later,
  spec-gated decision.

## Experience direction

Anchored on the restrained editorial luxury the client cited (Maison Francis Kurkdjian),
evolving away from the current site’s utilitarian look:

- **Ivory canvas, ink text, hairline rules.** Color comes almost entirely from product
  and campaign imagery, not from UI chrome.
- **Refined serif display** for the wordmark, product names, and section headings;
  letter-spaced uppercase sans for nav and micro-labels.
- **Generous whitespace and large imagery.** Storytelling sections interleave with
  product presentation rather than a dense grid.
- **Calm motion.** Slow fades and reveals; always reduced-motion safe (see
  `../conventions/motion.md`).
- **Mobile-first and responsive**, French-inspired, visually consistent end to end.

Design tokens (color, type, spacing) live in `src/app/globals.css` per
[styling conventions](../conventions/styling.md). All copy is French and follows
[copy conventions](../conventions/copy.md).

## Commerce, data & platform (v1 decisions)

- **Commerce model: cart / bag** (standard luxury e-commerce, LV/JPG style). Visitors add
  fragrances to a bag, review it in a drawer and a cart page, and proceed toward checkout.
  WhatsApp is not used — it reads as mass-market for the maison. (Revised 2026-06-07 from an
  earlier inquiry model.)
- **Checkout / payment: deferred (Stripe later).** v1 ships the bag/cart experience; the
  payment step is a later, spec-gated decision pending payment + legal/CGV. Until then the
  cart page presents the order and a clear “coming soon” for online payment.
- **Bag is a guest bag**, persisted locally (no customer login to shop).
- **Data layer: Supabase.** Perfumes and collections read from Supabase when configured,
  else an in-code seed — scaffolded in spec 005 with a graceful fallback (no keys required
  yet). See ADR-0005.
- **Auth: admin-side only.** An authenticated admin manages the catalog at `/admin`
  (Supabase Auth, no public sign-up); visitors are never asked to sign in.
- **i18n: French only, i18n-ready.** Ship `fr` as the sole locale on i18n foundations so
  additional locales are additive later.
- **Hosting: Vercel.**

## Current catalog (seed)

Seven fragrances exist on karnain.fr today, uniform €195, grouped under the “Karnain
Addicte” collection: Tobacco, Cuir 90, Rose des Îles, Tentation, Sucre Addictée, Rose des
Bois, Cherry Je t’aime. Real product photography is wired in for **5 of the 7** (in
`public/images/fragrances/`); **Sucre Addictée and Rose des Bois have no imagery yet** and
keep the tonal placeholder until photos exist. The source asset zip lives in `public/` but
is git-ignored — only the selected/renamed images are committed.

## Current feature map

Living per-feature docs: [features/](features/README.md). Journeys that must never
break: [critical-user-journeys.md](critical-user-journeys.md). The example `task-list`
slice and `/examples/tasks` route are skeleton demos, removed once the first real
features land.

## Glossary

| Term       | Meaning here                                                            |
| ---------- | ----------------------------------------------------------------------- |
| Fragrance  | A single Karnain perfume (product) with notes, mood, imagery, price     |
| Collection | A curated grouping of fragrances (e.g. “Karnain Addicte”)               |
| Bag        | The guest shopping bag (panier); checkout/payment ships in a later spec |
| Admin      | The authenticated back office for managing catalog and content          |
| CUJ        | Critical user journey — an e2e-tested, screenshot-evidenced path        |
| Slice      | A `src/features/<name>` vertical module                                 |
