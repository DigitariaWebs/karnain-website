import Link from "next/link";
import { redirect } from "next/navigation";
import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";
import { AdminNotConfigured, ProductTable, SignOutButton, getAdminUser } from "@/features/admin";
import { getFragrances } from "@/features/catalog";
import { cn } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const session = await getAdminUser();
  if (!session.configured) return <AdminNotConfigured />;
  if (!session.user) redirect("/admin/login");

  const fragrances = await getFragrances();

  return (
    <Container className="py-12">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b pb-6">
        <div>
          <p className="label-eyebrow text-muted-foreground">Administration</p>
          <h1 className="mt-2 font-serif text-3xl font-light">Catalogue</h1>
        </div>
        <div className="flex items-center gap-5">
          <Link href="/admin/nouveau" className={cn(buttonVariants(), "label-eyebrow")}>
            Nouvelle fragrance
          </Link>
          <SignOutButton />
        </div>
      </div>
      <div className="mt-8">
        <ProductTable fragrances={fragrances} />
      </div>
    </Container>
  );
}
