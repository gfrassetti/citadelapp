"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@/context/AuthContext";

const SubscriptionContext = createContext();

export function SubscriptionProvider({ children }) {
  const { user } = useUser();
  const [subscription, setSubscription] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    const fetchSubscription = async () => {
      try {
        const res = await fetch("/api/stripe/subscription-info", {
          headers: {
            "x-user-id": user.uid,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setSubscription(data.subscription || null);
          setCustomer(data.customer || null);
        }
      } catch (err) {
        console.error("Error al cargar subscripción", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user?.uid]);

  return (
    <SubscriptionContext.Provider
      value={{ subscription, customer, loading }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  return useContext(SubscriptionContext);
}
