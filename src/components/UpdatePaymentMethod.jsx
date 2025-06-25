import { useUser } from "@/context/AuthContext";
import { useSubscription } from "@/context/SubscriptionContext";

export default function UpdatePaymentMethod() {
  const { user } = useUser();
  const { subscription } = useSubscription();

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

  const handleBuySubscription = async () => {
    const res = await fetch("/api/stripe/buy-subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid: user.uid }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("No se pudo iniciar el pago.");
    }
  };

  return (
    <div className="pt-8">
      <h2 className="text-2xl font-bold mb-4">Actualizar Método de Pago</h2>
      <button
        onClick={handleOpenPortal}
        className="btn text-white px-4 py-2 rounded"
      >
        Ir al Portal de Pagos
      </button>
      {/* Mostrar botón para volver a comprar suscripción si terminó */}
      {subscription?.status === "canceled" &&
        subscription?.current_period_end * 1000 < Date.now() && (
        <button
          onClick={handleBuySubscription}
          className="btn bg-green-600 text-white px-4 py-2 rounded ml-4"
        >
          Contratar Suscripción
        </button>
      )}
    </div>
  );
}
