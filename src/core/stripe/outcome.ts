/**
 * What the buyer should be told on returning from Stripe.
 *
 * `processing` is not a nicety: the account offers delayed methods (Klarna, iDEAL, Bancontact,
 * BLIK) whose Session completes before the funds settle, so “paiement reçu” would be a lie for
 * those buyers — the same distinction the webhook makes before marking an order paid.
 *
 * Kept free of `server-only` so it stays unit-testable; it touches nothing but its arguments.
 */
export type CheckoutOutcome = "confirmed" | "processing" | "failed" | "unknown";

/**
 * Maps a Stripe Session's own fields onto what the buyer is told. This is the part that must
 * never say “paid” when it isn't: `payment_status` is the only field that means money, and a
 * Session can be `complete` while still `unpaid`. Anything unrecognised fails closed.
 */
export function outcomeFromSession(
  paymentStatus: string | null | undefined,
  sessionStatus: string | null | undefined,
): CheckoutOutcome {
  if (paymentStatus === "paid" || paymentStatus === "no_payment_required") return "confirmed";
  // Completed but unpaid means a delayed method is still settling; anything else never got paid.
  return sessionStatus === "complete" ? "processing" : "failed";
}
