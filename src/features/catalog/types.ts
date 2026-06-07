/** Olfactory pyramid for a fragrance. */
export type ScentNotes = {
  readonly head: readonly string[];
  readonly heart: readonly string[];
  readonly base: readonly string[];
};

/** A single Karnain perfume. Domain content is French at launch; localized later via Supabase. */
export type Fragrance = {
  readonly slug: string;
  readonly name: string;
  readonly collectionSlug: string;
  readonly family: string;
  readonly priceEur: number;
  readonly mood: string;
  readonly description: string;
  readonly notes: ScentNotes;
  readonly featured: boolean;
  /** Public image paths (first is the card/primary image). Empty until imagery exists. */
  readonly images: readonly string[];
};

/** A curated grouping of fragrances. */
export type Collection = {
  readonly slug: string;
  readonly name: string;
  readonly baseline: string;
  readonly description: string;
};
