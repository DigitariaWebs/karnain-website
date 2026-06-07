import { defaultLocale, type Locale } from "./locales";
import { fr } from "./messages/fr";

const dictionaries = { fr } as const;

export type Dictionary = typeof fr;

/** Resolve the message dictionary for a locale (French only at launch). */
export function getDictionary(locale: Locale = defaultLocale): Dictionary {
  return dictionaries[locale];
}

export { defaultLocale, locales } from "./locales";
export type { Locale } from "./locales";
