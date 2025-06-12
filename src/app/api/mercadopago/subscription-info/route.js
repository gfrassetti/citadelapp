import { NextResponse } from "next/server";
import { db } from "@/lib/db/firebaseAdmin";
import { MercadoPagoConfig, PreApproval } from "mercadopago";

// Inicializa cliente de MercadoPago con access token
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

// 🔹 Endpoint GET para que el frontend obtenga información de la suscripción
export async function GET(request) {
  try {
    const userEmail = request.headers.get("x-user-email");

    if (!userEmail) {
      return NextResponse.json({ error: "Falta el email del usuario" }, { status: 400 });
    }

    // Busca el usuario en Firestore por su email
    const userSnapshot = await db.collection("users").where("email", "==", userEmail).limit(1).get();

    if (userSnapshot.empty) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const userRef = userSnapshot.docs[0].ref;
    const userData = userSnapshot.docs[0].data();
    let subscriptionId = userData.subscription;

    // 🔸 Detectamos si el usuario se registró vía Google (si tiene foto de perfil)
    const isGoogleUser = !!userData.photoURL;

    // 🔸 Detectamos si el campo `subscription` tiene un ID falso o de un plan en lugar de una suscripción
    const isFakeSubscription = subscriptionId && subscriptionId.length < 30;

    // 🔸 Si es un usuario de Google y no tiene una suscripción válida, la buscamos manualmente por email
    if ((!subscriptionId || isFakeSubscription) && isGoogleUser) {
      const mpLookup = await fetch(`https://api.mercadopago.com/preapproval/search?external_reference=${userEmail}`, {
        headers: {
          Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      const result = await mpLookup.json();
      const found = result.results?.[0];

      // 🔸 Si encontramos una suscripción válida en MercadoPago, la guardamos en Firestore
      if (found?.id) {
        subscriptionId = found.id;
        await userRef.update({ subscription: subscriptionId });
      } else {
        return NextResponse.json({ error: "No se encontró suscripción válida" }, { status: 404 });
      }
    }

    // 🔸 Consulta a la API de MercadoPago con el subscriptionId final
    const response = await fetch(`https://api.mercadopago.com/preapproval/${subscriptionId}`, {
      headers: {
        Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({ error }, { status: response.status });
    }

    const subscriptionData = await response.json();

    // 🔸 Lógica para verificar si la suscripción está vencida o cancelada
    const now = new Date();
    const nextPaymentDate = subscriptionData.next_payment_date ? new Date(subscriptionData.next_payment_date) : null;
    const isExpired = nextPaymentDate && now > nextPaymentDate;
    const status = subscriptionData.status;

    // 🔸 Si está vencida o cancelada, se actualiza a "free"; si sigue activa, se mantiene como "pro"
    if (
      status === "cancelled" ||
      (isExpired && status !== "authorized" && status !== "paused")
    ) {
      await userRef.update({ plan: "free" });
    } else {
      await userRef.update({ plan: "pro" });
    }

    // 🔸 Devuelve los datos útiles al frontend
    return NextResponse.json(
      {
        subscription: subscriptionData,
        paymentMethod: subscriptionData.payment_method_id || "unknown",
        lastFourDigits: subscriptionData.card?.last_four_digits || "****",
        frequency: subscriptionData.auto_recurring?.frequency || null,
        frequencyType: subscriptionData.auto_recurring?.frequency_type || null,
        transactionAmount: subscriptionData.auto_recurring?.transaction_amount || null,
        currencyId: subscriptionData.auto_recurring?.currency_id || null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error al obtener la suscripción:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 🔹 Webhook de MercadoPago para recibir eventos automáticos
export async function POST(req) {
  try {
    const body = await req.json();

    if (body.type === "subscription_preapproval") {
      console.log("📩 Recibiendo notificación de suscripción...");
      const preApproval = new PreApproval(client);
      const subData = await preApproval.get({ id: body.data.id });

      // 🔸 Si la suscripción fue autorizada, se busca el usuario por email y se actualiza su info
      if (subData.status === "authorized") {
        const userSnapshot = await db
          .collection("users")
          .where("email", "==", subData.external_reference)
          .limit(1)
          .get();

        if (!userSnapshot.empty) {
          const userRef = userSnapshot.docs[0].ref;
          await userRef.update({
            subscription: subData.id,
            plan: "pro",
          });
        }
      }
    }

    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("❌ Error en el webhook:", error);
    return new Response(null, { status: 500 });
  }
}
