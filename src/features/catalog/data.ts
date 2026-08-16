import { isSupabaseConfigured } from "@/core/supabase/config";
import type { Collection, Fragrance } from "./types";

/**
 * Catalog data access — the seam between the site and its data source.
 *
 * Reads from Supabase when configured, else the in-code seed below (a faithful mirror of the
 * Supabase rows). The Supabase repository is a `server-only` module imported dynamically only
 * when configured — so this file stays client/test-safe and the site works with zero
 * configuration. Draft visibility is enforced by Supabase RLS (anon sees published only); the
 * seed contains no drafts. Selectors keep stable signatures; nothing downstream changes.
 */

const PRICE_EUR = 195;

const seedCollections: readonly Collection[] = [
  {
    slug: "karnain-addicte",
    name: "Karnain Addicte",
    baseline: "La collection signature",
    description:
      "Des parfums d'exception — les classiques que les amoureux du parfum se doivent de posséder.",
  },
];

const seedFragrances: readonly Fragrance[] = [
  {
    slug: "tobacco",
    family: "Boisés & ambrés",
    name: "Tobacco",
    images: ["/images/fragrances/tobacco.png"],
    collectionSlug: "karnain-addicte",
    priceEur: PRICE_EUR,
    mood: "Chaud, boisé, enveloppant.",
    description:
      "Tobacco est un mélange délicieusement complexe de notes chaudes et fraîches. La base de tabac crée une sensation de sophistication et de mystère, tandis que la framboise ajoute une touche de fraîcheur et d'élégance.\n\nAu cœur, le cuir robuste et fumé se marie avec la profondeur aromatique du tabac, créant une ambiance chaleureuse et enveloppante. Les fleurs délicates de violette, de muguet et de rose apportent un contraste doux et floral.\n\nLe fond repose sur une base sensuelle où l'ambre et le musc s'entrelacent. La vanille douce, associée aux nuances terreuses du patchouli et de la fève tonka, ajoute une dimension addictive et chaleureuse.",
    notes: {
      head: ["Framboise", "Safran", "Bergamote"],
      heart: ["Cuir", "Tabac", "Violette", "Muguet", "Rose"],
      base: ["Ambre", "Musc", "Vanille", "Patchouli", "Fève Tonka"],
    },
    featured: true,
    status: "published",
    isNew: false,
    isBestSeller: true,
  },
  {
    slug: "cuir-90",
    family: "Boisés & ambrés",
    name: "Cuir 90",
    images: ["/images/fragrances/cuir-90.png"],
    collectionSlug: "karnain-addicte",
    priceEur: PRICE_EUR,
    mood: "Cuir noble, fumé, racé.",
    description:
      "« Cuir 90 » est un parfum de niche audacieux, un hommage à la fusion entre le raffinement et la puissance brute. Dès l'ouverture, une framboise juteuse éclate avec une vivacité fruitée, avant de laisser place à un cœur dominé par une note de cuir intense et fumé, renforcée par la fève tonka et l'encens.\n\nEn fond, le parfum se pose sur un accord sensuel de musc enveloppant, enrichi de vanille crémeuse. L'ambre ajoute une touche de chaleur dorée, tandis que le bois de cèdre structure l'ensemble avec une élégance boisée et intemporelle.",
    notes: {
      head: ["Framboise"],
      heart: ["Cuir", "Fève Tonka", "Encens"],
      base: ["Musc", "Vanille", "Ambre", "Bois de cèdre"],
    },
    featured: true,
    status: "published",
    isNew: false,
    isBestSeller: true,
  },
  {
    slug: "rose-des-iles",
    family: "Floraux",
    name: "Rose des Îles",
    images: ["/images/fragrances/rose-des-iles.png"],
    collectionSlug: "karnain-addicte",
    priceEur: PRICE_EUR,
    mood: "Rose solaire, voyageuse.",
    description:
      "« Rose des Îles » est un mélange équilibré de notes florales de rose et de bergamote, combiné à des notes plus profondes de musc et de vanille — parfait pour toutes les occasions.\n\nLa rose apporte une touche de fraîcheur et de sensualité, tandis que la bergamote ajoute une note citronnée qui réveille les sens. Le musc et la vanille apportent une profondeur et une chaleur à la fragrance.",
    notes: {
      head: ["Bergamote"],
      heart: ["Rose", "Muguet"],
      base: ["Vanille", "Musc", "Ambre"],
    },
    featured: true,
    status: "published",
    isNew: false,
    isBestSeller: true,
  },
  {
    slug: "tentation",
    family: "Gourmands",
    name: "Tentation",
    images: ["/images/fragrances/tentation.png"],
    collectionSlug: "karnain-addicte",
    priceEur: PRICE_EUR,
    mood: "Gourmand, sensuel, irrésistible.",
    description:
      "« Tentation » est une véritable gourmandise olfactive, un parfum qui séduit par son audace sucrée et sa profondeur sensuelle. Dès les premières notes, une fraise éclatante se mêle à la richesse sombre du cacao.\n\nAu cœur, le parfum s'intensifie avec des accords de chocolat fondant et de barbe à papa, un mélange sucré et nostalgique. En fond, une base crémeuse de vanille douce, renforcée par un musc sensuel et une touche ambrée.",
    notes: {
      head: ["Fraise", "Cacao"],
      heart: ["Chocolat", "Barbe à papa", "Sucré"],
      base: ["Vanille", "Musc", "Ambre"],
    },
    featured: true,
    status: "published",
    isNew: false,
    isBestSeller: true,
  },
  {
    slug: "sucre-addictee",
    family: "Gourmands",
    name: "Sucre Addictée",
    images: [],
    collectionSlug: "karnain-addicte",
    priceEur: PRICE_EUR,
    mood: "Sucré, addictif, lumineux.",
    description:
      "« Sucre Addictée » est une explosion de gourmandise pure. Dès les premières notes, une barbe à papa aérienne se mêle à la pomme d'amour croquante, rappelant les douceurs de l'enfance.\n\nAu cœur, la gourmandise devient plus intense avec un accord de sucre noir et de caramel fondant, relevé d'une touche d'anis. Le fond est dominé par la vanille crémeuse et une base ambrée chaude et réconfortante.",
    notes: {
      head: ["Barbe à papa", "Pomme d'amour"],
      heart: ["Sucre noir", "Caramel", "Anis"],
      base: ["Vanille", "Ambre"],
    },
    featured: false,
    status: "published",
    isNew: true,
    isBestSeller: false,
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
    status: "published",
    isNew: true,
    isBestSeller: false,
  },
  {
    slug: "cherry-je-taime",
    family: "Gourmands",
    name: "Cherry Je t'aime",
    images: ["/images/fragrances/cherry-je-taime.png"],
    collectionSlug: "karnain-addicte",
    priceEur: PRICE_EUR,
    mood: "Cerise pétillante, audacieuse.",
    description:
      "« Cherry, Je t'aime » est une fragrance vibrante où les fruits rouges rencontrent des épices et des bois précieux. L'ouverture est éclatante avec un mélange juteux de cassis et de framboise, dynamisé par la bergamote et le safran.\n\nAu cœur, la cerise pulpeuse s'entrelace avec la fève tonka et l'amande, créant un accord gourmand et addictif, rehaussé de rose et de jasmin. En fond, l'ambre chaud, le musc et les bois de gaïac, vétiver et santal forment une base luxueuse, adoucie par la vanille.",
    notes: {
      head: ["Cassis", "Framboise", "Safran", "Bergamote"],
      heart: ["Fève Tonka", "Cerise", "Amande", "Patchouli", "Rose", "Jasmin"],
      base: ["Ambre", "Musc", "Vétiver", "Bois de gaïac", "Santal", "Vanille"],
    },
    featured: false,
    status: "published",
    isNew: true,
    isBestSeller: false,
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
