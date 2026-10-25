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
      const productType = session.metadata?.productType;
      const exchangeId = session.metadata?.exchangeId || session.client_reference_id;

      // 1. Host Pass Upgrade
      if (exchangeId && productType !== "digital_goods") {
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

      // 2. Digital Product Purchase (Party Games Bundle)
      if (productType === "digital_goods" || session.metadata?.productId === "holiday_games_bundle_2026") {
        const customerEmail = session.customer_details?.email || session.customer_email || "guest@thesantacircle.com";
        const customerName = session.customer_details?.name || null;

        await prisma.digitalOrder.upsert({
          where: { stripeSessionId: session.id },
          update: { status: "COMPLETED" },
          create: {
            stripeSessionId: session.id,
            customerEmail: customerEmail.toLowerCase().trim(),
            productName: "The Ultimate Holiday Party Games & Icebreaker Pack",
            amountCents: session.amount_total || 799,
            currency: session.currency || "usd",
            status: "COMPLETED",
          },
        });

        // Add to leads list automatically
        try {
          await prisma.leadSubscriber.upsert({
            where: { email: customerEmail.toLowerCase().trim() },
            update: { source: "DIGITAL_GAMES_CUSTOMER" },
            create: {
              email: customerEmail.toLowerCase().trim(),
              name: customerName,
              source: "DIGITAL_GAMES_CUSTOMER",
              culturalTheme: "CLASSIC",
            },
          });
        } catch {
          // ignore duplicate
        }

        console.info(`[Stripe Webhook] Successfully recorded digital order for ${customerEmail}!`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    console.error("[Stripe Webhook Handler Error]:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
