import "server-only";
import { z } from "zod";
import { createSupabasePublicClient, createSupabaseServerClient } from "@/core/supabase/server";
import type { Collection, Fragrance } from "./types";

/**
 * Supabase reads for the catalog. Rows cross a trust boundary, so they are zod-parsed
 * (Constitution Art. IX). Any error (network, schema drift, RLS) returns `null` so callers
 * fall back to the seed — the site never hard-fails on a data-source hiccup.
 */

const fragranceRowSchema = z.object({
  slug: z.string(),
  name: z.string(),
  collection_slug: z.string(),
  family: z.string(),
  price_eur: z.number(),
  mood: z.string(),
  description: z.string(),
  notes: z
    .object({
      head: z.array(z.string()),
      heart: z.array(z.string()),
      base: z.array(z.string()),
    })
    .nullable(),
  images: z.array(z.string()).nullable(),
  featured: z.boolean(),
  status: z.enum(["published", "draft"]).default("published"),
  is_new: z.boolean().default(false),
  is_best_seller: z.boolean().default(false),
});

const collectionRowSchema = z.object({
  slug: z.string(),
  name: z.string(),
  baseline: z.string(),
  description: z.string(),
});

function toFragrance(row: z.infer<typeof fragranceRowSchema>): Fragrance {
  return {
    slug: row.slug,
    name: row.name,
    collectionSlug: row.collection_slug,
    family: row.family,
    priceEur: row.price_eur,
    mood: row.mood,
    description: row.description,
    notes: {
      head: row.notes?.head ?? [],
      heart: row.notes?.heart ?? [],
      base: row.notes?.base ?? [],
    },
    images: row.images ?? [],
    featured: row.featured,
    status: row.status,
    isNew: row.is_new,
    isBestSeller: row.is_best_seller,
  };
}

export async function fetchFragrances(): Promise<readonly Fragrance[] | null> {
  try {
    const supabase = createSupabasePublicClient();
    const { data, error } = await supabase.from("fragrances").select("*").order("sort_order");
    if (error || !data) return null;
    const parsed = z.array(fragranceRowSchema).safeParse(data);
    if (!parsed.success) return null;
    return parsed.data.map(toFragrance);
  } catch {
    return null;
  }
}

/**
 * Catalog read **through the caller's session**, so an admin's `role` claim reaches RLS and
 * drafts come back. The public reads above deliberately use the sessionless client to stay
 * statically cached; the admin needs the opposite trade — per-request, and complete.
 */
export async function fetchFragrancesAsAdmin(): Promise<readonly Fragrance[] | null> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.from("fragrances").select("*").order("sort_order");
    if (error || !data) return null;
    const parsed = z.array(fragranceRowSchema).safeParse(data);
    if (!parsed.success) return null;
    return parsed.data.map(toFragrance);
  } catch {
    return null;
  }
}

export async function fetchCollections(): Promise<readonly Collection[] | null> {
  try {
    const supabase = createSupabasePublicClient();
    const { data, error } = await supabase.from("collections").select("*").order("sort_order");
    if (error || !data) return null;
    const parsed = z.array(collectionRowSchema).safeParse(data);
    if (!parsed.success) return null;
    return parsed.data;
  } catch {
    return null;
  }
}
