import "server-only";

/**
 * Trusted origin for Stripe's `success_url` / `cancel_url`.
 *
 * These must NOT come from the request: `new URL(request.url).origin` reflects the `Host` header,
 * so a forged Host would send the buyer to an attacker's page carrying a real `session_id` after
 * a real payment. Prefer an explicitly configured site URL, then the platform-provided production
 * domain (set by Vercel, not by the caller), and only fall back to the request origin locally,
 * where there is no platform value to trust.
 */
export function checkoutReturnOrigin(requestUrl: string): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/+$/, "");

  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelHost) return `https://${vercelHost}`;

  return new URL(requestUrl).origin;
}
