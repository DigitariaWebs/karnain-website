# Spec 001 — Brand foundation & luxury homepage

- **Status:** active
- **Type:** feature
- **Requested by / owner:** Karnain (client, via Marouane) / progix
- **Date:** 2026-06-07
- **Slice / areas touched:** `src/features/catalog`, `src/components/layout`, `src/components/ui/icons`, `src/core/i18n`, `src/core/site`, `src/app` (layout, home), `src/app/globals.css`

## Problem (the why)

Karnain’s current site (karnain.fr) reads as utilitarian, not luxury: a generic shop
chrome around the fragrances rather than a maison that makes a visitor feel the brand’s
value. The client cited Maison Francis Kurkdjian as the reference. Before any product or
catalog page can be built well, the site needs a coherent luxury visual system and a
homepage that establishes the brand and routes visitors toward the fragrances. Everything
downstream (product page, collection page, inquiry flow) reuses this foundation, so it
goes first.

## Desired behavior (the what)

A visitor opens the site and immediately understands this is a French luxury perfume
house. They see a refined hero (wordmark, a line about the maison, a clear way forward),
a presentation of the collection with the signature fragrances, a short brand story, and
an obvious, low-friction way to reach the brand to order or ask. The experience feels
elegant and consistent — generous space, refined serif headings, calm reveals — and works
as well on a phone as on a desktop. All copy is in French. Nothing on the page is broken
or leads to a dead end.

## Acceptance criteria

- **AC-1:** Landing on `/` shows, in order, a brand hero, a presentation of the
  collection with the signature fragrances, a brand-story section, and a contact/inquiry
  call to action — all in French.
- **AC-2:** The hero presents the Karnain wordmark, a one-line brand statement, and a
  primary action that leads the visitor into the collection (no dead link).
- **AC-3:** The collection presentation lists the seed fragrances (Tobacco, Cuir 90, Rose
  des Îles, Tentation, Sucre Addictée, Rose des Bois, Cherry Je t’aime) with name and
  price; imagery uses clearly-intentional placeholders until the asset zip arrives.
- **AC-4:** A persistent header (brand + navigation) and footer (brand, contact, social,
  legal) are present on every page; the header navigation is usable on mobile (a working
  menu) and on desktop.
- **AC-5:** A contact/inquiry action opens a working WhatsApp conversation (from a
  configurable number) — no online checkout, no customer login anywhere.
- **AC-6:** The page is responsive: at 390 px and 1440 px widths the layout is legible,
  unbroken, and screenshot-verified.
- **AC-7 (non-happy path / a11y):** Interactive controls are reachable and operable by
  keyboard with visible focus; icon-only controls have accessible labels; reduced-motion
  users get no large motion.

## Out of scope

- Product detail pages, collection/catalog filtering pages, the full inquiry/contact form
  (own specs).
- Real Supabase wiring and the admin back office (own spec) — v1 reads a seed catalog in
  code behind a Supabase-shaped data layer.
- Real photography/campaign assets (arriving by zip) and any image-management UI.
- Online payment / checkout and customer accounts (explicit product anti-goals for v1).
- Additional locales — French only; i18n is scaffolded but single-locale.

## CUJ impact

- Replaces the skeleton’s CUJ-01 with **CUJ-A — Discover the house**: land on `/` →
  understand Karnain (hero, story, collection) → reach a way forward (collection / contact)
  without friction. Registered in `../../docs/product/critical-user-journeys.md` at ship.

## Open questions

- [ ] Real WhatsApp number + contact email (placeholder used until provided).
- [ ] Per-fragrance copy (notes, mood, descriptions) for the product page — not blocking
      the homepage.
