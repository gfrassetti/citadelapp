import { MercadoPagoConfig, PreApproval } from "mercadopago";
import { updateUserPlan } from "@/lib/db/firebaseAdmin";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

export async function POST(req) {
  try {
    const body = await req.json();

    if (body.type === "subscription_preapproval") {
      console.log("📩 Recibiendo notificación de suscripción...");

      const preapproval = await new PreApproval(client).get({
        id: body.data.id,
      });

      console.log("✅ Datos de la suscripción:", preapproval);

      if (preapproval.status === "authorized") {
        await updateUserPlan(preapproval.external_reference, preapproval.id);
      }
    }

    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("❌ Error en el webhook:", error);
    return new Response(null, { status: 500 });
  }
}
