import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";
import { ClearBag } from "@/features/cart";
import { cn } from "@/lib/utils";

// The root layout applies a `%s · Karnain` template, so the brand belongs there, not here —
// spelling it out again rendered “Merci · Karnain · Karnain”.
export const metadata: Metadata = { title: "Merci" };

export default function OrderThankYouPage() {
  return (
    <Container className="flex flex-col items-center py-24 text-center md:py-32">
      <p className="label-eyebrow text-muted-foreground">Commande confirmée</p>
      <h1 className="mt-4 font-serif text-4xl font-light md:text-5xl">Merci pour votre commande</h1>
      <p className="text-muted-foreground mt-5 max-w-md">
        Votre paiement a bien été reçu. Un e-mail de confirmation vous parviendra sous peu.
      </p>
      <Link
        href="/collection"
        className={cn(buttonVariants({ variant: "outline" }), "label-eyebrow mt-8")}
      >
        Continuer mes achats
      </Link>
      <ClearBag />
    </Container>
  );
}
