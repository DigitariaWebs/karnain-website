"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type ActionResult, saveSettings } from "../actions";
import type { SettingsStatus } from "../settings";

const fieldLabel = "label-eyebrow text-muted-foreground";

export function SettingsForm({ status }: { status: SettingsStatus }) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    saveSettings,
    null,
  );

  const hint = (configured: boolean, suffix?: string | null) =>
    configured
      ? `Configurée${suffix ? ` (${suffix})` : ""} — laisser vide pour conserver`
      : "Non configurée";

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="stripeSecretKey" className={fieldLabel}>
          Clé secrète Stripe
        </label>
        <Input
          id="stripeSecretKey"
          name="stripeSecretKey"
          type="password"
          autoComplete="off"
          placeholder={hint(status.hasSecret)}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="stripeWebhookSecret" className={fieldLabel}>
          Secret du webhook Stripe
        </label>
        <Input
          id="stripeWebhookSecret"
          name="stripeWebhookSecret"
          type="password"
          autoComplete="off"
          placeholder={hint(status.hasWebhook)}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="stripePublishableKey" className={fieldLabel}>
          Clé publique Stripe
        </label>
        <Input
          id="stripePublishableKey"
          name="stripePublishableKey"
          type="text"
          autoComplete="off"
          placeholder={hint(status.hasPublishable, status.publishableHint)}
        />
      </div>

      {state?.ok ? <p className="text-sm text-green-700">Enregistré.</p> : null}
      {state && !state.ok ? <p className="text-destructive text-sm">{state.error}</p> : null}

      <Button type="submit" disabled={pending} className="label-eyebrow">
        {pending ? "Enregistrement…" : "Enregistrer"}
      </Button>
    </form>
  );
}
