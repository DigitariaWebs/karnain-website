import { NextResponse } from "next/server";
import { getStripeCredentials, isCheckoutLive } from "@/core/stripe/credentials";
import { checkoutReturnOrigin } from "@/core/stripe/return-url";
import { getStripe } from "@/core/stripe/server";
import { isSupabaseConfigured } from "@/core/supabase/config";
import { getServiceClient, hasServiceRole } from "@/core/supabase/service";
import { type IncomingItem, normaliseBagLines } from "@/features/cart";
import { getFragrances } from "@/features/catalog";

/** Tells the bag whether online checkout is live, without exposing any secret. */
export async function GET() {
  return NextResponse.json({ enabled: await isCheckoutLive() });
}

/**
 * Creates a pending order and a Stripe Checkout Session. Prices are re-read from the catalog —
 * client-sent prices are never trusted. Stripe credentials resolve from admin settings then env.
 * Returns `{ error: "not-configured" }` (200) when checkout isn’t live so the bag degrades to
 * the “bientôt” state without crashing.
 */
export async function POST(request: Request) {
  const creds = await getStripeCredentials();
  if (!creds.secretKey || !isSupabaseConfigured() || !hasServiceRole()) {
    return NextResponse.json({ error: "not-configured" });
  }

  let body: { items?: IncomingItem[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid-body" }, { status: 400 });
  }

  // One catalog read, then look up locally. Resolving each item separately would let a caller
  // turn a single request into as many Supabase round-trips as it sent items.
  const catalog = await getFragrances();
  const bySlug = new Map(catalog.map((fragrance) => [fragrance.slug, fragrance]));

  const lines = normaliseBagLines(Array.isArray(body.items) ? body.items : [], bySlug);
  if (lines.length === 0) {
    return NextResponse.json({ error: "empty-cart" }, { status: 400 });
  }

  const totalEur = lines.reduce((sum, line) => sum + line.priceEur * line.quantity, 0);
  const supabase = getServiceClient();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({ status: "pending", total_eur: totalEur })
    .select("id")
    .single();
  if (orderError || !order) {
    return NextResponse.json({ error: "order-failed" }, { status: 500 });
  }

  const { error: itemsError } = await supabase.from("order_items").insert(
    lines.map((line) => ({
      order_id: order.id,
      slug: line.slug,
      name: line.name,
      price_eur: line.priceEur,
      quantity: line.quantity,
    })),
  );
  if (itemsError) {
    return NextResponse.json({ error: "order-failed" }, { status: 500 });
  }

  const origin = checkoutReturnOrigin(request.url);
  const session = await getStripe(creds.secretKey).checkout.sessions.create({
    mode: "payment",
    // Everyone pays in euros. Stripe's Adaptive Pricing otherwise converts the total into the
    // buyer's local currency (an Algerian visitor was shown "DZD 31,322.04" for a 195 € bottle),
    // which puts the maison's pricing at the mercy of a daily FX rate and costs conversion
    // spread. Disabled per Session rather than on the account, because the same account still
    // serves the live WooCommerce shop and must keep its own settings.
    adaptive_pricing: { enabled: false },
    line_items: lines.map((line) => ({
      quantity: line.quantity,
      price_data: {
        currency: "eur",
        unit_amount: line.priceEur * 100,
        product_data: { name: line.name },
      },
    })),
    success_url: `${origin}/commande/merci?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/panier`,
    metadata: { order_id: order.id },
  });

  await supabase.from("orders").update({ stripe_session_id: session.id }).eq("id", order.id);

  return NextResponse.json({ url: session.url });
}
