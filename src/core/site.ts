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
  // TODO(client): replace placeholders with the real contact channels.
  whatsappNumber: "+33600000000",
  contactEmail: "contact@karnain.fr",
  instagramUrl: "https://www.instagram.com/karnain",
} as const;

/** Build a `wa.me` deep link with an optional prefilled message. */
export function whatsappLink(message?: string): string {
  const phone = site.whatsappNumber.replace(/\D/g, "");
  const base = `https://wa.me/${phone}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Build a `mailto:` link with an optional subject. */
export function emailLink(subject?: string): string {
  const base = `mailto:${site.contactEmail}`;
  return subject ? `${base}?subject=${encodeURIComponent(subject)}` : base;
}
