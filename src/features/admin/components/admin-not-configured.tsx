/** Shown across the admin when Supabase has no keys yet. */
export function AdminNotConfigured() {
  return (
    <div className="mx-auto max-w-md py-24 text-center">
      <p className="label-eyebrow text-muted-foreground">Administration</p>
      <h1 className="mt-3 font-serif text-3xl font-light">Karnain · Admin</h1>
      <p className="text-muted-foreground mt-4 text-sm">
        Supabase n’est pas encore configuré. Ajoutez les clés du projet pour activer la gestion du
        catalogue.
      </p>
      <pre className="bg-secondary text-muted-foreground mt-6 rounded-md p-4 text-left text-xs">
        NEXT_PUBLIC_SUPABASE_URL{"\n"}NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
      </pre>
    </div>
  );
}
