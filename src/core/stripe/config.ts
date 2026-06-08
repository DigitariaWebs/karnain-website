/**
 * Stripe configuration. The secret + webhook secret are server-only; the publishable key is
 * public. When the secret is unset, checkout is disabled and the bag shows a “bientôt” state —
 * the app builds and runs with no Stripe keys (same graceful pattern as the Supabase catalog).
 */
export const stripeConfig = {
  secretKey: process.env.STRIPE_SECRET_KEY,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
} as const;

/** True when a Stripe secret key is present (checkout can create Sessions). */
export function isStripeConfigured(): boolean {
  return Boolean(stripeConfig.secretKey);
}
