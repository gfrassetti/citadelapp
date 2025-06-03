import { NextResponse } from "next/server";

export async function PUT(request) {
  const { subscriptionId } = await request.json();
  if (!subscriptionId) {
    return NextResponse.json({ error: "Falta el ID de la suscripción" }, { status: 400 });
  }

  const ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN;
  const res = await fetch(`https://api.mercadopago.com/preapproval/${subscriptionId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: "authorized" }),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
