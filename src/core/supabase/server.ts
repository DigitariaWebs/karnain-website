import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseConfig } from "./config";

/**
 * Request-scoped Supabase server client (App Router). Call only when
 * `isSupabaseConfigured()` is true. In RSC, cookie writes are not allowed, so `setAll` is
 * wrapped in try/catch — session refresh happens in route handlers/server actions.
 */
export async function createSupabaseServerClient() {
  const { url, publishableKey } = supabaseConfig;
  if (!url || !publishableKey) {
    throw new Error("Supabase is not configured.");
  }
  const cookieStore = await cookies();
  return createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from an RSC render where cookies are read-only — safe to ignore.
        }
      },
    },
  });
}
