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

  const checkStripeSubscriptionStatus = async (uid) => {
    try {
      const response = await fetch("/api/stripe/subscription-info", {
        headers: { "x-user-id": uid },
      });
  
      if (!response.ok) return;
  
      const data = await response.json();
      const subscription = data.subscription;
  
      if (!subscription) return;
  
      const userRef = doc(db, "users", uid);
      const now = new Date();
  
      if (
        subscription.status === "active" ||
        subscription.status === "trialing"
      ) {
        await updateDoc(userRef, {
          plan: "pro",
          subscriptionId: subscription.id,
        });
        setUser((prev) => ({
          ...prev,
          plan: "pro",
          subscriptionId: subscription.id,
        }));
        return;
      }
  
      if (
        subscription.status === "canceled" &&
        subscription.cancel_at &&
        now >= new Date(subscription.cancel_at * 1000)
      ) {
        console.log("⚠️ Forzando plan a free por suscripción cancelada vencida", subscription.id);
        await updateDoc(userRef, {
          plan: "free",
          subscriptionId: subscription.id,
        });
        setUser((prev) => ({
          ...prev,
          plan: "free",
          subscriptionId: subscription.id,
        }));
      }
    } catch (error) {
      console.error("Error al verificar la suscripción de Stripe:", error);
    }
  };
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }
  
      try {
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
            await checkStripeSubscriptionStatus(userData.uid);
          } else {
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              plan: "free",
            });
          }
          setLoading(false);
        }, (error) => {
          console.error("Error en onSnapshot:", error);
          setUser(null);
          setLoading(false);
        });
  
        // asegurate que loading no se quede colgado
        return () => unsubSnapshot();
      } catch (error) {
        console.error("Error al obtener snapshot del usuario:", error);
        setUser(null);
        setLoading(false);
      }
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
