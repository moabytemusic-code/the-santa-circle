import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "sk_test_placeholder_santacircle";

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-02-24.acacia" as unknown as Stripe.LatestApiVersion,
  appInfo: {
    name: "The Santa Circle",
    version: "1.0.0",
  },
});
