const STUDIO_IMAGE_ROOT = "/images/fragrances";

const studioProductImages: Readonly<Record<string, string>> = {
  tobacco: `${STUDIO_IMAGE_ROOT}/tobacco-studio-v3.png`,
  "cuir-90": `${STUDIO_IMAGE_ROOT}/cuir-90-studio-v3.png`,
  "rose-des-iles": `${STUDIO_IMAGE_ROOT}/rose-des-iles-studio-v3.png`,
  tentation: `${STUDIO_IMAGE_ROOT}/tentation-studio-v3.png`,
  "cherry-je-taime": `${STUDIO_IMAGE_ROOT}/cherry-je-taime-studio-v3.png`,
  "sucre-addictee": `${STUDIO_IMAGE_ROOT}/sucre-addictee-studio-v3.png`,
};

/** Returns the approved photoreal studio photograph when a fragrance has one. */
export function getStudioProductImage(slug: string): string | undefined {
  return studioProductImages[slug];
}
