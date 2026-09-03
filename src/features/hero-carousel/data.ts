import type { HeroFragranceVisual } from "./types";

const SPRITES = "/images/hero/sprites";

function productCutout(name: string) {
  return `${SPRITES}/${name}_center-photo.webp`;
}

/**
 * Per-fragrance look for the studio hero.
 *
 * The sprites are the client's own product photographs of the physical bottles, shot on seamless
 * black in one session and cut to transparency: same front-facing composition, same fill level,
 * same light, so only the liquid colour and the printed label change between fragrances. Each
 * bottle is scaled to one common height, so the turntable never appears to resize the product.
 * The cutouts sit over a restrained, liquid-matched sweep.
 *
 * The array order is the carousel order: it opens on Tobacco, the house signature. Fragrance
 * names and mood lines are not here on purpose — they belong to the catalog.
 */
export const heroFragranceVisuals: readonly HeroFragranceVisual[] = [
  {
    slug: "tobacco",
    sprite: productCutout("Tobacco"),
    backdropTop: "#e6d5ba",
    backdropMid: "#e5d9c9",
    backdropFloor: "#e4e1de",
    shadowColor: "#8a6a3a",
  },
  {
    slug: "cherry-je-taime",
    sprite: productCutout("CherryJeTaime"),
    backdropTop: "#e7c1c2",
    backdropMid: "#e5cdce",
    backdropFloor: "#e4dfdf",
    shadowColor: "#8c3f44",
  },
  {
    slug: "rose-des-iles",
    sprite: productCutout("RoseDesIles"),
    backdropTop: "#e3d8dc",
    backdropMid: "#e3dbde",
    backdropFloor: "#e4e1e2",
    shadowColor: "#8a6572",
  },
  {
    slug: "cuir-90",
    sprite: productCutout("Cuir90"),
    backdropTop: "#e4c7af",
    backdropMid: "#e2d1c5",
    backdropFloor: "#e3e0dd",
    shadowColor: "#7d4a2a",
  },
  {
    slug: "tentation",
    sprite: productCutout("Tentation"),
    backdropTop: "#e5dcc1",
    backdropMid: "#e5decd",
    backdropFloor: "#e4e2de",
    shadowColor: "#8a7434",
  },
  {
    slug: "sucre-addictee",
    sprite: productCutout("SucreAddict"),
    backdropTop: "#e4d4ad",
    backdropMid: "#e4d9c4",
    backdropFloor: "#e4e1dc",
    shadowColor: "#806a2c",
  },
] as const;
