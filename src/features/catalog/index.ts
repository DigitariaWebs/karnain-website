/** Public API for the catalog slice — the only entry point other layers may import. */
export type { Collection, Fragrance, ScentNotes } from "./types";
export {
  getCollection,
  getCollections,
  getFeaturedFragrances,
  getFragrance,
  getFragrances,
  getFragrancesByCollection,
} from "./data";
export { FragranceCard } from "./components/fragrance-card";
export { FragranceGrid } from "./components/fragrance-grid";
