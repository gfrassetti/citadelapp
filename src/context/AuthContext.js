"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/db/db";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const db = getFirestore();
const AuthContext = createContext({ user: null, loading: true });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Definir la función aquí
  const updateUserPlan = (newPlan) => {
    setUser((prev) => ({ ...prev, plan: newPlan }));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      // Obtiene el documento del usuario en Firestore
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

      const userData = userDoc.exists()
        ? userDoc.data()
        : { plan: "free" };

      setUser({
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || "Usuario",
        email: firebaseUser.email,
        avatar: firebaseUser.photoURL || "",
        plan: userData.plan,
      });

      setLoading(false);
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
