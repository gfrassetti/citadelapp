import { NextResponse } from "next/server";

export async function PUT(request) {
  try {
    const { subscriptionId } = await request.json();

    if (!subscriptionId) {
      return NextResponse.json({ error: "Falta el ID de la suscripción" }, { status: 400 });
    }

    const ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN;
    const response = await fetch(`https://api.mercadopago.com/preapproval/${subscriptionId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "cancelled" }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData }, { status: response.status });
    }

    const responseData = await response.json();

    return NextResponse.json({
      message: "Suscripción cancelada exitosamente",
      data: responseData,
    }, { status: 200 });
  } catch (error) {
    console.error("❌ Error al cancelar la suscripción:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
