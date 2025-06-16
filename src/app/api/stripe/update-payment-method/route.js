import { NextResponse } from "next/server";
import Stripe from "stripe";
import { admin } from "@/lib/db/firebaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
});

export async function POST(req) {
  try {
    const { uid } = await req.json();

    if (!uid) {
      return NextResponse.json({ error: "Falta UID" }, { status: 400 });
    }

    const userRef = admin.firestore().collection("users").doc(uid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const userData = userSnap.data();
    const customerId = userData?.stripeCustomerId;
    const subscriptionId = userData?.subscriptionId;

    let resolvedCustomerId = customerId;

    // Si no hay customerId directo, intentar resolverlo desde la suscripción
    if (!resolvedCustomerId && subscriptionId) {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      resolvedCustomerId = subscription.customer;
    }

    if (!resolvedCustomerId) {
      return NextResponse.json({ error: "No se pudo obtener el cliente de Stripe" }, { status: 400 });
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: resolvedCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error("❌ Error creando portal de pagos:", error.message);
    return NextResponse.json({ error: "Error interno al abrir el portal de pagos" }, { status: 500 });
  }
}
