import { NextResponse } from "next/server";
import Stripe from "stripe";
import { admin } from "@/lib/db/firebaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
});

export async function POST(req) {
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event;

  try {
    console.log("🎯 Evento:", event.type);
    console.log("🔥 Subscription ID:", subscription.id);
    console.log("👤 Customer metadata.uid:", customer.metadata?.uid);

    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Error verificando firma del webhook:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const handleSubscriptionUpdate = async (subscription) => {
    const customerId = subscription.customer;
    const customer = await stripe.customers.retrieve(customerId);
    const uid = customer.metadata?.uid;

    if (!uid) {
      console.error("❌ UID no encontrado en metadata del customer.");
      return NextResponse.json({ error: "UID no encontrado" }, { status: 400 });
    }

    const userRef = admin.firestore().collection("users").doc(uid);

    await userRef.update({
      plan: "pro",
      subscriptionId: subscription.id,
    });

    console.log(`✅ Plan actualizado a PRO para UID: ${uid}`);
    return NextResponse.json({ received: true }, { status: 200 });
  };

  if (event.type === "customer.subscription.created") {
    const subscription = event.data.object;
    return await handleSubscriptionUpdate(subscription);
  }

  if (event.type.startsWith("customer.subscription")) {
    const subscription = event.data.object;
    return await handleSubscriptionUpdate(subscription);
  }

  return NextResponse.json({ received: true });
}
