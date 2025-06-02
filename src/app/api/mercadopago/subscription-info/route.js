import { NextResponse } from "next/server";
import { db } from "@/lib/db/firebaseAdmin";

export async function GET(request) {
  try {
    const userEmail = request.headers.get("x-user-email");

    if (!userEmail) {
      return NextResponse.json({ error: "Falta el email del usuario" }, { status: 400 });
    }

    const userSnapshot = await db.collection("users").where("email", "==", userEmail).limit(1).get();

    if (userSnapshot.empty) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const userData = userSnapshot.docs[0].data();
    const subscriptionId = userData.subscription;

    if (!subscriptionId) {
      return NextResponse.json({ error: "El usuario no tiene suscripción" }, { status: 404 });
    }

    const ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN;

    const mpResponse = await fetch(
      `https://api.mercadopago.com/preapproval/${subscriptionId}`,
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!mpResponse.ok) {
      const errorData = await mpResponse.json();
      return NextResponse.json({ error: errorData }, { status: mpResponse.status });
    }

    return NextResponse.json(
      {
        subscription: subscriptionData,
        paymentMethod: subscriptionData.payment_method_id || "unknown",
        lastFourDigits: subscriptionData.card?.last_four_digits || "****",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error al obtener la suscripción:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
