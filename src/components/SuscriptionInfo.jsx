"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/context/AuthContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/db/db";
import UpdatePaymentMethod from "./UpdatePaymentMethod";

// Mapeo de logos para los métodos de pago
const paymentIcons = {
  visa: "/assets/visa-4.svg",
  mastercard: "/assets/mastercard-4.svg",
  amex: "/assets/american-express-1.svg",
};

async function fetchSubscription(userEmail) {
  const response = await fetch("/api/mercadopago/subscription-info", {
    headers: { "x-user-email": userEmail },
  });

  if (!response.ok) {
    throw new Error("Error al obtener la suscripción");
  }

  return response.json();
}

async function cancelSubscription(subscriptionId) {
  const response = await fetch(`/api/mercadopago/cancel-subscription`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subscriptionId }),
  });

  if (!response.ok) {
    throw new Error("Error al cancelar la suscripción");
  }

  return response.json();
}

async function updatePaymentMethod(subscriptionId, cardTokenId) {
  const response = await fetch(`/api/mercadopago/update-payment-method`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subscriptionId, cardTokenId }),
  });

  if (!response.ok) {
    throw new Error("Error al actualizar el método de pago");
  }

  return response.json();
}

async function updatePlanInFirestore(userId, newPlan) {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, { plan: newPlan });
}

export default function SubscriptionInfo() {
  const { user, updateUserPlan } = useUser();
  const queryClient = useQueryClient();
  const [isCancelling, setIsCancelling] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["mercadoPagoSubscription", user.email],
    queryFn: () => fetchSubscription(user.email),
    enabled: !!user.email,
  });

  const mutationCancel = useMutation({
    mutationFn: cancelSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries(["mercadoPagoSubscription"]);
    },
  });

  useEffect(() => {
    if (!user || !data?.subscription) return;
  
    const subscription = data.subscription;
  
    // 🔹 Si la suscripción ya expiró y aún no se ha cancelado en Firestore, actualizar el plan
    if (data.isExpired && subscription.status !== "cancelled") {
      console.log("⏳ Suscripción vencida. Actualizando Firestore...");
  
      updatePlanInFirestore(user.uid, "free").then(() => {
        updateUserPlan("free");
        queryClient.invalidateQueries(["mercadoPagoSubscription"]); // 🔹 Forzar actualización de datos en el frontend
      });
    }
  }, [user, data]);
  

  if (isLoading) return <p>Cargando suscripción...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  const subscription = data?.subscription;
  if (!subscription) return <p>No hay suscripción activa.</p>;

  const handleCancel = async () => {
    setIsCancelling(true);
    try {
      await mutationCancel.mutateAsync(subscription.id);
    } catch (error) {
      console.error("Error al cancelar la suscripción:", error);
    }
    setIsCancelling(false);
  };

  // Normalizar el método de pago para que coincida con los keys de paymentIcons
  const normalizedPaymentMethod = (data?.paymentMethod || "default").toLowerCase();
  const lastFourDigits = data?.lastFourDigits || "****";

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Detalles de Mi Suscripción</h2>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-semibold">ID</TableCell>
            <TableCell>{subscription.id}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold">Estado</TableCell>
            <TableCell>{subscription.status}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold">Razón</TableCell>
            <TableCell>{subscription.reason}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold">Fecha Alta</TableCell>
            <TableCell>{new Date(subscription.date_created).toLocaleDateString()}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold">Próximo Pago</TableCell>
            <TableCell>
              {subscription.next_payment_date
                ? new Date(subscription.next_payment_date).toLocaleDateString()
                : "N/A"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold">Monto</TableCell>
            <TableCell>
              {subscription.auto_recurring?.transaction_amount} {subscription.auto_recurring?.currency_id}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold">Frecuencia</TableCell>
            <TableCell>
              {subscription.auto_recurring?.frequency} {subscription.auto_recurring?.frequency_type}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold">Vencimiento</TableCell>
            <TableCell>
              {subscription.auto_recurring?.end_date
                ? new Date(subscription.auto_recurring.end_date).toLocaleDateString()
                : "N/A"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold">Método de Pago</TableCell>
            <TableCell className="flex items-center">
            <img 
                src={paymentIcons[normalizedPaymentMethod] || paymentIcons.default} 
                alt={normalizedPaymentMethod} 
                className="w-8 h-8 mr-2" 
              />
              Terminada en {lastFourDigits}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div className="mt-4">
        {subscription.status !== "cancelled" ? (
          <button
            onClick={handleCancel}
            className="bg-red-600 text-white px-4 py-2 rounded"
            disabled={isCancelling}
          >
            {isCancelling ? "Cancelando..." : "Cancelar Suscripción"}
          </button>
        ) : (
          <p className="text-gray-600">Esta suscripción ya está cancelada.</p>
        )}
      </div>

      <UpdatePaymentMethod />
    </div>
  );
}
