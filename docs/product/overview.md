# Product Overview

Karnain is a luxury perfume house based in France (current site: karnain.fr). This
project rebuilds the brand’s website as a refined, French-inspired showcase: elegant
collection and product storytelling, high-quality campaign imagery, and a low-friction
path to buy by inquiry — backed by a Supabase-managed catalog and an admin-only back
office. French-only at launch, built on i18n foundations so other locales can follow.

## What this product is

A premium brand and catalog website for Karnain fragrances. Visitors discover the
house, browse collections, read each scent’s mood and notes, view large product
imagery, and start a purchase or contact the brand without friction. Editors manage
perfumes, collections, and content through an authenticated admin — no developer deploy
to change the catalog. The bet: a more luxurious, consistent, mobile-first experience
than the current site converts more browsers into qualified buyers and inquiries.

## Users

| User                       | Wants                                                       | Success looks like                                                                           |
| -------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Perfume customer (visitor) | Discover Karnain, find the right scent, feel the luxury     | Lands → understands the house → finds a fragrance → starts an order/inquiry without friction |
| Returning admirer          | Re-find a known fragrance, share it, reach the brand        | Goes straight to a product, reads notes, contacts via WhatsApp/form                          |
| Brand editor (admin)       | Keep catalog, collections, and content current and on-brand | Adds/edits a perfume or collection and it appears live, no deploy needed                     |

## What we will NOT do (anti-goals)

- No multi-seller marketplace — single-brand house only.
- No complex custom perfume personalization in v1.
- No full ERP / inventory-management system unless required later.
- No customer accounts in v1 — authentication is admin-side only (per brief).
- No online payment / checkout in v1 — payment, legal, and compliance are still in
  discussion; v1 converts through inquiry (see Commerce model). Checkout is a later,
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

- **Commerce model: inquiry / WhatsApp.** Visitors browse and open rich product pages,
  then start an order via WhatsApp or a contact/inquiry form. No cart or online payment
  in v1.
- **Data layer: Supabase.** Perfumes, collections, and editable content are read from
  Supabase. The public site renders server-first from this data.
- **Auth: admin-side only.** An authenticated admin manages the catalog and content;
  visitors are never asked to sign in.
- **i18n: French only, i18n-ready.** Ship `fr` as the sole locale on i18n foundations so
  additional locales are additive later.
- **Hosting: Vercel.**

## Current catalog (seed)

Seven fragrances exist on karnain.fr today, uniform €195, useful as seed data: Tobacco,
Cuir 90, Rose des Îles, Tentation, Sucre Addictée, Rose des Bois, Cherry Je t’aime —
grouped under the “Karnain Addicte” collection. Product imagery will arrive separately
(zip) and is not committed to the repo.

## Current feature map

Living per-feature docs: [features/](features/README.md). Journeys that must never
break: [critical-user-journeys.md](critical-user-journeys.md). The example `task-list`
slice and `/examples/tasks` route are skeleton demos, removed once the first real
features land.

## Glossary

| Term       | Meaning here                                                         |
| ---------- | -------------------------------------------------------------------- |
| Fragrance  | A single Karnain perfume (product) with notes, mood, imagery, price  |
| Collection | A curated grouping of fragrances (e.g. “Karnain Addicte”)            |
| Inquiry    | A visitor-initiated order/contact via WhatsApp or form (no checkout) |
| Admin      | The authenticated back office for managing catalog and content       |
| CUJ        | Critical user journey — an e2e-tested, screenshot-evidenced path     |
| Slice      | A `src/features/<name>` vertical module                              |
