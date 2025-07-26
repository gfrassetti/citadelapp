import { NextResponse } from "next/server";
import Stripe from "stripe";
import { sendEmail } from "@/lib/email/sendEmail";
import { subscriptionReactivatedEmail } from "@/lib/email/templates";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
});

export async function PUT(req) {
  try {
    const { subscriptionId, user } = await req.json();

    if (!subscriptionId) {
      return NextResponse.json({ error: "Falta el ID de suscripción" }, { status: 400 });
    }

    const reactivated = await stripe.subscriptions.update(subscriptionId, {
      pause_collection: null,
    });

    const { subject, html } = subscriptionReactivatedEmail(user);
    await sendEmail({
      to: user.email,
      subject,
      html,
    });

    return NextResponse.json(reactivated);
  } catch (error) {
    console.error("❌ Error al reactivar suscripción:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
