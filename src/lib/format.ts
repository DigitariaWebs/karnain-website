/**
 * Shared Intl-based formatters (docs/conventions/copy.md): user-visible dates and
 * numbers always go through these — never hand-rolled string math.
 */

const dateFormatter = new Intl.DateTimeFormat("en", { dateStyle: "medium" });
const numberFormatter = new Intl.NumberFormat("en");
const eurFormatter = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

export function formatDate(date: Date | number): string {
  return dateFormatter.format(date);
}

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

/** Price in euros, French convention (e.g. 195 → "195,00 €"). */
export function formatEur(value: number): string {
  return eurFormatter.format(value);
}
