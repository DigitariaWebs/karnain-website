"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/core/i18n";
import { useCartStore } from "../provider";

/**
 * Bag → checkout. Asks `/api/checkout` whether online checkout is live (no secret reaches the
 * client). When live, posts the bag and redirects to the Stripe Checkout Session; otherwise the
 * button stays disabled with the “paiement bientôt” note.
 */
export function CheckoutButton() {
  const lines = useCartStore((state) => state.lines);
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [pending, setPending] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const t = getDictionary().cart;

  useEffect(() => {
    let active = true;
    fetch("/api/checkout")
      .then((response) => response.json())
      .then((data: { enabled?: boolean }) => {
        if (active) setEnabled(Boolean(data.enabled));
      })
      .catch(() => {
        if (active) setEnabled(false);
      });
    return () => {
      active = false;
    };
  }, []);

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

  if (enabled !== true) {
    return (
      <>
        <Button size="lg" disabled className="label-eyebrow h-12 w-full">
          {t.checkout}
        </Button>
        {enabled === false ? (
          <p className="text-muted-foreground text-center text-xs">{t.checkoutSoon}</p>
        ) : null}
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
