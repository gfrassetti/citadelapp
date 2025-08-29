import { NextResponse } from "next/server";
import { admin } from "@/lib/db/firebaseAdmin";

export async function POST(req) {
  try {
    const { uid, email, amount, reason, backUrl } = await req.json();
    if (!uid || !email || !amount) return NextResponse.json({ error: "bad_request" }, { status: 400 });

    const body = {
      reason: reason || "La Citadel PRO",
      auto_recurring: {
        frequency: 1,
        frequency_type: "months",
        transaction_amount: Number(amount),
        currency_id: "ARS"
      },
      back_url: backUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription`,
      payer_email: email,
      external_reference: uid
    };

    const r = await fetch("https://api.mercadopago.com/preapproval", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    const data = await r.json();
    if (!r.ok) return NextResponse.json(data, { status: r.status });

    await admin.firestore().collection("users").doc(uid).set(
      {
        mp: { preapproval_id: data.id, status: data.status || "pending" },
        plan: data.status === "authorized" ? "pro" : "free"
      },
      { merge: true }
    );

    return NextResponse.json({ init_point: data.init_point || data.sandbox_init_point, id: data.id });
  } catch (e) {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
