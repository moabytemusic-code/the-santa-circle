import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getSession } from "@/lib/auth/session";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    let body: { email?: string; productId?: string } = {};
    try {
      body = await req.json();
    } catch {
      // Body may be empty if simple post
    }

    const customerEmail = body.email || session?.email || undefined;
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
              name: "The Ultimate Holiday Party Games & Icebreaker Pack (Printable PDF)",
              description:
                "Instant printable Dirty Santa theft cards (deck of 30), Christmas Trivia showdown, Holiday Song Emoji Pictionary, and Gift Exchange Bingo.",
              images: ["https://thesantacircle.com/images/santa-logo.png"],
            },
            unit_amount: 799, // $7.99
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: customerEmail,
      metadata: {
        productType: "digital_goods",
        productId: "holiday_games_bundle_2026",
        userId: session?.id || "guest",
      },
      success_url: `${appUrl}/games-bundle?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/games-bundle`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err: unknown) {
    console.error("[Stripe Digital Checkout Error]:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to initiate digital checkout" },
      { status: 500 }
    );
  }
}
