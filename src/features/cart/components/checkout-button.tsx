"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/core/i18n";
import { useCartStore } from "../provider";

/**
 * Bag → checkout. When Stripe is configured (a publishable key is present in the client bundle),
 * posts the bag to `/api/checkout` and redirects to the Stripe Checkout Session. Otherwise the
 * button is disabled and the “paiement bientôt” note shows — no keys, no crash.
 */
export function CheckoutButton() {
  const lines = useCartStore((state) => state.lines);
  const [pending, setPending] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const t = getDictionary().cart;

  const checkoutEnabled = Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

  async function onCheckout() {
    setPending(true);
    setUnavailable(false);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map((line) => ({ slug: line.slug, quantity: line.quantity })),
        }),
      });
      const data: { url?: string } = await response.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setUnavailable(true);
    } catch {
      setUnavailable(true);
    } finally {
      setPending(false);
    }
  }

  if (!checkoutEnabled) {
    return (
      <>
        <Button size="lg" disabled className="label-eyebrow h-12 w-full">
          {t.checkout}
        </Button>
        <p className="text-muted-foreground text-center text-xs">{t.checkoutSoon}</p>
      </>
    );
  }

  return (
    <>
      <Button
        size="lg"
        onClick={onCheckout}
        disabled={pending || lines.length === 0}
        className="label-eyebrow h-12 w-full"
      >
        {pending ? t.checkoutPending : t.checkout}
      </Button>
      {unavailable ? (
        <p className="text-muted-foreground text-center text-xs">{t.checkoutSoon}</p>
      ) : null}
    </>
  );
}
