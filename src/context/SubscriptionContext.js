// context/SubscriptionContext.jsx
"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useUser } from "@/context/AuthContext";

const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const { user } = useUser();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubscription = useCallback(async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/subscription-info", {
        headers: { "x-user-id": user.uid },
      });
      if (!res.ok) throw new Error("Error al obtener la suscripción");
      const data = await res.json();
      setSubscription(data.subscription || null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const isPaused = subscription?.pause_collection?.behavior === "mark_uncollectible";
  const isActive = subscription?.status === "active";

  return (
    <SubscriptionContext.Provider
      value={{ subscription, isPaused, isActive, loading, error, refetch: fetchSubscription }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => useContext(SubscriptionContext);
