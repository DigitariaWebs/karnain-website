"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSupabaseBrowserClient } from "@/core/supabase/client";

const fieldLabel = "label-eyebrow text-muted-foreground";
const MIN_LENGTH = 12;

/**
 * Change the signed-in admin's password.
 *
 * The current password is re-checked before the change even though Supabase does not demand it:
 * without that, anyone who reaches an unlocked laptop with a live session can lock the real owner
 * out of their own shop in two clicks.
 */
export function PasswordForm({ email }: { email: string }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [state, setState] = useState<{ ok?: string; error?: string }>({});
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({});

    if (next.length < MIN_LENGTH) {
      setState({ error: `Le nouveau mot de passe doit faire au moins ${MIN_LENGTH} caractères.` });
      return;
    }
    if (next !== confirm) {
      setState({ error: "Les deux nouveaux mots de passe ne correspondent pas." });
      return;
    }
    if (next === current) {
      setState({ error: "Le nouveau mot de passe doit être différent de l’actuel." });
      return;
    }

    setPending(true);
    const supabase = createSupabaseBrowserClient();
    const { error: reauthError } = await supabase.auth.signInWithPassword({
      email,
      password: current,
    });
    if (reauthError) {
      setState({ error: "Mot de passe actuel incorrect." });
      setPending(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: next });
    setPending(false);
    if (error) {
      setState({ error: "Le changement a échoué. Réessayez." });
      return;
    }
    setCurrent("");
    setNext("");
    setConfirm("");
    setState({ ok: "Mot de passe mis à jour." });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="currentPassword" className={fieldLabel}>
          Mot de passe actuel
        </label>
        <Input
          id="currentPassword"
          type="password"
          autoComplete="current-password"
          value={current}
          onChange={(event) => setCurrent(event.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="newPassword" className={fieldLabel}>
          Nouveau mot de passe
        </label>
        <Input
          id="newPassword"
          type="password"
          autoComplete="new-password"
          value={next}
          onChange={(event) => setNext(event.target.value)}
          required
        />
        <p className="text-muted-foreground text-xs">Au moins {MIN_LENGTH} caractères.</p>
      </div>
      <div className="space-y-2">
        <label htmlFor="confirmPassword" className={fieldLabel}>
          Confirmer le nouveau mot de passe
        </label>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          required
        />
      </div>

      {state.ok ? <p className="text-sm text-green-700">{state.ok}</p> : null}
      {state.error ? <p className="text-destructive text-sm">{state.error}</p> : null}

      <Button type="submit" disabled={pending} className="label-eyebrow">
        {pending ? "Enregistrement…" : "Changer le mot de passe"}
      </Button>
    </form>
  );
}
