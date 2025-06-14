import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
});

export async function PUT(req) {
  try {
    const { subscriptionId } = await req.json();

    if (!subscriptionId) {
      return NextResponse.json({ error: "Falta el ID de suscripción" }, { status: 400 });
    }

    const deleted = await stripe.subscriptions.cancel(subscriptionId);
    return NextResponse.json(deleted);
  } catch (error) {
    console.error("❌ Error al cancelar suscripción:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
