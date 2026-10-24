import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { exchangeId } = await req.json();
    if (!exchangeId) {
      return NextResponse.json({ error: "Exchange ID is required" }, { status: 400 });
    }

    const exchange = await prisma.giftExchange.findUnique({
      where: { id: exchangeId },
      include: {
        familyGroup: {
          include: {
            memberships: {
              where: { userId: session.id },
            },
          },
        },
      },
    });

    if (!exchange) {
      return NextResponse.json({ error: "Exchange not found" }, { status: 404 });
    }

    const isGroupAdmin = exchange.familyGroup.memberships.some(
      (m) => m.role === "ADMIN"
    );
    const isCreator = exchange.createdById === session.id;

    if (!isGroupAdmin && !isCreator && session.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only the exchange host or administrator can upgrade to a Host Pass." },
        { status: 403 }
      );
    }

    if (exchange.isPremium) {
      return NextResponse.json({ message: "This exchange is already upgraded to Host Pass!" });
    }

    const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
    const proto = req.headers.get("x-forwarded-proto") || "https";
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (host ? `${proto}://${host}` : "https://thesantacircle.com");

    const checkoutSession = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `The Santa Circle - Host Pass (${exchange.name})`,
              description:
                "Unlimited circle participants, automated reminder broadcasts, custom countdown reveal, and priority support.",
            },
            unit_amount: 799, // $7.99 in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: session.email,
      client_reference_id: exchange.id,
      metadata: {
        exchangeId: exchange.id,
        userId: session.id,
        exchangeName: exchange.name,
      },
      success_url: `${appUrl}/admin?upgraded=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/admin?canceled=true`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err: unknown) {
    console.error("[Stripe Checkout Error]:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
