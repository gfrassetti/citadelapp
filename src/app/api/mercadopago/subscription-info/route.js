// app/api/mercadopago/subscription-info/route.js
import { NextResponse } from "next/server";
import { db, updateUserPlan } from "@/lib/db/firebaseAdmin";
import { MercadoPagoConfig, PreApproval } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

// 🔹 Endpoint para el FRONTEND (consulta)
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

// 🔹 Endpoint para MERCADOPAGO (webhook)
export async function POST(req) {
  try {
    const body = await req.json();

    if (body.type === "subscription_preapproval") {
      console.log("📩 Recibiendo notificación de suscripción...");

      const preApproval = new PreApproval(client);
      const subData = await preApproval.get({ id: body.data.id });

      if (subData.status === "authorized") {
        await updateUserPlan(subData.external_reference, subData.id);
        console.log("✅ Plan actualizado a PRO");
      }
    }

    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("❌ Error en el webhook:", error);
    return new Response(null, { status: 500 });
  }
}

