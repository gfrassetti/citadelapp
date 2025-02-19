"use client";
import { useState } from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { useMutation } from "@tanstack/react-query";

initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY, { locale: "es-AR" });

export default function CheckoutButton({ email, method = "pro" }) {
  const [preferenceId, setPreferenceId] = useState(null);

  const { mutate, isLoading } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/create-preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Error al crear la preferencia");
      return res.json();
    },
    onSuccess: (data) => {
      if (method === "pro") {
        window.location.href = data.init_point; // 🔥 Redirige a MercadoPago
      } else {
        setPreferenceId(data.preferenceId); // 🔥 Guarda el preferenceId para el Wallet
      }
    },
  });

  return (
    <>
      <button
        onClick={() => mutate()}
        disabled={isLoading}
        className="bg-blue-600 text-white p-3 rounded"
      >
        {isLoading ? "Procesando..." : "Pagar"}
      </button>

      {method === "api" && preferenceId && <Wallet initialization={{ preferenceId }} />}
    </>
  );
}
