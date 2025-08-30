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
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Error verificando firma del webhook:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // ✔️ NUEVO: cuando se completa el checkout
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      const customerId = session.customer;
      const subscriptionId = session.subscription;

      const customer = await stripe.customers.retrieve(customerId);
      const uid = customer.metadata?.uid;

      if (!uid) {
        console.error("❌ UID no encontrado en metadata del customer.");
        return NextResponse.json({ error: "UID no encontrado" }, { status: 400 });
      }

      await admin.firestore().collection("users").doc(uid).update({
        plan: "pro",
        subscription: subscriptionId,
        stripeCustomerId: customerId,
        subscriptionId,
      });

      console.log(`✅ Usuario ${uid} actualizado a PRO por webhook`);
    } catch (err) {
      console.error("❌ Error en checkout.session.completed:", err.message);
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }

  // ya tenías esto, dejalo también
  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object;

    try {
      const customerId = subscription.customer;
      const customer = await stripe.customers.retrieve(customerId);
      const uid = customer.metadata?.uid;

      if (!uid) {
        console.error("❌ UID no encontrado en metadata del customer.");
        return NextResponse.json({ error: "UID no encontrado" }, { status: 400 });
      }

      await admin.firestore().collection("users").doc(uid).update({
        plan: "pro",
        subscription: subscription.id,
      });

      console.log(`✅ Plan actualizado a PRO para UID: ${uid}`);
    } catch (err) {
      console.error("❌ Error actualizando plan en Firestore:", err.message);
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
