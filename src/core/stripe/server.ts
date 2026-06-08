import "server-only";
import Stripe from "stripe";
import { stripeConfig } from "./config";

let client: Stripe | null = null;

/**
 * Lazily constructs the Stripe client. Throws if called without a secret key — callers must
 * guard with `isStripeConfigured()` first so the app stays importable with no keys.
 */
export function getStripe(): Stripe {
  if (!stripeConfig.secretKey) {
    throw new Error("Stripe is not configured (STRIPE_SECRET_KEY missing).");
  }
  client ??= new Stripe(stripeConfig.secretKey);
  return client;
}
