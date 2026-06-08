# Critical User Journeys (CUJs)

The journeys that must never break. Each CUJ has: an owner, an e2e spec in `e2e/`, and labeled screenshots captured by `pnpm e2e:shots`. CI runs all of them on every PR; `/verify-ui` re-runs the ones a change touches.

Adding or changing a CUJ is a product decision — PR must be approved by the product owner.

## Registry

| ID    | Journey                                      | Steps (user's words)                                                                                                                                                                                 | E2E spec                                               | Screenshots                    |
| ----- | -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ------------------------------ |
| CUJ-A | Discover the house                           | Open `/` → understand Karnain (hero, signatures, collection, story) → reach the collection or contact without friction                                                                               | `e2e/home.spec.ts`                                     | `home-*`                       |
| CUJ-B | Explore a fragrance, fill the bag, check out | Open a fragrance → read notes, enlarge the gallery → add to bag → see the bag drawer + subtotal → open the cart page → **Commander** → Stripe Checkout (when configured) → order confirmed (“Merci”) | `e2e/product.spec.ts` (to bag/cart); checkout manual † | `product-*`, `bag-*`, `cart-*` |
| CUJ-C | Browse the collection                        | Open `/collection` → narrow by scent family (URL-reflected) → open a fragrance                                                                                                                       | `e2e/collection.spec.ts`                               | `collection-*`                 |

## Rules

- A new feature with user-visible surface MUST either extend an existing CUJ or register a new one in this table (the `/create-spec` template asks).
- Each step in a journey asserts something the _user_ can see (text, role, state) — not implementation details.
- Screenshot names are stable (`<cuj>-<step>`), so reports and reviews can diff them release over release.
- When a CUJ changes intentionally, update the spec, this table, and the screenshots in the same PR — `/update-docs` walks you through it.
- † The checkout step is gated on Stripe keys, so it is **not** in CI e2e. It is verified manually with a Stripe test-mode purchase (card `4242…` → order marked `paid` via the `checkout.session.completed` webhook). See spec 011 and `docs/product/features/admin.md`.
