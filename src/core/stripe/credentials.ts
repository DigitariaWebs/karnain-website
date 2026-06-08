import "server-only";
import { getAppSettings } from "@/core/settings/server";
import { isSupabaseConfigured } from "@/core/supabase/config";
import { hasServiceRole } from "@/core/supabase/service";
import { stripeConfig } from "./config";

export type StripeCredentials = {
  secretKey: string | null;
  webhookSecret: string | null;
  publishableKey: string | null;
};

/**
 * Resolves Stripe credentials: **admin-stored settings first, then env**. Reading settings needs
 * the service-role key, so with no service role we fall back to env only.
 */
export async function getStripeCredentials(): Promise<StripeCredentials> {
  const fromEnv: StripeCredentials = {
    secretKey: stripeConfig.secretKey ?? null,
    webhookSecret: stripeConfig.webhookSecret ?? null,
    publishableKey: stripeConfig.publishableKey ?? null,
  };
  const settings = await getAppSettings();
  if (!settings) return fromEnv;
  return {
    secretKey: settings.stripeSecretKey ?? fromEnv.secretKey,
    webhookSecret: settings.stripeWebhookSecret ?? fromEnv.webhookSecret,
    publishableKey: settings.stripePublishableKey ?? fromEnv.publishableKey,
  };
}

/** Checkout can run end-to-end: a Stripe secret + Supabase + the service role (for order writes). */
export async function isCheckoutLive(): Promise<boolean> {
  if (!isSupabaseConfigured() || !hasServiceRole()) return false;
  const creds = await getStripeCredentials();
  return Boolean(creds.secretKey);
}
