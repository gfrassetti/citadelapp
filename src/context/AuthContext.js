"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/db/db";
import { getFirestore, doc, onSnapshot, updateDoc } from "firebase/firestore";

const db = getFirestore();
const AuthContext = createContext({ user: null, loading: true });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const updateUserPlan = async (newPlan) => {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { plan: newPlan });
      setUser((prev) => ({ ...prev, plan: newPlan }));
    }
  };

  const checkSubscriptionStatus = async (userEmail, userId) => {
    try {
      const response = await fetch("/api/mercadopago/subscription-info", {
        headers: { "x-user-email": userEmail },
      });

      if (!response.ok) {
        console.warn("❗ No se pudo obtener la suscripción. Status:", response.status);
        return;
      }

      const data = await response.json();
      const subscription = data.subscription;

      if (!subscription) return;

      const now = new Date();
      const endDate = subscription.auto_recurring?.end_date
        ? new Date(subscription.auto_recurring.end_date)
        : null;

      if (subscription.status === "cancelled" && endDate && now >= endDate) {
        console.log("La suscripción ha expirado, cambiando el plan a Free.");
        await updateDoc(doc(db, "users", userId), { plan: "free" });
        setUser((prev) => ({ ...prev, plan: "free" }));
      }
    } catch (error) {
      console.error("Error al verificar la suscripción:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      const userRef = doc(db, "users", firebaseUser.uid);
      const unsubSnapshot = onSnapshot(userRef, async (snap) => {
        if (snap.exists()) {
          const userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            plan: snap.data().plan || "free",
            ...snap.data(),
          };
          setUser(userData);

          // 🔥 Llamamos a la API de MercadoPago al iniciar sesión
          await checkSubscriptionStatus(userData.email, userData.uid);
        } else {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            plan: "free",
          });
        }
        setLoading(false);
      });

      return () => unsubSnapshot();
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, updateUserPlan }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useUser = () => useContext(AuthContext);
