import { isSupabaseConfigured } from "@/core/supabase/config";
import type { Collection, Fragrance } from "./types";

/**
 * Catalog data access — the seam between the site and its data source.
 *
 * Reads from Supabase when configured, else the in-code seed below (the fragrances live on
 * karnain.fr today). The Supabase repository is a `server-only` module imported dynamically
 * only when configured — so this file stays client/test-safe and the site works with zero
 * configuration. Selectors keep stable signatures; nothing downstream changes.
 */

const PRICE_EUR = 195;

const seedCollections: readonly Collection[] = [
  {
    slug: "karnain-addicte",
    name: "Karnain Addicte",
    baseline: "La collection signature",
    description:
      "Des parfums d’exception — les classiques que les amoureux du parfum se doivent de posséder.",
  },
];

const seedFragrances: readonly Fragrance[] = [
  {
    slug: "tobacco",
    family: "Boisés & ambrés",
    name: "Tobacco",
    images: ["/images/fragrances/tobacco-1.png"],
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
    family: "Boisés & ambrés",
    name: "Cuir 90",
    images: ["/images/fragrances/cuir-90-1.png", "/images/fragrances/cuir-90-2.png"],
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
    family: "Floraux",
    name: "Rose des Îles",
    images: ["/images/fragrances/rose-des-iles-1.png", "/images/fragrances/rose-des-iles-2.png"],
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
    family: "Gourmands",
    name: "Tentation",
    images: ["/images/fragrances/tentation-1.png", "/images/fragrances/tentation-2.png"],
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
    family: "Gourmands",
    name: "Sucre Addictée",
    images: [],
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
    family: "Floraux",
    name: "Rose des Bois",
    images: [],
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
    family: "Gourmands",
    name: "Cherry Je t’aime",
    images: ["/images/fragrances/cherry-je-taime-1.png"],
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

async function allFragrances(): Promise<readonly Fragrance[]> {
  if (isSupabaseConfigured()) {
    const { fetchFragrances } = await import("./supabase-repo");
    const rows = await fetchFragrances();
    if (rows) return rows;
  }
  return seedFragrances;
}

async function allCollections(): Promise<readonly Collection[]> {
  if (isSupabaseConfigured()) {
    const { fetchCollections } = await import("./supabase-repo");
    const rows = await fetchCollections();
    if (rows) return rows;
  }
  return seedCollections;
}

export async function getFragrances(): Promise<readonly Fragrance[]> {
  return allFragrances();
}

export async function getFeaturedFragrances(limit = 4): Promise<readonly Fragrance[]> {
  return (await allFragrances()).filter((fragrance) => fragrance.featured).slice(0, limit);
}

export async function getFragrance(slug: string): Promise<Fragrance | undefined> {
  return (await allFragrances()).find((fragrance) => fragrance.slug === slug);
}

export async function getCollections(): Promise<readonly Collection[]> {
  return allCollections();
}

export async function getCollection(slug: string): Promise<Collection | undefined> {
  return (await allCollections()).find((collection) => collection.slug === slug);
}

export async function getFragrancesByCollection(slug: string): Promise<readonly Fragrance[]> {
  return (await allFragrances()).filter((fragrance) => fragrance.collectionSlug === slug);
}

/** Distinct scent families, in display order. */
export async function getFamilies(): Promise<readonly string[]> {
  return [...new Set((await allFragrances()).map((fragrance) => fragrance.family))];
}
