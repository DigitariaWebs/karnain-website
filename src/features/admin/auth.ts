import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/core/supabase/config";
import { createSupabaseServerClient } from "@/core/supabase/server";

type AdminUser = { id: string; email: string | null };

type AdminSession =
  | { configured: false; user: null; mfaRequired: false }
  | { configured: true; user: null; mfaRequired: false }
  /**
   * `mfaRequired` means the account has a verified second factor that this session has not
   * satisfied — a password-only session on an MFA-protected account. Treated exactly like being
   * signed out, or enrolling a factor would be decorative.
   */
  | { configured: true; user: AdminUser; mfaRequired: boolean };

/**
 * True when the account has a verified factor this session hasn't answered.
 *
 * `nextLevel` is `aal2` only once a factor is verified; `currentLevel` reaches `aal2` only after
 * this session passes a challenge. Errors resolve to `true` — a failure here must close the door,
 * not open it.
 */
async function mfaIncomplete(supabase: SupabaseClient): Promise<boolean> {
  try {
    const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (error) return true;
    return data?.nextLevel === "aal2" && data.currentLevel !== "aal2";
  } catch {
    return true;
  }
}

/** Resolve the admin session. `configured: false` means no Supabase keys yet. */
export async function getAdminUser(): Promise<AdminSession> {
  if (!isSupabaseConfigured()) return { configured: false, user: null, mfaRequired: false };
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return { configured: true, user: null, mfaRequired: false };
  return {
    configured: true,
    user: { id: data.user.id, email: data.user.email ?? null },
    mfaRequired: await mfaIncomplete(supabase),
  };
}

/**
 * A Supabase client for a **fully** authenticated admin, or `null`.
 *
 * Server actions must go through this rather than checking for a user themselves: RLS is keyed on
 * the `role` claim, which a password-only session already carries, so without the MFA check here a
 * second factor would guard the screens while leaving every write wide open.
 */
export async function getAdminClient(): Promise<SupabaseClient | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;
  if (await mfaIncomplete(supabase)) return null;
  return supabase;
}
