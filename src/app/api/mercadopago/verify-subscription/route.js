import { MercadoPagoConfig, PreApproval } from "mercadopago";
import { updateUserPlan } from "@/lib/db/firebaseAdmin";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

export async function POST(req) {
  try {
    const { preapprovalId, uid } = await req.json();

    if (!preapprovalId || !uid) {
      return new Response("Missing data", { status: 400 });
    }

    const preapproval = await new PreApproval(client).get({ id: preapprovalId });

    if (preapproval.status === "authorized" || preapproval.status === "pending") {
      await updateUserPlan(uid, preapproval.id);
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    return new Response("Subscription not active", { status: 400 });
  } catch (err) {
    console.error("❌ verify-subscription error:", err);
    return new Response("Internal error", { status: 500 });
  }
}
