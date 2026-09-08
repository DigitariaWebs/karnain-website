import Link from "next/link";
import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";
import { AdminNotConfigured, ProductTable, SignOutButton, guardAdminPage } from "@/features/admin";
import { getFragrancesForAdmin } from "@/features/catalog";
import { cn } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const guard = await guardAdminPage();
  if (!guard.configured) return <AdminNotConfigured />;

  const fragrances = await getFragrancesForAdmin();

  return (
    <Container className="py-12">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b pb-6">
        <div>
          <p className="label-eyebrow text-muted-foreground">Administration</p>
          <h1 className="mt-2 font-serif text-3xl font-light">Catalogue</h1>
        </div>
        <div className="flex items-center gap-5">
          <Link
            href="/admin/commandes"
            className={cn(buttonVariants({ variant: "outline" }), "label-eyebrow")}
          >
            Commandes
          </Link>
          <Link
            href="/admin/securite"
            className={cn(buttonVariants({ variant: "outline" }), "label-eyebrow")}
          >
            Sécurité
          </Link>
          <Link
            href="/admin/parametres"
            className={cn(buttonVariants({ variant: "outline" }), "label-eyebrow")}
          >
            Paramètres
          </Link>
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
