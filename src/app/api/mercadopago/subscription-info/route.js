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

    const subscriptionData = await mpResponse.json();

    // 🔹 Obtener la fecha actual y la fecha de próximo pago
    const now = new Date();
    const nextPaymentDate = subscriptionData.next_payment_date
      ? new Date(subscriptionData.next_payment_date)
      : null;
    const isExpired = nextPaymentDate && now > nextPaymentDate;

    // 🔹 Si la suscripción está vencida, actualizar Firestore
    if (isExpired && userData.plan !== "free") {
      console.log("⏳ Suscripción vencida. Actualizando Firestore...");
      await db.collection("users").doc(userSnapshot.docs[0].id).update({
        plan: "free",
      });
    }

    return NextResponse.json(
      {
        subscription: subscriptionData,
        paymentMethod: subscriptionData.payment_method_id || "unknown",
        lastFourDigits: subscriptionData.card?.last_four_digits || "****",
        isExpired,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error al obtener la suscripción:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
