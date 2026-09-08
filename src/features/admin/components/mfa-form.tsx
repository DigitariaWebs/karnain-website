"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSupabaseBrowserClient } from "@/core/supabase/client";

type Factor = { id: string; friendlyName?: string; status: string };
type Enrolling = { factorId: string; qr: string; secret: string };

const fieldLabel = "label-eyebrow text-muted-foreground";

/**
 * Enrol and remove a TOTP second factor (authenticator app).
 *
 * Supabase Auth offers TOTP and phone only — there is no WebAuthn/passkey factor to use here.
 * TOTP is the better of the two anyway: it works offline, costs nothing per sign-in, and cannot be
 * intercepted by a SIM swap the way an SMS code can.
 *
 * A factor is only enforced once **verified**, so an abandoned enrolment leaves the account usable
 * rather than locking the owner out — but it also leaves a stale unverified factor behind, which
 * is why those are cleaned up before starting a new enrolment.
 */
export function MfaForm() {
  const [factors, setFactors] = useState<Factor[] | null>(null);
  const [enrolling, setEnrolling] = useState<Enrolling | null>(null);
  const [code, setCode] = useState("");
  const [state, setState] = useState<{ ok?: string; error?: string }>({});
  const [pending, setPending] = useState(false);

  const load = useCallback(async () => {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.auth.mfa.listFactors();
    return error ? [] : ((data?.all ?? []) as Factor[]);
  }, []);

  const refresh = useCallback(async () => {
    setFactors(await load());
  }, [load]);

  useEffect(() => {
    let active = true;
    load().then((next) => {
      if (active) setFactors(next);
    });
    return () => {
      active = false;
    };
  }, [load]);

  const verified = (factors ?? []).filter((factor) => factor.status === "verified");

  async function startEnrolment() {
    setState({});
    setPending(true);
    const supabase = createSupabaseBrowserClient();

    // Clear any half-finished attempt first: Supabase rejects a second enrolment while an
    // unverified factor is outstanding, which would otherwise wedge this screen permanently.
    for (const factor of (factors ?? []).filter((f) => f.status !== "verified")) {
      await supabase.auth.mfa.unenroll({ factorId: factor.id });
    }

    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: "totp",
      friendlyName: `Karnain admin ${new Date().toISOString().slice(0, 10)}`,
    });
    setPending(false);
    if (error || !data) {
      setState({ error: "Impossible de démarrer l’activation. Réessayez." });
      return;
    }
    setEnrolling({ factorId: data.id, qr: data.totp.qr_code, secret: data.totp.secret });
  }

  async function confirmEnrolment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!enrolling) return;
    setState({});
    setPending(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.mfa.challengeAndVerify({
      factorId: enrolling.factorId,
      code: code.trim(),
    });
    setPending(false);
    if (error) {
      setState({ error: "Code incorrect ou expiré. Vérifiez l’heure de votre téléphone." });
      return;
    }
    setEnrolling(null);
    setCode("");
    setState({ ok: "Double authentification activée." });
    await refresh();
  }

  async function remove(factorId: string) {
    setState({});
    setPending(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.mfa.unenroll({ factorId });
    setPending(false);
    if (error) {
      setState({ error: "Impossible de désactiver ce facteur." });
      return;
    }
    setState({ ok: "Double authentification désactivée." });
    await refresh();
  }

  if (factors === null) {
    return <p className="text-muted-foreground text-sm">Chargement…</p>;
  }

  return (
    <div className="space-y-5">
      {verified.length > 0 ? (
        <div className="space-y-3">
          <p className="text-sm">
            Double authentification <span className="font-medium">active</span>. Un code de votre
            application sera demandé à chaque connexion.
          </p>
          {verified.map((factor) => (
            <div key={factor.id} className="flex items-center justify-between gap-4 border-t pt-3">
              <span className="text-muted-foreground text-sm">
                {factor.friendlyName ?? "Application d’authentification"}
              </span>
              <Button
                type="button"
                variant="outline"
                disabled={pending}
                className="label-eyebrow"
                onClick={() => remove(factor.id)}
              >
                Désactiver
              </Button>
            </div>
          ))}
        </div>
      ) : enrolling ? (
        <form onSubmit={confirmEnrolment} className="space-y-4">
          <p className="text-muted-foreground text-sm">
            Scannez ce code avec Google Authenticator, 1Password ou Authy, puis saisissez le code à
            six chiffres.
          </p>
          {/* Supabase returns the QR as an SVG data URI. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={enrolling.qr}
            alt="Code QR d’activation"
            width={200}
            height={200}
            className="rounded border bg-white p-2"
          />
          <p className="text-muted-foreground text-xs break-all">
            Saisie manuelle : <code>{enrolling.secret}</code>
          </p>
          <div className="space-y-2">
            <label htmlFor="totpCode" className={fieldLabel}>
              Code à six chiffres
            </label>
            <Input
              id="totpCode"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={(event) => setCode(event.target.value)}
              required
            />
          </div>
          {state.error ? <p className="text-destructive text-sm">{state.error}</p> : null}
          <div className="flex gap-3">
            <Button type="submit" disabled={pending} className="label-eyebrow">
              {pending ? "Vérification…" : "Activer"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="label-eyebrow"
              onClick={() => {
                setEnrolling(null);
                setCode("");
              }}
            >
              Annuler
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-3">
          <p className="text-muted-foreground text-sm">
            Ajoutez un code temporaire depuis une application d’authentification. Le mot de passe
            seul ne suffira plus pour accéder à l’administration.
          </p>
          <Button
            type="button"
            disabled={pending}
            className="label-eyebrow"
            onClick={startEnrolment}
          >
            {pending ? "Préparation…" : "Activer la double authentification"}
          </Button>
        </div>
      )}

      {state.ok ? <p className="text-sm text-green-700">{state.ok}</p> : null}
      {state.error && !enrolling ? <p className="text-destructive text-sm">{state.error}</p> : null}
    </div>
  );
}
