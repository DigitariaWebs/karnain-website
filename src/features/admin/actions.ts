"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { isSupabaseConfigured } from "@/core/supabase/config";
import { createSupabaseServerClient } from "@/core/supabase/server";

export type ActionResult = { ok: true } | { ok: false; error: string };

const fragranceInput = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Le slug doit être en minuscules, sans espaces (ex. rose-des-bois)."),
  name: z.string().min(1),
  collectionSlug: z.string().min(1),
  family: z.string().min(1),
  priceEur: z.coerce.number().int().nonnegative(),
  mood: z.string().default(""),
  description: z.string().default(""),
  featured: z.boolean().default(false),
  notesHead: z.string().default(""),
  notesHeart: z.string().default(""),
  notesBase: z.string().default(""),
  images: z.string().default(""),
  status: z.enum(["published", "draft"]).default("published"),
  isNew: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
});

/** Returns an authed Supabase client, or null when unconfigured / not signed in. */
async function authedClient() {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;
  return supabase;
}

const toList = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export async function saveFragrance(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await authedClient();
  if (!supabase) return { ok: false, error: "Non autorisé ou Supabase non configuré." };

  const parsed = fragranceInput.safeParse({
    slug: formData.get("slug"),
    name: formData.get("name"),
    collectionSlug: formData.get("collectionSlug") ?? "karnain-addicte",
    family: formData.get("family"),
    priceEur: formData.get("priceEur"),
    mood: formData.get("mood") ?? "",
    description: formData.get("description") ?? "",
    featured: formData.get("featured") === "on",
    notesHead: formData.get("notesHead") ?? "",
    notesHeart: formData.get("notesHeart") ?? "",
    notesBase: formData.get("notesBase") ?? "",
    images: formData.get("images") ?? "",
    status: formData.get("status") ?? "published",
    isNew: formData.get("isNew") === "on",
    isBestSeller: formData.get("isBestSeller") === "on",
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Champs invalides." };
  }

  const input = parsed.data;
  const { error } = await supabase.from("fragrances").upsert({
    slug: input.slug,
    collection_slug: input.collectionSlug,
    family: input.family,
    name: input.name,
    price_eur: input.priceEur,
    mood: input.mood,
    description: input.description,
    notes: {
      head: toList(input.notesHead),
      heart: toList(input.notesHeart),
      base: toList(input.notesBase),
    },
    images: toList(input.images),
    featured: input.featured,
    status: input.status,
    is_new: input.isNew,
    is_best_seller: input.isBestSeller,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/collection");
  revalidatePath(`/parfums/${input.slug}`);
  redirect("/admin");
}

export async function deleteFragrance(slug: string): Promise<ActionResult> {
  const supabase = await authedClient();
  if (!supabase) return { ok: false, error: "Non autorisé." };
  const { error } = await supabase.from("fragrances").delete().eq("slug", slug);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin");
  revalidatePath("/collection");
  return { ok: true };
}

export async function signOutAdmin(): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}
