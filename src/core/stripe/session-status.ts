import "server-only";
import { getServiceClient, hasServiceRole } from "@/core/supabase/service";
import { getStripeCredentials } from "./credentials";
import { type CheckoutOutcome, outcomeFromSession } from "./outcome";
import { getStripe } from "./server";

/**
 * Resolves a `session_id` taken from the return URL.
 *
 * The id is user input — anyone can type one — so it is only honoured when it matches an order
 * this site created; otherwise the page would congratulate a stranger on a payment that isn't
 * theirs. Stripe is then asked for the authoritative payment status rather than reading our own
 * `orders.status`, because the redirect races the webhook: a card payment routinely lands the
 * buyer here a moment before the `completed` event arrives, and the order still reads `pending`.
 * If Stripe can't be reached we fall back to that stored status, which is stale at worst.
 */
export async function resolveCheckoutOutcome(
  sessionId: string | undefined,
): Promise<CheckoutOutcome> {
  if (!sessionId || !hasServiceRole()) return "unknown";

  const { data: order } = await getServiceClient()
    .from("orders")
    .select("status")
    .eq("stripe_session_id", sessionId)
    .maybeSingle();
  if (!order) return "unknown";

  const stored = (order as { status: string }).status;
  const fromStored: CheckoutOutcome =
    stored === "paid" || stored === "fulfilled"
      ? "confirmed"
      : stored === "cancelled"
        ? "failed"
        : "processing";

  const creds = await getStripeCredentials();
  if (!creds.secretKey) return fromStored;

  try {
    const session = await getStripe(creds.secretKey).checkout.sessions.retrieve(sessionId);
    return outcomeFromSession(session.payment_status, session.status);
  } catch {
    return fromStored;
  }
}
