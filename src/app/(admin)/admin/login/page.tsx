import { redirect } from "next/navigation";
import { AdminLoginForm, AdminNotConfigured, getAdminUser } from "@/features/admin";

export default async function AdminLoginPage() {
  const session = await getAdminUser();
  if (!session.configured) return <AdminNotConfigured />;
  if (session.user) redirect("/admin");
  return <AdminLoginForm />;
}
