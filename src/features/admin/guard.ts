import "server-only";
import { redirect } from "next/navigation";
import { getAdminUser } from "./auth";

/**
 * Single gate for every admin page. Centralised so a new screen cannot forget the MFA check —
 * each page previously repeated its own two-line check, and adding a third condition to six
 * copies is how one gets missed.
 *
 * Returns only when the caller is a fully authenticated admin; otherwise it redirects, or reports
 * that Supabase isn't configured so the page can render the placeholder.
 */
export async function guardAdminPage(): Promise<
  { configured: false } | { configured: true; user: { id: string; email: string | null } }
> {
  const session = await getAdminUser();
  if (!session.configured) return { configured: false };
  if (!session.user || session.mfaRequired) redirect("/admin/login");
  return { configured: true, user: session.user };
}
