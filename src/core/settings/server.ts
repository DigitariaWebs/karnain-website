import "server-only";
import { getServiceClient, hasServiceRole } from "@/core/supabase/service";

/** Server-managed integration settings. Read/written only via the service-role client — the
 * `app_settings` table denies all Data-API access, so secrets never reach a browser token. */
export type AppSettings = {
  stripeSecretKey: string | null;
  stripeWebhookSecret: string | null;
  stripePublishableKey: string | null;
};

const ROW_ID = "default";

type AppSettingsRow = {
  stripe_secret_key: string | null;
  stripe_webhook_secret: string | null;
  stripe_publishable_key: string | null;
};

export async function getAppSettings(): Promise<AppSettings | null> {
  if (!hasServiceRole()) return null;
  const { data } = await getServiceClient()
    .from("app_settings")
    .select("stripe_secret_key, stripe_webhook_secret, stripe_publishable_key")
    .eq("id", ROW_ID)
    .maybeSingle();
  if (!data) return null;
  const row = data as AppSettingsRow;
  return {
    stripeSecretKey: row.stripe_secret_key,
    stripeWebhookSecret: row.stripe_webhook_secret,
    stripePublishableKey: row.stripe_publishable_key,
  };
}

/** Updates only the provided (truthy) fields; absent/blank fields keep their existing value. */
export async function saveAppSettings(partial: Partial<AppSettings>): Promise<boolean> {
  if (!hasServiceRole()) return false;
  const update: Record<string, string> = {};
  if (partial.stripeSecretKey) update.stripe_secret_key = partial.stripeSecretKey;
  if (partial.stripeWebhookSecret) update.stripe_webhook_secret = partial.stripeWebhookSecret;
  if (partial.stripePublishableKey) update.stripe_publishable_key = partial.stripePublishableKey;
  if (Object.keys(update).length === 0) return true;
  update.updated_at = new Date().toISOString();
  const { error } = await getServiceClient().from("app_settings").update(update).eq("id", ROW_ID);
  return !error;
}
