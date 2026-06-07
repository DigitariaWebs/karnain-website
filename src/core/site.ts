/**
 * Brand + site configuration. No secrets here — those go through `core/env.ts`.
 * Values marked TODO(client) are placeholders until Karnain provides the real channels.
 */
export const site = {
  name: "Karnain",
  baseline: "Maison de parfum",
  description:
    "Karnain, maison de parfum française. Des fragrances d’exception aux essences les plus nobles, composées à la française.",
  url: "https://www.karnain.fr",
  // TODO(client): replace placeholders with the real channels.
  contactEmail: "contact@karnain.fr",
  phoneNumber: "+33 1 00 00 00 00",
  instagramUrl: "https://www.instagram.com/karnain",
} as const;

/** Build a `mailto:` link with an optional subject. */
export function emailLink(subject?: string): string {
  const base = `mailto:${site.contactEmail}`;
  return subject ? `${base}?subject=${encodeURIComponent(subject)}` : base;
}

/** Build a `tel:` link from the configured phone number. */
export function telLink(): string {
  return `tel:${site.phoneNumber.replace(/\s+/g, "")}`;
}
