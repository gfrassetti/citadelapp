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

    // Buscar el customer de Stripe por el UID
    const customers = await stripe.customers.search({
      query: `metadata['uid']:'${uid}'`,
    });

    if (!customers.data.length) {
      return NextResponse.json({ invoices: [] }, { status: 200 });
    }

    const customer = customers.data[0];

    // Obtener las facturas del customer
    const invoices = await stripe.invoices.list({
      customer: customer.id,
      limit: 10, // o el número que desees
    });

    return NextResponse.json({ invoices: invoices.data }, { status: 200 });
  } catch (error) {
    console.error("❌ Error en invoices:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
