/**
 * Locale registry. French only at launch; the structure is here so adding a locale is
 * additive (add the code below and a sibling dictionary in `messages/`).
 */
export const locales = ["fr"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "fr";
