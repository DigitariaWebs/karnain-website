/**
 * Visual configuration for one bottle in the hero carousel.
 *
 * Deliberately holds no fragrance *copy*: names and mood lines belong to the catalog, and are
 * handed in by `app` (see `HeroCarouselItem`). This slice owns only how a bottle looks.
 */
export type HeroFragranceVisual = {
  /** Catalog slug — the join key between this slice and the catalog's data. */
  readonly slug: string;
  /**
   * A transparent, front-facing studio cutout of the bottle. One pose only: the carousel moves
   * bottles across the stage without ever turning them, so every fragrance is always presented
   * face-on — the same way it is photographed for the shelf.
   */
  readonly sprite: string;
  /** Backdrop sweep tuned to the liquid colour so the cutout feels grounded in the scene. */
  readonly backdropTop: string;
  readonly backdropMid: string;
  readonly backdropFloor: string;
  /** Tint for the soft floor shadow, so a red bottle throws a warm shadow and a rose a cool one. */
  readonly shadowColor: string;
};

/** One entry in the carousel: catalog copy joined to this slice's visual config by slug. */
export type HeroCarouselItem = {
  readonly slug: string;
  readonly name: string;
  readonly mood: string;
  /** Where the “discover” call to action leads. */
  readonly href: string;
};

/** Chrome copy, passed in so the slice stays free of the i18n dictionary. */
export type HeroCarouselLabels = {
  readonly eyebrow: string;
  readonly previous: string;
  readonly next: string;
  readonly discover: string;
  readonly carousel: string;
};

/** Where a bottle sits relative to the active one: 0 is centre stage, ±1 the shoulders. */
export type CarouselSlot = number;

/** The resting transform for a given slot, in stage-relative units. */
export type SlotTransform = {
  /** Horizontal offset as a fraction of the stage width (0 = centre, ±0.5 = the edges). */
  readonly x: number;
  /** Apparent depth: 1 at centre stage, shrinking toward the shoulders. */
  readonly scale: number;
  readonly opacity: number;
  /** Stacking: the nearest bottle paints last. */
  readonly zIndex: number;
};
