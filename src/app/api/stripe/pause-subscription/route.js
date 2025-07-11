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

    const paused = await stripe.subscriptions.update(subscriptionId, {
      pause_collection: {
        behavior: "mark_uncollectible", // Alternativas: "void" o "keep_as_draft"
      },
    });

    return NextResponse.json(paused);
  } catch (error) {
    console.error("❌ Error al pausar suscripción:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
