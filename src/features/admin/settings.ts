import "server-only";
import { getAppSettings } from "@/core/settings/server";

/** Masked view of the integration settings for the admin UI — never the raw secret values. */
export type SettingsStatus = {
  hasSecret: boolean;
  hasWebhook: boolean;
  hasPublishable: boolean;
  publishableHint: string | null;
};

export async function getSettingsStatus(): Promise<SettingsStatus> {
  const settings = await getAppSettings();
  const publishable = settings?.stripePublishableKey ?? null;
  return {
    hasSecret: Boolean(settings?.stripeSecretKey),
    hasWebhook: Boolean(settings?.stripeWebhookSecret),
    hasPublishable: Boolean(publishable),
    publishableHint: publishable ? `…${publishable.slice(-4)}` : null,
  };
}
