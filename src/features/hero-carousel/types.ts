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
   * The bottle, path-traced in Blender on a transparent background, at three yaws. `center` is
   * square to camera; `left`/`right` are turned ~24° so a bottle standing on a shoulder of the
   * stage reads as turned away, and one in flight can rotate through the three as it travels.
   */
  readonly sprites: {
    readonly left: string;
    readonly center: string;
    readonly right: string;
  };
  /** Backdrop sweep, sampled from the same Cycles renders so the CSS matches the offline look. */
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
  /** Which pre-rendered yaw to show, and how far to blend toward it: -1 left … 0 centre … 1 right. */
  readonly yaw: number;
  /** Depth-of-field stand-in: blur radius in px, 0 at centre stage. */
  readonly blur: number;
  readonly opacity: number;
  /** Stacking: the nearest bottle paints last. */
  readonly zIndex: number;
};
