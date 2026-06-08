import "server-only";
import { createServerClient } from "@supabase/ssr";
import { supabaseConfig } from "./config";

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** True when the service-role key + URL are present (trusted server writes are possible). */
export function hasServiceRole(): boolean {
  return Boolean(supabaseConfig.url && serviceRoleKey);
}

/**
 * Service-role Supabase client — **bypasses RLS**. Server-only, sessionless; use exclusively for
 * trusted writes the user must not be able to forge (order creation, webhook confirmation).
 * Never expose the service-role key to the browser. Guard with `hasServiceRole()`.
 */
export function getServiceClient() {
  if (!supabaseConfig.url || !serviceRoleKey) {
    throw new Error("Supabase service role is not configured (SUPABASE_SERVICE_ROLE_KEY missing).");
  }
  return createServerClient(supabaseConfig.url, serviceRoleKey, {
    cookies: { getAll: () => [], setAll: () => {} },
  });
}
