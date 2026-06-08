import { NextResponse } from "next/server";
import { isStripeConfigured } from "@/core/stripe/config";
import { getStripe } from "@/core/stripe/server";
import { isSupabaseConfigured } from "@/core/supabase/config";
import { getServiceClient, hasServiceRole } from "@/core/supabase/service";
import { getFragrance } from "@/features/catalog";

type IncomingItem = { slug?: unknown; quantity?: unknown };

/**
 * Creates a pending order and a Stripe Checkout Session. Prices are re-read from the catalog —
 * the client-sent prices are never trusted. Returns `{ url }` to redirect to Stripe, or
 * `{ error: "not-configured" }` (200) when Stripe/service-role aren't set so the bag can show
 * the “bientôt” state without crashing.
 */
export async function POST(request: Request) {
  if (!isStripeConfigured() || !isSupabaseConfigured() || !hasServiceRole()) {
    return NextResponse.json({ error: "not-configured" });
  }

  let body: { items?: IncomingItem[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid-body" }, { status: 400 });
  }

  const incoming = Array.isArray(body.items) ? body.items : [];
  const lines: { slug: string; name: string; priceEur: number; quantity: number }[] = [];
  for (const item of incoming) {
    const quantity = Math.max(1, Math.min(99, Math.floor(Number(item?.quantity) || 1)));
    const fragrance = await getFragrance(String(item?.slug ?? ""));
    if (fragrance) {
      lines.push({
        slug: fragrance.slug,
        name: fragrance.name,
        priceEur: fragrance.priceEur,
        quantity,
      });
    }
  }
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

  const origin = new URL(request.url).origin;
  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
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
