import type { Collection, Fragrance } from "./types";

/**
 * Catalog data access — the seam between the site and its data source.
 *
 * v1 reads an in-code seed (the fragrances live on karnain.fr today). The selectors are
 * async on purpose: when the Supabase catalog lands (its own spec), the queries replace
 * the bodies below with the SAME signatures, and nothing downstream changes.
 * Kept free of `server-only` so the selectors stay unit-testable.
 */

const PRICE_EUR = 195;

const collections: readonly Collection[] = [
  {
    slug: "karnain-addicte",
    name: "Karnain Addicte",
    baseline: "La collection signature",
    description:
      "Des parfums d’exception — les classiques que les amoureux du parfum se doivent de posséder.",
  },
];

const fragrances: readonly Fragrance[] = [
  {
    slug: "tobacco",
    name: "Tobacco",
    collectionSlug: "karnain-addicte",
    priceEur: PRICE_EUR,
    mood: "Chaud, boisé, enveloppant.",
    description:
      "Un tabac blond adouci d’épices et de vanille, pour un sillage chaleureux qui s’attarde.",
    notes: {
      head: ["Bergamote"],
      heart: ["Tabac blond", "Épices douces"],
      base: ["Vanille", "Bois précieux"],
    },
    featured: true,
  },
  {
    slug: "cuir-90",
    name: "Cuir 90",
    collectionSlug: "karnain-addicte",
    priceEur: PRICE_EUR,
    mood: "Cuir noble, fumé, racé.",
    description: "Un cuir précieux relevé de safran et d’iris, signé d’une base d’oud et d’ambre.",
    notes: {
      head: ["Safran"],
      heart: ["Cuir", "Iris"],
      base: ["Oud", "Ambre"],
    },
    featured: true,
  },
  {
    slug: "rose-des-iles",
    name: "Rose des Îles",
    collectionSlug: "karnain-addicte",
    priceEur: PRICE_EUR,
    mood: "Rose solaire, voyageuse.",
    description: "Une rose de Mai lumineuse, portée par le jasmin et adoucie d’un musc poudré.",
    notes: {
      head: ["Poivre rose"],
      heart: ["Rose de Mai", "Jasmin"],
      base: ["Musc", "Bois de santal"],
    },
    featured: true,
  },
  {
    slug: "tentation",
    name: "Tentation",
    collectionSlug: "karnain-addicte",
    priceEur: PRICE_EUR,
    mood: "Gourmand, sensuel, irrésistible.",
    description:
      "Fleur d’oranger et praline sur un fond de vanille et de fève tonka — une gourmandise.",
    notes: {
      head: ["Mandarine"],
      heart: ["Fleur d’oranger", "Praline"],
      base: ["Vanille", "Fève tonka"],
    },
    featured: true,
  },
  {
    slug: "sucre-addictee",
    name: "Sucre Addictée",
    collectionSlug: "karnain-addicte",
    priceEur: PRICE_EUR,
    mood: "Sucré, addictif, lumineux.",
    description: "Un cœur de caramel et de fleurs blanches, addictif comme une note d’enfance.",
    notes: {
      head: ["Fruits rouges"],
      heart: ["Caramel", "Fleurs blanches"],
      base: ["Vanille", "Musc"],
    },
    featured: false,
  },
  {
    slug: "rose-des-bois",
    name: "Rose des Bois",
    collectionSlug: "karnain-addicte",
    priceEur: PRICE_EUR,
    mood: "Rose boisée, profonde.",
    description: "Une rose ample posée sur le cèdre et le patchouli, élégante et tenace.",
    notes: {
      head: ["Bergamote"],
      heart: ["Rose", "Pivoine"],
      base: ["Cèdre", "Patchouli"],
    },
    featured: false,
  },
  {
    slug: "cherry-je-taime",
    name: "Cherry Je t’aime",
    collectionSlug: "karnain-addicte",
    priceEur: PRICE_EUR,
    mood: "Cerise pétillante, audacieuse.",
    description: "La cerise gourmande rencontre l’amande et la rose, sur un fond tonka et vanille.",
    notes: {
      head: ["Cerise"],
      heart: ["Amande", "Rose"],
      base: ["Fève tonka", "Vanille"],
    },
    featured: false,
  },
];

export async function getFragrances(): Promise<readonly Fragrance[]> {
  return fragrances;
}

export async function getFeaturedFragrances(limit = 4): Promise<readonly Fragrance[]> {
  return fragrances.filter((fragrance) => fragrance.featured).slice(0, limit);
}

export async function getFragrance(slug: string): Promise<Fragrance | undefined> {
  return fragrances.find((fragrance) => fragrance.slug === slug);
}

export async function getCollections(): Promise<readonly Collection[]> {
  return collections;
}

export async function getCollection(slug: string): Promise<Collection | undefined> {
  return collections.find((collection) => collection.slug === slug);
}

export async function getFragrancesByCollection(slug: string): Promise<readonly Fragrance[]> {
  return fragrances.filter((fragrance) => fragrance.collectionSlug === slug);
}
