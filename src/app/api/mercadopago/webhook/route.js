import { MercadoPagoConfig, PreApproval } from "mercadopago";
import { updateUserPlan } from "@/lib/db/firebaseAdmin";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("📩 Webhook recibido:", JSON.stringify(body));

    const preapprovalId = body?.data?.id;
    if (!preapprovalId) {
      console.warn("⚠️ Webhook sin ID válido (simulación vacía o mal configurada)");
      return new Response("Missing preapproval ID", { status: 400 });
    }

    const preapproval = await new PreApproval(client).get({ id: preapprovalId });
    console.log("📄 Preapproval recuperado:", preapproval);

    if (!preapproval?.external_reference) {
      return new Response("Missing external_reference", { status: 400 });
    }

    await updateUserPlan(preapproval.external_reference, preapproval.id);
    console.log("✅ Usuario actualizado a PRO");

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("❌ Error en el webhook:", error);
    return new Response("Webhook error", { status: 500 });
  }
}

