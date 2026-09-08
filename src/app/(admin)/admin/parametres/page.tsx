import Link from "next/link";
import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";
import {
  AdminNotConfigured,
  SettingsForm,
  SignOutButton,
  guardAdminPage,
  getSettingsStatus,
} from "@/features/admin";
import { cn } from "@/lib/utils";

export default async function AdminSettingsPage() {
  const guard = await guardAdminPage();
  if (!guard.configured) return <AdminNotConfigured />;

  const status = await getSettingsStatus();

  return (
    <Container className="py-12">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b pb-6">
        <div>
          <p className="label-eyebrow text-muted-foreground">Administration</p>
          <h1 className="mt-2 font-serif text-3xl font-light">Paramètres</h1>
        </div>
        <div className="flex items-center gap-5">
          <Link
            href="/admin"
            className={cn(buttonVariants({ variant: "outline" }), "label-eyebrow")}
          >
            Catalogue
          </Link>
          <Link
            href="/admin/securite"
            className={cn(buttonVariants({ variant: "outline" }), "label-eyebrow")}
          >
            Sécurité
          </Link>
          <SignOutButton />
        </div>
      </div>

      <div className="mt-8 max-w-xl">
        <h2 className="font-serif text-xl font-light">Stripe — paiements</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Renseignez vos clés Stripe pour activer le paiement en ligne. Les champs laissés vides
          conservent les valeurs existantes ; les clés secrètes ne sont jamais réaffichées.
        </p>
        <div className="mt-6">
          <SettingsForm status={status} />
        </div>
      </div>
    </Container>
  );
}
