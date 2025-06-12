import { NextResponse } from "next/server";
import { db } from "@/lib/db/firebaseAdmin";
import { MercadoPagoConfig, PreApproval } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

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

    const userRef = userSnapshot.docs[0].ref;
    const userData = userSnapshot.docs[0].data();
    const subscriptionId = userData.subscription;

    if (!subscriptionId) {
      return NextResponse.json({ error: "El usuario no tiene suscripción" }, { status: 404 });
    }

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
    const now = new Date();
    const nextPaymentDate = subscriptionData.next_payment_date ? new Date(subscriptionData.next_payment_date) : null;
    const isExpired = nextPaymentDate && now > nextPaymentDate;
    const status = subscriptionData.status;

    if (
      status === "cancelled" ||
      (isExpired && status !== "authorized" && status !== "paused")
    ) {
      await userRef.update({ plan: "free" });
    } else {
      await userRef.update({ plan: "pro" });
    }

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

export async function POST(req) {
  try {
    const body = await req.json();

    if (body.type === "subscription_preapproval") {
      const preApproval = new PreApproval(client);
      const subData = await preApproval.get({ id: body.data.id });

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
