"use client";

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function UpdatePaymentMethod() {
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiration, setCardExpiration] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [identificationType, setIdentificationType] = useState("DNI");
  const [identificationNumber, setIdentificationNumber] = useState("");
  const [mercadoPago, setMercadoPago] = useState(null);

  useEffect(() => {
    if (window.MercadoPago) {
      const mp = new window.MercadoPago("TU_PUBLIC_KEY", { locale: "es-AR" });
      setMercadoPago(mp);
    }
  }, []);

  const createCardToken = async () => {
    return new Promise((resolve, reject) => {
      if (!mercadoPago) return reject("MercadoPago no está inicializado");

      mercadoPago.createCardToken(
        {
          cardNumber,
          expirationMonth: cardExpiration.split("/")[0],
          expirationYear: "20" + cardExpiration.split("/")[1],
          securityCode: cardCVV,
          cardholderName: cardHolderName,
          identificationType,
          identificationNumber,
        },
        (status, response) => {
          if (status !== 200 && status !== 201) {
            reject(response);
          } else {
            resolve(response.id); // Aquí obtenemos el card_token_id
          }
        }
      );
    });
  };

  const handleUpdatePayment = async () => {
    try {
      const cardTokenId = await createCardToken();

      const response = await fetch(`/api/mercadopago/update-payment-method`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId: "ID_DE_LA_SUSCRIPCIÓN", cardTokenId }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el método de pago");
      }

      alert("Método de pago actualizado correctamente.");
    } catch (error) {
      console.error("Error al actualizar el método de pago:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Actualizar Método de Pago</h2>
      
      <input
        type="text"
        placeholder="Nombre del titular"
        value={cardHolderName}
        onChange={(e) => setCardHolderName(e.target.value)}
        className="border p-2 mb-2 w-full"
      />
      
      <input
        type="text"
        placeholder="Número de tarjeta"
        value={cardNumber}
        onChange={(e) => setCardNumber(e.target.value)}
        className="border p-2 mb-2 w-full"
      />
      
      <input
        type="text"
        placeholder="MM/YY"
        value={cardExpiration}
        onChange={(e) => setCardExpiration(e.target.value)}
        className="border p-2 mb-2 w-full"
      />
      
      <input
        type="text"
        placeholder="CVV"
        value={cardCVV}
        onChange={(e) => setCardCVV(e.target.value)}
        className="border p-2 mb-2 w-full"
      />
      
      <input
        type="text"
        placeholder="DNI del titular"
        value={identificationNumber}
        onChange={(e) => setIdentificationNumber(e.target.value)}
        className="border p-2 mb-2 w-full"
      />
      
      <button
        onClick={handleUpdatePayment}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Actualizar Método de Pago
      </button>
    </div>
  );
}
