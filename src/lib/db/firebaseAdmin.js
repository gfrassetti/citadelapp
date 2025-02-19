import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
}

const db = admin.firestore();

export async function updateUserPlan(userId, preapprovalId) {
  try {
    const userRef = db.collection("users").doc(userId);
    await userRef.update({
      subscription: preapprovalId,
      plan: "pro",
    });
    console.log(`✅ Usuario ${userId} actualizado a plan PRO`);
  } catch (error) {
    console.error("❌ Error al actualizar el usuario en Firestore:", error);
  }
}
