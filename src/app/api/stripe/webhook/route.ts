import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripeCredentials } from "@/core/stripe/credentials";
import { getStripe } from "@/core/stripe/server";
import { getServiceClient, hasServiceRole } from "@/core/supabase/service";

/**
 * Stripe webhook — confirms an order once payment completes. Verifies the signature against the
 * resolved webhook secret (admin settings or env), then marks the order `paid` and captures the
 * buyer’s details. Stripe retries on non-2xx, so we return 200 quickly for ignored events.
 */
export async function POST(request: Request) {
  const creds = await getStripeCredentials();
  if (!creds.secretKey || !creds.webhookSecret || !hasServiceRole()) {
    return NextResponse.json({ error: "not-configured" }, { status: 400 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "no-signature" }, { status: 400 });
  }

  const payload = await request.text();
  let event: Stripe.Event;
  try {
    event = getStripe(creds.secretKey).webhooks.constructEvent(
      payload,
      signature,
      creds.webhookSecret,
    );
  } catch {
    return NextResponse.json({ error: "bad-signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.order_id;
    if (orderId) {
      await getServiceClient()
        .from("orders")
        .update({
          status: "paid",
          email: session.customer_details?.email ?? "",
          customer_name: session.customer_details?.name ?? "",
        })
        .eq("id", orderId);
    }
  }

  return NextResponse.json({ received: true });
}
