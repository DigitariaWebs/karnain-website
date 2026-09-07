/** Bounds on an untrusted bag: enough for any real order, small enough to stay cheap to reject. */
export const MAX_ITEMS = 100;
export const MAX_QUANTITY = 99;

export type IncomingItem = { slug?: unknown; quantity?: unknown };
type Priced = { name: string; priceEur: number };
export type BagLine = { slug: string; name: string; priceEur: number; quantity: number };

/**
 * Turns an untrusted bag into priced order lines.
 *
 * The bag arrives from the browser, so nothing in it is trusted: names and prices come from the
 * catalog the caller passes in, never from the request. Unknown slugs are dropped rather than
 * erroring, so a stale tab holding a since-unpublished fragrance still checks out with the rest
 * of its bag. Quantities are merged per slug and the whole bag is truncated, which bounds the
 * line count by the catalog size — Stripe rejects a Session over 100 line items, and by then the
 * caller has already written a pending order and its items.
 */
export function normaliseBagLines(
  items: readonly IncomingItem[],
  bySlug: ReadonlyMap<string, Priced>,
): BagLine[] {
  const merged = new Map<string, BagLine>();
  for (const item of items.slice(0, MAX_ITEMS)) {
    const slug = String(item?.slug ?? "");
    const fragrance = bySlug.get(slug);
    if (!fragrance) continue;
    const quantity = Math.max(1, Math.min(MAX_QUANTITY, Math.floor(Number(item?.quantity) || 1)));
    const line = merged.get(slug) ?? {
      slug,
      name: fragrance.name,
      priceEur: fragrance.priceEur,
      quantity: 0,
    };
    line.quantity = Math.min(MAX_QUANTITY, line.quantity + quantity);
    merged.set(slug, line);
  }
  return [...merged.values()];
}
