import { redirect } from "next/navigation";
import { AdminLoginForm, AdminNotConfigured, getAdminUser } from "@/features/admin";

export default async function AdminLoginPage() {
  const session = await getAdminUser();
  if (!session.configured) return <AdminNotConfigured />;

  // Only a *fully* authenticated session belongs on the dashboard. Redirecting on `user` alone
  // ping-ponged an MFA-pending session: /admin bounced it here for being aal1, and this page
  // bounced it back for having a user — ERR_TOO_MANY_REDIRECTS instead of a code prompt.
  if (session.user && !session.mfaRequired) redirect("/admin");

  // A session that has already passed the password step resumes at the challenge rather than
  // asking for credentials it has just accepted.
  return <AdminLoginForm initialStep={session.user ? "mfa" : "password"} />;
}
