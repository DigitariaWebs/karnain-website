"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSupabaseBrowserClient } from "@/core/supabase/client";

export function AdminLoginForm({ initialStep = "password" }: { initialStep?: "password" | "mfa" }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [step, setStep] = useState<"password" | "mfa">(initialStep);
  const [code, setCode] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const supabase = createSupabaseBrowserClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      // Distinguish "wrong password" from "the backend is unreachable": reporting a dead Supabase
      // project as invalid credentials once cost days of chasing a password that was never wrong.
      setError(
        signInError.message?.toLowerCase().includes("fetch")
          ? "Service d’authentification injoignable. Réessayez dans un instant."
          : "Identifiants invalides.",
      );
      setPending(false);
      return;
    }

    // A verified second factor leaves the session at aal1 until it is answered, and every admin
    // page rejects that — so ask for the code here rather than bouncing the user to a dead end.
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (aal?.nextLevel === "aal2" && aal.currentLevel !== "aal2") {
      setPending(false);
      setStep("mfa");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  async function onVerify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const supabase = createSupabaseBrowserClient();
    const { data: factors, error: listError } = await supabase.auth.mfa.listFactors();
    const factor = factors?.totp?.find((item) => item.status === "verified") ?? factors?.totp?.[0];
    if (listError || !factor) {
      setError("Aucun facteur d’authentification disponible.");
      setPending(false);
      return;
    }
    const { error: verifyError } = await supabase.auth.mfa.challengeAndVerify({
      factorId: factor.id,
      code: code.trim(),
    });
    setPending(false);
    if (verifyError) {
      setError("Code incorrect ou expiré.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  const heading = (
    <div className="text-center">
      <p className="label-eyebrow text-muted-foreground">Administration</p>
      <h1 className="mt-3 font-serif text-3xl font-light">Karnain · Admin</h1>
    </div>
  );

  if (step === "mfa") {
    return (
      <form onSubmit={onVerify} className="mx-auto max-w-sm space-y-5 py-24">
        {heading}
        <p className="text-muted-foreground text-sm">
          Saisissez le code à six chiffres de votre application d’authentification.
        </p>
        <div className="space-y-2">
          <label htmlFor="code" className="label-eyebrow text-muted-foreground">
            Code de vérification
          </label>
          <Input
            id="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={code}
            onChange={(event) => setCode(event.target.value)}
            autoFocus
            required
          />
        </div>
        {error ? <p className="text-destructive text-sm">{error}</p> : null}
        <Button type="submit" disabled={pending} className="label-eyebrow w-full">
          {pending ? "Vérification…" : "Vérifier"}
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-sm space-y-5 py-24">
      {heading}
      <div className="space-y-2">
        <label htmlFor="email" className="label-eyebrow text-muted-foreground">
          Adresse e-mail
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="label-eyebrow text-muted-foreground">
          Mot de passe
        </label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
        />
      </div>
      {error ? <p className="text-destructive text-sm">{error}</p> : null}
      <Button type="submit" disabled={pending} className="label-eyebrow w-full">
        {pending ? "Connexion…" : "Se connecter"}
      </Button>
    </form>
  );
}
