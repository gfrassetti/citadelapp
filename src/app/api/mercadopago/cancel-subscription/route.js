import { NextResponse } from "next/server";
import { db } from "@/lib/db/firebaseAdmin";

export async function PUT(request) {
  try {
    const { subscriptionId, userId } = await request.json();

    if (!subscriptionId || !userId) {
      return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 });
    }

    const ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN;

    const mpResponse = await fetch(
      `https://api.mercadopago.com/preapproval/${subscriptionId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "cancelled" }),
      }
    );

    if (!mpResponse.ok) {
      const errorData = await mpResponse.json();
      return NextResponse.json({ error: errorData }, { status: mpResponse.status });
    }

    // 🔹 Actualizar Firestore después de cancelar la suscripción
    await db.collection("users").doc(userId).update({
      plan: "free",
    });

    return NextResponse.json({ message: "Suscripción cancelada exitosamente y plan actualizado." }, { status: 200 });
  } catch (error) {
    console.error("Error al cancelar la suscripción:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
