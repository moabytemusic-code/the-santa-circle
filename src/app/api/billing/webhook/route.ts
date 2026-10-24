import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import type Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const headerList = await headers();
  const signature = headerList.get("stripe-signature");

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      // In development / testing without webhook secret configured
      console.warn("[Stripe Webhook] No STRIPE_WEBHOOK_SECRET set. Parsing event body directly.");
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Webhook signature verification failed";
    console.error("[Stripe Webhook Verification Error]:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const exchangeId = session.metadata?.exchangeId || session.client_reference_id;

      if (exchangeId) {
        await prisma.giftExchange.update({
          where: { id: exchangeId },
          data: {
            isPremium: true,
            stripeSessionId: session.id,
            stripeCustomerId: typeof session.customer === "string" ? session.customer : null,
          },
        });
        console.info(`[Stripe Webhook] Successfully upgraded exchange ${exchangeId} to Host Pass!`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    console.error("[Stripe Webhook Handler Error]:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
