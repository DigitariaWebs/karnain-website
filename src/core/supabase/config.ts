/**
 * Public Supabase configuration. Reads `NEXT_PUBLIC_*` (inlined into the browser bundle by
 * Next) — the publishable key is meant to be public, so no secrets live here. Safe to import
 * from client, server, and tests. When unset, the app falls back to the in-code seed catalog.
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseConfig = { url, publishableKey } as const;

/** True only when both the Supabase URL and a public key are present. */
export function isSupabaseConfigured(): boolean {
  return Boolean(url && publishableKey);
}
