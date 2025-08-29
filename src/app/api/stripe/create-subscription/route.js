import { NextResponse } from "next/server";
import Stripe from "stripe";
import { admin } from "@/lib/db/firebaseAdmin";
import { sendEmail } from "@/lib/email/sendEmail";
import { subscriptionPaidEmail } from "@/lib/email/templates";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
});

export async function POST(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decoded = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name = "" } = decoded;

    if (!uid || !email) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    await stripe.customers.create({
      email,
      metadata: { uid: user.uid },
    });

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: 60,
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?canceled=true`,
    });

    const subscriptionId = session.subscription;

    await admin.firestore().collection("users").doc(uid).set(
      {
        stripeCustomerId: customer.id,
        subscriptionId: subscriptionId || null,
      },
      { merge: true }
    );

    const { subject, html } = subscriptionPaidEmail({ name });
    await sendEmail({ to: email, subject, html });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("❌ Error con Stripe:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
