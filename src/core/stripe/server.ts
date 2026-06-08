import "server-only";
import Stripe from "stripe";

const clients = new Map<string, Stripe>();

/**
 * Returns a Stripe client for the given secret key (cached per key). The key is resolved at call
 * time from `getStripeCredentials()` (admin settings or env), so callers pass it in rather than
 * reading env directly.
 */
export function getStripe(secretKey: string): Stripe {
  if (!secretKey) {
    throw new Error("Stripe secret key missing.");
  }
  let client = clients.get(secretKey);
  if (!client) {
    client = new Stripe(secretKey);
    clients.set(secretKey, client);
  }
  return client;
}
