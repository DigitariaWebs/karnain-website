"use client";

import Link from "next/link";
import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";
import { getDictionary } from "@/core/i18n";
import { useHydrated } from "@/hooks/use-hydrated";
import { formatEur } from "@/lib/format";
import { cn } from "@/lib/utils";
import { cartSubtotal } from "../lib";
import { useCartStore } from "../provider";
import { CartLineRow } from "./cart-line-row";
import { CheckoutButton } from "./checkout-button";

export function CartView() {
  const lines = useCartStore((state) => state.lines);
  const hydrated = useHydrated();
  const t = getDictionary().cart;

  return (
    <Container className="py-16 md:py-24">
      <h1 className="font-serif text-4xl font-light md:text-5xl">{t.title}</h1>

      {!hydrated ? (
        <div className="mt-10 min-h-40" />
      ) : lines.length === 0 ? (
        <div className="mt-10 flex flex-col items-start gap-4">
          <p className="text-muted-foreground">{t.empty}</p>
          <Link
            href="/collection"
            className={cn(buttonVariants({ variant: "outline" }), "label-eyebrow")}
          >
            {t.emptyCta}
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <ul className="divide-y border-t border-b">
            {lines.map((line) => (
              <CartLineRow key={line.slug} line={line} />
            ))}
          </ul>
          <aside className="h-fit space-y-5 lg:sticky lg:top-28">
            <div className="flex items-center justify-between border-b pb-4">
              <span className="label-eyebrow text-muted-foreground">{t.subtotal}</span>
              <span className="text-xl">{formatEur(cartSubtotal(lines))}</span>
            </div>
            <CheckoutButton />
            <Link
              href="/collection"
              className="text-muted-foreground hover:text-foreground block text-center text-sm underline-offset-4 hover:underline"
            >
              {t.continue}
            </Link>
          </aside>
        </div>
      )}
    </Container>
  );
}
