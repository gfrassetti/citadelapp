import { MercadoPagoConfig, PreApproval } from "mercadopago";
import { updateUserPlan } from "@/lib/db/firebaseAdmin";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

export async function POST(req) {
  try {
    const body = await req.json();

    if (body.type === "subscription_preapproval") {
      const preapprovalId = body.data.id;
      const subscription = await new PreApproval(client).get({ id: preapprovalId });

      if (
        subscription &&
        subscription.status === "authorized" &&
        subscription.external_reference
      ) {
        await updateUserPlan(subscription.external_reference, subscription.id);
      }
    }

    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("❌ Error en el webhook:", error);
    return new Response(null, { status: 500 });
  }
}
