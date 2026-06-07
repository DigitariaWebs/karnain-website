import { createBrowserClient } from "@supabase/ssr";
import { supabaseConfig } from "./config";

/** Browser Supabase client for client components (e.g. admin login). */
export function createSupabaseBrowserClient() {
  const { url, publishableKey } = supabaseConfig;
  if (!url || !publishableKey) {
    throw new Error("Supabase is not configured.");
  }
  return createBrowserClient(url, publishableKey);
}
