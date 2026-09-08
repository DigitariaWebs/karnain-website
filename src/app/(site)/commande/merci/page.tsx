import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";
import { getDictionary } from "@/core/i18n";
import { resolveCheckoutOutcome } from "@/core/stripe/session-status";
import { ClearBag } from "@/features/cart";
import { cn } from "@/lib/utils";

// The root layout applies a `%s · Karnain` template, so the brand belongs there, not here —
// spelling it out again rendered “Merci · Karnain · Karnain”.
export const metadata: Metadata = { title: "Merci" };

export default async function OrderThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  const outcome = await resolveCheckoutOutcome(sessionId);
  const t = getDictionary().orderConfirmation[outcome];

  return (
    <Container className="flex flex-col items-center py-24 text-center md:py-32">
      <p className="label-eyebrow text-muted-foreground">{t.eyebrow}</p>
      <h1 className="mt-4 font-serif text-4xl font-light md:text-5xl">{t.title}</h1>
      <p className="text-muted-foreground mt-5 max-w-md">{t.body}</p>
      <Link
        href={t.href}
        className={cn(buttonVariants({ variant: "outline" }), "label-eyebrow mt-8")}
      >
        {t.cta}
      </Link>
      {/* A failed payment keeps the bag, so the buyer can simply try again. */}
      {outcome === "failed" || outcome === "unknown" ? null : <ClearBag />}
    </Container>
  );
}
