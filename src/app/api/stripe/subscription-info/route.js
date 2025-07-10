import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
});

export async function GET(req) {
  try {
    const uid = req.headers.get("x-user-id");
    if (!uid) {
      return NextResponse.json({ error: "Falta el ID del usuario" }, { status: 400 });
    }

    const customers = await stripe.customers.search({
      query: `metadata['uid']:'${uid}'`,
    });

    if (!customers.data.length) {
      return NextResponse.json({ subscription: null }, { status: 200 });
    }

    const customer = customers.data[0];

    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: "all",
      expand: ["data.items.data.price.product", "data.default_payment_method"],
      limit: 1,
    });

    if (!subscriptions.data.length) {
      return NextResponse.json({ subscription: null }, { status: 200 });
    }

    return NextResponse.json({
      subscription: subscriptions.data[0],
      customer,
    });
  } catch (error) {
    console.error("❌ Error en subscription-info:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
