import { NextResponse } from "next/server";
import { MercadoPagoConfig, PreApproval } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

const api = {
  user: {
    async subscribe(req) {
      try {
        console.log("📩 Recibiendo solicitud de suscripción...");

        const { uid, email } = await req.json();

        if (!uid || !email) {
          console.error("❌ Faltan datos requeridos", { uid, email });
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
              transaction_amount: 15.0,
              currency_id: "ARS",
              start_date: startDate.toISOString(),
            },
            payer_email: email,               // ✅ Email dinámico del usuario real
            back_url: "https://admin-panel-psi-two.vercel.app/dashboard",
            external_reference: email,        // ✅ También el email para que el webhook lo relacione
          },
        });

        console.log("✅ Respuesta de MercadoPago:", subscription);

        return NextResponse.json({ subscriptionUrl: subscription.init_point });
      } catch (error) {
        console.error("❌ Error al crear la suscripción:", error);

        if (error.response) {
          console.error("📌 Respuesta de MercadoPago:", error.response.data);
          return NextResponse.json(
            {
              error: error.response.data.message || "Error desconocido",
              detail: error.response.data,
            },
            { status: error.response.status || 500 }
          );
        }

        return NextResponse.json(
          {
            error: error.message || "Error en el servidor",
            stack: error.stack || null,
          },
          { status: 500 }
        );
      }
    },
  },
};

export async function POST(req) {
  return api.user.subscribe(req);
}
