import { NextResponse } from "next/server";
import { MercadoPagoConfig, PreApproval } from "mercadopago";
import { db } from "@/lib/db/firebaseAdmin";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

export async function POST(req) {
  try {
    console.log("📩 Recibiendo solicitud de suscripción...");

    const { uid, email } = await req.json();

    if (!uid || !email) {
      console.error("❌ Faltan datos requeridos");
      return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 });
    }

    if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
      console.error("❌ ERROR: `MERCADOPAGO_ACCESS_TOKEN` no está definido.");
      return NextResponse.json({ error: "Error en la configuración de MercadoPago" }, { status: 500 });
    }

    const startDate = new Date();
    startDate.setMinutes(startDate.getMinutes() + 1);

    const preApproval = new PreApproval(client);

    console.log("🚀 Enviando solicitud a MercadoPago...");

    const subscription = await preApproval.create({
      body: {
        reason: "Plan Pro - Acceso Premium",
        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          transaction_amount: 15.00,
          currency_id: "ARS",
          start_date: startDate.toISOString(),
          payment_methods_allowed: {
            payment_types: [
              { id: "credit_card" },
              { id: "debit_card" },
              { id: "account_money" }
            ]
          }
        },
        payer_email: email,
        back_url: "https://admin-panel-psi-two.vercel.app/dashboard",
        external_reference: uid
      },
    });

    console.log("✅ Respuesta de MercadoPago:", subscription);

    // 🔄 Actualizar Firestore con el nuevo ID de suscripción y el plan "pro"
    await db.collection("users").doc(uid).update({
      plan: "pro",
      subscription: subscription.id,
    });

    return NextResponse.json({ subscriptionUrl: subscription.init_point });

  } catch (error) {
    console.error("❌ Error al crear la suscripción:", error);

    if (error.response) {
      const err = await error.response.json();
      console.error("📌 Respuesta de MercadoPago:", err);
      return NextResponse.json({ error: err }, { status: error.response.status || 500 });
    }

    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}


