import { NextResponse } from "next/server";
import { MercadoPagoConfig, PreApproval } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

export async function PUT(req) {
  try {
    const { subscriptionId, cardTokenId } = await req.json();

    if (!subscriptionId || !cardTokenId) {
      return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 });
    }

    const preApproval = new PreApproval(client);
    console.log(`🔄 Actualizando método de pago para la suscripción ${subscriptionId}...`);

    const updatedSubscription = await preApproval.update({
      id: subscriptionId,
      body: {
        card_token_id: cardTokenId
      }
    });

    console.log("✅ Método de pago actualizado correctamente:", updatedSubscription);

    return NextResponse.json({ message: "Método de pago actualizado correctamente" });
  } catch (error) {
    console.error("❌ Error al actualizar el método de pago:", error);

    if (error.response) {
      console.error("📌 Respuesta de MercadoPago:", error.response.data);
      return NextResponse.json({ error: error.response.data }, { status: error.response.status || 500 });
    }

    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}
