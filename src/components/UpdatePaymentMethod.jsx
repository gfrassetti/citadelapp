import { useUser } from "@/context/AuthContext";

export default function UpdatePaymentMethod() {
  const { user } = useUser();

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
  

  return (
    <div className="pt-8">
      <h2 className="text-2xl font-bold mb-4">Actualizar Método de Pago</h2>
      <button
        onClick={handleOpenPortal}
        className="btn text-white px-4 py-2 rounded"
      >
        Ir al Portal de Pagos
      </button>
    </div>
  );
}
