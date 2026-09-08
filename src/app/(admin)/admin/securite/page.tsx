import Link from "next/link";
import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";
import {
  AdminNotConfigured,
  MfaForm,
  PasswordForm,
  SignOutButton,
  guardAdminPage,
} from "@/features/admin";
import { cn } from "@/lib/utils";

export default async function AdminSecurityPage() {
  const guard = await guardAdminPage();
  if (!guard.configured) return <AdminNotConfigured />;

  return (
    <Container className="py-12">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b pb-6">
        <div>
          <p className="label-eyebrow text-muted-foreground">Administration</p>
          <h1 className="mt-2 font-serif text-3xl font-light">Sécurité</h1>
        </div>
        <div className="flex items-center gap-5">
          <Link
            href="/admin"
            className={cn(buttonVariants({ variant: "outline" }), "label-eyebrow")}
          >
            Catalogue
          </Link>
          <SignOutButton />
        </div>
      </div>

      <div className="mt-8 max-w-xl space-y-12">
        <section>
          <h2 className="font-serif text-xl font-light">Mot de passe</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Compte connecté : {guard.user.email ?? "—"}
          </p>
          <div className="mt-6">
            <PasswordForm email={guard.user.email ?? ""} />
          </div>
        </section>

        <section className="border-t pt-10">
          <h2 className="font-serif text-xl font-light">Double authentification</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Une fois activée, un code temporaire sera demandé après le mot de passe. Gardez un accès
            de secours à votre application d’authentification : sans elle, seule une
            réinitialisation depuis Supabase permet de revenir.
          </p>
          <div className="mt-6">
            <MfaForm />
          </div>
        </section>
      </div>
    </Container>
  );
}
