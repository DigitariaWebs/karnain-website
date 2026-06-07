import "server-only";
import { z } from "zod";

/**
 * Server-side environment access — the ONLY place process.env is read.
 * `server-only` makes importing this from a client component a build error,
 * which is exactly the failure mode we want (secrets can't drift client-side).
 * Client-exposed values must be NEXT_PUBLIC_* and added to the separate schema below.
 */
const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  // Server-only Supabase key, reserved for future privileged jobs (optional — the public
  // site and admin use the publishable key + RLS). Public Supabase config lives in
  // src/core/supabase/config.ts (NEXT_PUBLIC_*).
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
});

export const env = serverEnvSchema.parse(process.env);
