import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripeCredentials } from "@/core/stripe/credentials";
import { getStripe } from "@/core/stripe/server";
import { getServiceClient, hasServiceRole } from "@/core/supabase/service";

/**
 * Stripe webhook — moves an order's status as its Session resolves. Verifies the signature
 * against the resolved webhook secret (admin settings or env) before trusting anything in the
 * payload. Stripe retries on non-2xx, so we return 200 quickly for events we ignore.
 *
 * An order is marked `paid` only on a *settled* payment, never merely on a completed Session —
 * see the note on the `completed` branch.
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

  const session = event.data.object as Stripe.Checkout.Session;
  const orderId = session.metadata?.order_id;
  if (!orderId) return NextResponse.json({ received: true });

  const supabase = getServiceClient();
  const buyer = {
    email: session.customer_details?.email ?? "",
    customer_name: session.customer_details?.name ?? "",
  };

  switch (event.type) {
    // `completed` does NOT mean paid. The account offers Klarna, iDEAL, Bancontact and BLIK, and
    // for a delayed method the Session completes with `payment_status: "unpaid"` while the funds
    // are still in flight — settlement arrives later as `async_payment_succeeded`/`_failed`.
    // Trusting `completed` alone would mark such an order paid and ship a bottle for free, so the
    // status only moves once Stripe says the money actually landed. The buyer's details are worth
    // recording either way: on an unpaid session they are how the order is identified while it
    // waits.
    case "checkout.session.completed":
      await supabase
        .from("orders")
        .update({ ...buyer, ...(session.payment_status === "paid" ? { status: "paid" } : {}) })
        .eq("id", orderId);
      break;

    case "checkout.session.async_payment_succeeded":
      await supabase
        .from("orders")
        .update({ status: "paid", ...buyer })
        .eq("id", orderId);
      break;

    // An abandoned or failed Session would otherwise leave its order `pending` forever, indis-
    // tinguishable in the back office from one still being paid. Scoped to `pending` so a late
    // duplicate can never walk a paid order backwards.
    case "checkout.session.expired":
    case "checkout.session.async_payment_failed":
      await supabase
        .from("orders")
        .update({ status: "cancelled" })
        .eq("id", orderId)
        .eq("status", "pending");
      break;
  }

  return NextResponse.json({ received: true });
}
