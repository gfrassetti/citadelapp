import { NextResponse } from "next/server";
import Stripe from "stripe";
import { admin } from "@/lib/db/firebaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
});

export async function GET(req) {
  try {
    const uid = req.headers.get("x-user-id");
    if (!uid) {
      return NextResponse.json({ error: "Falta el ID del usuario" }, { status: 400 });
    }

    const customers = await stripe.customers.search({
      query: `metadata['uid']:'${uid}'`,
    });

    if (!customers.data.length) {
      await admin.firestore().collection("users").doc(uid).update({
        plan: "free",
        subscription: "",
      });
      return NextResponse.json({ subscription: null }, { status: 200 });
    }

    const customer = customers.data[0];

    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: "all",
      expand: ["data.items", "data.default_payment_method"],
    });

    const validSubscription = subscriptions.data.find(
      (sub) =>
        sub.status === "active" ||
        sub.status === "trialing" ||
        (sub.status === "canceled" &&
          sub.cancel_at &&
          sub.current_period_end * 1000 > Date.now())
    );
    

    if (!validSubscription) {
      await admin.firestore().collection("users").doc(uid).update({
        plan: "free",
        subscription: "",
      });
      return NextResponse.json({ subscription: null }, { status: 200 });
    }

    const subscription = validSubscription;
    const status = subscription.status;
    console.log('status:', status);
    const currentPeriodEnd = subscription.current_period_end;
    const now = Math.floor(Date.now() / 1000);
    const expired = status === "canceled" && currentPeriodEnd < now;

    if (expired) {
      await admin.firestore().collection("users").doc(uid).update({
        plan: "free",
        subscription: "",
      });
      return NextResponse.json({ subscription: null }, { status: 200 });
    }

    if (status === "active" || status === "paused") {
      await admin.firestore().collection("users").doc(uid).update({
        plan: "pro",
        subscription: subscription.id,
      });      
    }

    return NextResponse.json({
      subscription,
      customer,
    });
  } catch (error) {
    console.error("❌ Error en subscription-info:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

