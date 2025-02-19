import { admin } from "@/lib/db/firebaseAdmin";

export async function GET(req) {
  console.log("📢 API get-user-plan ejecutada");

  const url = new URL(req.url);
  const uid = url.searchParams.get("uid");

  if (!uid) {
    console.error("❌ Falta el UID en la solicitud");
    return new Response("Falta el UID", { status: 400 });
  }

  console.log("🔍 Buscando usuario en Firestore con UID:", uid);
  const userRef = admin.firestore().collection("users").doc(uid);
  const userSnapshot = await userRef.get();

  if (!userSnapshot.exists) {
    console.error("❌ Usuario no encontrado en Firestore con UID:", uid);
    return new Response("Usuario no encontrado", { status: 404 });
  }

  const userData = userSnapshot.data();
  console.log("✅ Plan encontrado en Firestore:", userData.plan);

  return new Response(JSON.stringify({ plan: userData.plan }), { status: 200 });
}
