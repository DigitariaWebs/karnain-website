/** Public API for the catalog slice — the only entry point other layers may import. */
export type { Collection, Fragrance } from "./types";
export {
  getCollection,
  getCollections,
  getFamilies,
  getFeaturedFragrances,
  getFragrance,
  getFragrances,
  getFragrancesByCollection,
} from "./data";
export { FragranceCard } from "./components/fragrance-card";
export { FragranceGrid } from "./components/fragrance-grid";
export { FragranceGallery, type GalleryImage } from "./components/fragrance-gallery";
export { ScentNotes } from "./components/scent-notes";
export { getStudioProductImage } from "./product-imagery";
