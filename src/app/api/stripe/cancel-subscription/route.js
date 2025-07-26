import { NextResponse } from "next/server";
import Stripe from "stripe";
import { sendEmail } from "@/lib/email/sendEmail";
import { subscriptionCancelledEmail } from "@/lib/email/templates";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
});


export async function PUT(req) {
  try {
    const { subscriptionId, user } = await req.json();

    if (!subscriptionId) {
      return NextResponse.json({ error: "Falta el ID de suscripción" }, { status: 400 });
    }

    const deleted = await stripe.subscriptions.cancel(subscriptionId);

    const { subject, html } = subscriptionCancelledEmail(user);

    await sendEmail({
      to: user.email,
      subject,
      html,
    });

    return NextResponse.json(deleted);
  } catch (error) {
    console.error("❌ Error al cancelar suscripción:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
