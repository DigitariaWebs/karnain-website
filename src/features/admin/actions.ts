"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { saveAppSettings } from "@/core/settings/server";
import { isSupabaseConfigured } from "@/core/supabase/config";
import { createSupabaseServerClient } from "@/core/supabase/server";
import { getAdminClient } from "./auth";

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

/**
 * Returns a Supabase client for a fully authenticated admin, or null.
 *
 * Delegates to `getAdminClient` so writes are held to the same bar as the screens: RLS keys on the
 * `role` claim, which a password-only session already carries, so checking merely for a user here
 * would let a second factor guard the UI while leaving every mutation open.
 */
async function authedClient() {
  return getAdminClient();
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

const orderStatusInput = z.object({
  id: z.string().uuid(),
  status: z.enum(["pending", "paid", "fulfilled", "cancelled"]),
});

export async function updateOrderStatus(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await authedClient();
  if (!supabase) return { ok: false, error: "Non autorisé." };
  const parsed = orderStatusInput.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
  });
  if (!parsed.success) return { ok: false, error: "Statut invalide." };
  const { error } = await supabase
    .from("orders")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/commandes");
  revalidatePath(`/admin/commandes/${parsed.data.id}`);
  return { ok: true };
}

export async function saveSettings(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  // These are the Stripe credentials, so the bar is the full one: signed in, MFA satisfied, and
  // carrying the admin role claim — checked again here because the service-role write below
  // bypasses RLS entirely and this action is the only thing standing in front of it.
  if (!isSupabaseConfigured()) return { ok: false, error: "Supabase non configuré." };
  const supabase = await getAdminClient();
  if (!supabase) return { ok: false, error: "Non autorisé." };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user?.app_metadata?.role !== "admin") return { ok: false, error: "Non autorisé." };

  const value = (entry: FormDataEntryValue | null) =>
    typeof entry === "string" && entry.trim() ? entry.trim() : undefined;

  const ok = await saveAppSettings({
    stripeSecretKey: value(formData.get("stripeSecretKey")),
    stripeWebhookSecret: value(formData.get("stripeWebhookSecret")),
    stripePublishableKey: value(formData.get("stripePublishableKey")),
  });
  if (!ok) {
    return { ok: false, error: "Échec de l’enregistrement (clé service role requise)." };
  }
  revalidatePath("/admin/parametres");
  return { ok: true };
}

/** Deliberately not behind `getAdminClient`: signing out must work from an aal1 session too. */
export async function signOutAdmin(): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}
