import { NextResponse } from "next/server";
import { db } from "@/lib/db/firebaseAdmin";

export async function PUT(request) {
  try {
    const { subscriptionId, userId } = await request.json();

    if (!subscriptionId || !userId) {
      return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 });
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

    // 🔁 Actualizar Firestore
    await db.collection("users").doc(userId).update({
      plan: "free",
      subscription: "",
    });

    return NextResponse.json({
      message: "Suscripción cancelada y plan actualizado en Firestore",
      data: responseData,
    }, { status: 200 });

  } catch (error) {
    console.error("❌ Error al cancelar la suscripción:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
