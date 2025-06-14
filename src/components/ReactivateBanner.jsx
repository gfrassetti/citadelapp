"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useUser } from "@/context/AuthContext";
import { useSubscription } from "@/context/SubscriptionContext";

export default function ReactivateBanner() {
  const { user } = useUser();
  const { subscription } = useSubscription();
  const [isReactivating, setIsReactivating] = useState(false);

  const show = subscription?.pause_collection;
  const subscriptionId = subscription?.id;

  const handleReactivate = async () => {
    if (!subscriptionId) return;
    setIsReactivating(true);

    const res = await fetch("/api/stripe/reactivate-subscription", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscriptionId }),
    });

    if (res.ok) {
      toast("Suscripción reactivada", {
        description: "Tu plan PRO ha sido restaurado exitosamente.",
      });
      setTimeout(() => window.location.reload(), 1000);
    } else {
      toast("Error al reactivar", {
        description: "No se pudo reactivar tu suscripción.",
        variant: "destructive",
      });
    }

    setIsReactivating(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-yellow-400 shadow-lg text-black p-4 rounded-xl flex items-center gap-4">
      <span className="font-medium">Tu suscripción está pausada.</span>
      <button
        onClick={handleReactivate}
        disabled={isReactivating}
        className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800"
      >
        Reactivar
      </button>
    </div>
  );
}
