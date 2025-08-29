import { NextResponse } from "next/server";
import { admin } from "@/lib/db/firebaseAdmin";

function verify(req) {
  const h = req.headers.get("x-webhook-secret");
  return h && h === process.env.MP_WEBHOOK_SECRET;
}

export async function POST(req) {
  try {
    if (!verify(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    const payload = await req.json();
    const { type, data } = payload || {};
    if (type !== "preapproval" || !data?.id) return NextResponse.json({ ok: true });

    const r = await fetch(`https://api.mercadopago.com/preapproval/${data.id}`, {
      headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` }
    });
    const pre = await r.json();

    const uid = pre.external_reference;
    const status = pre.status;
    const plan = status === "authorized" ? "pro" : status === "paused" || status === "cancelled" ? "free" : "free";

    if (uid) {
      await admin.firestore().collection("users").doc(uid).set(
        { mp: { preapproval_id: pre.id, status }, plan },
        { merge: true }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
