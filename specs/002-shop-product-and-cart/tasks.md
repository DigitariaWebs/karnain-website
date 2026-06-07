# Tasks 002 — Shop: fragrance product page & bag

Each task maps to acceptance criteria in `spec.md`.

## Cart slice (`features/cart`)

- [ ] `types.ts` + `store.ts` (factory + devtools + persist, partialize lines) — AC-3, AC-4
- [ ] `provider.tsx` (context + `useCartStore`) — AC-3
- [ ] `lib.ts` (`cartCount`, `cartSubtotal`) + `store.test.ts` + `lib.test.ts` — AC-3
- [ ] components: `add-to-bag-button`, `bag-button` (hydration-guarded), `cart-drawer`, `cart-line-row`, `cart-view` — AC-3, AC-4, AC-5
- [ ] `index.ts` public API; wire `CartStoreProvider` in `app/layout.tsx` — AC-3, AC-6

## Catalog product UI

- [ ] `fragrance-gallery.tsx` (client lightbox, keyboard, placeholders) — AC-2
- [ ] `scent-notes.tsx` (server pyramid) — AC-1
- [ ] `FragranceCard` links to product page (done) — AC-6
- [ ] export gallery + scent-notes from `catalog/index.ts`

## Routes

- [ ] `app/parfums/[slug]/page.tsx` + `generateStaticParams`/`generateMetadata` — AC-1
- [ ] `app/parfums/[slug]/{loading,error,not-found}.tsx` (French) — AC-7
- [ ] `app/panier/page.tsx` → `CartView` — AC-5

## Copy / config (WhatsApp removed)

- [ ] `messages/fr.ts`: `cart` + `product` blocks; remove WhatsApp; email + phone concierge — AC-6
- [ ] `core/site.ts`: drop WhatsApp helper, add `phoneNumber` + `telLink` — AC-6
- [ ] Retrofit homepage hero/contact + header (bag) + footer; fix home e2e — AC-6

## Verify

- [ ] `e2e/product.spec.ts` CUJ-B (product, notes, gallery, add to bag → drawer → /panier, not-found) — AC-1…AC-7
- [ ] Register CUJ-B; update living feature doc(s)
- [ ] `pnpm verify` green + `pnpm e2e:shots` inspected
