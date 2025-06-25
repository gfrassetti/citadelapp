"use client";

import { useUser } from "@/context/AuthContext";
import { useSubscription } from "@/context/SubscriptionContext";
import { useHandleUpgrade } from "@/hooks/useHandleUpgrade";

export default function UpdatePaymentMethod() {
  const { user } = useUser();
  const { subscription } = useSubscription();
  const handleUpgrade = useHandleUpgrade(user);

  const handleOpenPortal = async () => {
    const res = await fetch("/api/stripe/update-payment-method", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid: user.uid }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("No se pudo abrir el portal de pagos.");
    }
  };

  // Estado de suscripción cancelada y período ya expirado
  const isCanceled =
    subscription?.status === "canceled" &&
    subscription?.current_period_end * 1000 < Date.now();

  return (
    <div className="pt-8">
      <h2 className="text-2xl font-bold mb-4">Actualizar Método de Pago</h2>
      <button
        onClick={handleOpenPortal}
        className="btn text-white px-4 py-2 rounded bg-black"
      >
        Ir al Portal de Pagos
      </button>
      {/* Mostrar el botón para volver a suscribirse si el user ya no tiene suscripción activa */}
      {isCanceled && (
        <button
          onClick={() => handleUpgrade.mutate()}
          className="btn bg-green-600 text-white px-4 py-2 rounded ml-4"
          disabled={handleUpgrade.isPending}
        >
          {handleUpgrade.isPending ? "Redirigiendo..." : "Contratar Suscripción"}
        </button>
      )}
    </div>
  );
}
