import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
});

export async function POST(req) {
  try {
    const { uid } = await req.json();

    if (!uid) {
      return NextResponse.json({ error: "Falta el UID" }, { status: 400 });
    }

    const customers = await stripe.customers.search({
      query: `metadata['uid']:'${uid}'`,
    });

    if (!customers.data.length) {
      return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customers.data[0].id,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("❌ Error al generar portal de pago:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
