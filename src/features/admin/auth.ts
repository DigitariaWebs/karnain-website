import "server-only";
import { isSupabaseConfigured } from "@/core/supabase/config";
import { createSupabaseServerClient } from "@/core/supabase/server";

type AdminSession =
  | { configured: false; user: null }
  | { configured: true; user: { id: string; email: string | null } | null };

/** Resolve the admin session. `configured: false` means no Supabase keys yet. */
export async function getAdminUser(): Promise<AdminSession> {
  if (!isSupabaseConfigured()) return { configured: false, user: null };
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user ? { id: data.user.id, email: data.user.email ?? null } : null;
  return { configured: true, user };
}
