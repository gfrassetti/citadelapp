// src/app/api/stripe/webhook/route.js
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db/firebaseAdmin";

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
});

export async function POST(req) {
  const rawBody = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Error verificando webhook:", err.message);
    return new NextResponse(`Webhook error: ${err.message}`, { status: 400 });
  }

  try {
    if (
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated"
    ) {
      const subscription = event.data.object;
      const customer = await stripe.customers.retrieve(subscription.customer);
      const uid = customer.metadata?.uid;

      if (uid) {
        await db.collection("users").doc(uid).update({
          plan: subscription.status === "active" ? "pro" : "free",
          subscriptionId: subscription.id,
        });
        console.log(`✅ Plan actualizado a ${subscription.status} para UID: ${uid}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("❌ Error procesando el webhook:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
