import { NextResponse } from "next/server";
import Stripe from "stripe";
import { sendEmail } from "@/lib/email/sendEmail";
import { subscriptionPausedEmail } from "@/lib/email/templates";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
});

export async function PUT(req) {
  try {
    const { subscriptionId, user } = await req.json();

    if (!subscriptionId) {
      return NextResponse.json({ error: "Falta el ID de suscripción" }, { status: 400 });
    }

    const paused = await stripe.subscriptions.update(subscriptionId, {
      pause_collection: {
        behavior: "mark_uncollectible",
      },
    });

    const { subject, html } = subscriptionPausedEmail(user);
    await sendEmail({
      to: user.email,
      subject,
      html,
    });

    return NextResponse.json(paused);
  } catch (error) {
    console.error("❌ Error al pausar suscripción:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
