import type { HeroFragranceVisual } from "./types";

const SPRITES = "/images/hero/sprites";

function sprite(name: string) {
  return `${SPRITES}/${name}_center.webp`;
}

/**
 * Per-fragrance look, transcribed from the Blender master scene.
 *
 * The bottles are the actual Cycles renders — path-traced glass, liquid absorption, HDRI
 * lighting — cut out on transparent backgrounds. The backdrop stops were sampled pixel-for-pixel
 * from the same renders, so the composite reads as one photograph rather than a bottle pasted
 * on a gradient.
 *
 * The array order is the carousel order: it opens on Tobacco, the house signature. Fragrance
 * names and mood lines are not here on purpose — they belong to the catalog.
 */
export const heroFragranceVisuals: readonly HeroFragranceVisual[] = [
  {
    slug: "tobacco",
    sprite: sprite("Tobacco"),
    backdropTop: "#e6d5ba",
    backdropMid: "#e5d9c9",
    backdropFloor: "#e4e1de",
    shadowColor: "#8a6a3a",
  },
  {
    slug: "cherry-je-taime",
    sprite: sprite("CherryJeTaime"),
    backdropTop: "#e7c1c2",
    backdropMid: "#e5cdce",
    backdropFloor: "#e4dfdf",
    shadowColor: "#8c3f44",
  },
  {
    slug: "rose-des-iles",
    sprite: sprite("RoseDesIles"),
    backdropTop: "#e3d8dc",
    backdropMid: "#e3dbde",
    backdropFloor: "#e4e1e2",
    shadowColor: "#8a6572",
  },
  {
    slug: "cuir-90",
    sprite: sprite("Cuir90"),
    backdropTop: "#e4c7af",
    backdropMid: "#e2d1c5",
    backdropFloor: "#e3e0dd",
    shadowColor: "#7d4a2a",
  },
  {
    slug: "tentation",
    sprite: sprite("Tentation"),
    backdropTop: "#e5dcc1",
    backdropMid: "#e5decd",
    backdropFloor: "#e4e2de",
    shadowColor: "#8a7434",
  },
] as const;
