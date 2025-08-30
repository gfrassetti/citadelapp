import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db/firebaseAdmin";

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
    return NextResponse.json({ error: "Webhook inválido" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        const customer = await stripe.customers.retrieve(customerId);
        const uid = customer.metadata?.uid;

        if (uid) {
          await db.collection("users").doc(uid).update({
            plan: subscription.status === "active" ? "pro" : "free",
            subscriptionId: subscription.id,
          });
        }

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const customer = await stripe.customers.retrieve(subscription.customer);
        const uid = customer.metadata?.uid;

        if (uid) {
          await db.collection("users").doc(uid).update({
            plan: "free",
            subscriptionId: subscription.id,
          });
        }

        break;
      }

      default:
        console.log(`🔹 Evento ignorado: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("❌ Error al procesar webhook:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
