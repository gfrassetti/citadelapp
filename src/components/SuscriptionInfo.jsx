"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/context/AuthContext";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/db/db";
import UpdatePaymentMethod from "./UpdatePaymentMethod";

const paymentIcons = {
  visa: "/assets/32px-Visa_Inc._logo.svg",
  mastercard: "/assets/32px-Mastercard-logo.svg",
  amex: "/assets/American_Express_logo_(2018).svg",
  default: "/assets/default_cc.svg",
};
import Loader from "@/components/Loader";

const normalizeMethod = (method) => {
  if (!method) return "default";
  const map = {
    visa: "visa",
    "visa inc.": "visa",
    mastercard: "mastercard",
    "master card": "mastercard",
    amex: "amex",
    "american express": "amex",
    account_money: "default",
    credit_card: "default",
  };
  return map[method.toLowerCase()] || "default";
};

async function fetchSubscription(userEmail) {
  const response = await fetch("/api/mercadopago/subscription-info", {
    headers: { "x-user-email": userEmail },
  });

  if (response.status === 404) {
    return { subscription: null };
  }

  if (!response.ok) throw new Error("Error al obtener la suscripción");

  return response.json();
}


async function updatePlanInFirestore(userId, newPlan) {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, { plan: newPlan });
}

async function cancelSubscription(subscriptionId) {
  const response = await fetch(`/api/mercadopago/cancel-subscription`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subscriptionId }),
  });
  if (!response.ok) throw new Error("Error al cancelar la suscripción");
  return response.json();
}

async function pauseSubscription(subscriptionId) {
  const response = await fetch(`/api/mercadopago/pause-subscription`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subscriptionId }),
  });
  if (!response.ok) throw new Error("Error al pausar la suscripción");
  return response.json();
}

async function reactivateSubscription(subscriptionId) {
  const response = await(`/api/mercadopago/reactivate-subscription`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subscriptionId }),
  });
  if (!response.ok) throw new Error("Error al reactivar la suscripción");
  return response.json();
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

  const subscription = data?.subscription;
  const paymentMethod = subscription?.payment_method_id;
  const normalizedPaymentMethod = normalizeMethod(paymentMethod);
  const lastFourDigits = data?.lastFourDigits || "****";

  const mutationCancel = useMutation({
    mutationFn: cancelSubscription,
    onSuccess: () => queryClient.invalidateQueries(["mercadoPagoSubscription"]),
  });

  const mutationPause = useMutation({
    mutationFn: pauseSubscription,
    onSuccess: () => queryClient.invalidateQueries(["mercadoPagoSubscription"]),
  });

  const mutationReactivate = useMutation({
    mutationFn: reactivateSubscription,
    onSuccess: () => queryClient.invalidateQueries(["mercadoPagoSubscription"]),
  });

  if (isLoading) return <Loader text="Cargando Suscripcion..." />
  
  if (isError) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-red-600 font-semibold">Error: {error.message}</p>
    </div>
  );
  
  if (!subscription) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">No tenés una suscripción activa</h2>
        <p className="text-gray-600">Suscribite para desbloquear funciones premium.</p>
      </div>
    </div>
  );
  

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Detalles de Mi Suscripción</h2>
      <Table>
        <TableBody>
          <TableRow><TableCell className="font-semibold">ID</TableCell><TableCell>{subscription.id}</TableCell></TableRow>
          <TableRow><TableCell className="font-semibold">Estado</TableCell><TableCell>{subscription.status}</TableCell></TableRow>
          <TableRow><TableCell className="font-semibold">Razón</TableCell><TableCell>{subscription.reason}</TableCell></TableRow>
          <TableRow><TableCell className="font-semibold">Fecha Alta</TableCell><TableCell>{new Date(subscription.date_created).toLocaleDateString()}</TableCell></TableRow>
          <TableRow><TableCell className="font-semibold">Próximo Pago</TableCell><TableCell>{subscription.next_payment_date ? new Date(subscription.next_payment_date).toLocaleDateString() : "N/A"}</TableCell></TableRow>
          <TableRow><TableCell className="font-semibold">Monto</TableCell><TableCell>{subscription.auto_recurring?.transaction_amount} {subscription.auto_recurring?.currency_id}</TableCell></TableRow>
          <TableRow><TableCell className="font-semibold">Frecuencia</TableCell><TableCell>{subscription.auto_recurring?.frequency} {subscription.auto_recurring?.frequency_type}</TableCell></TableRow>
          <TableRow><TableCell className="font-semibold">Vencimiento</TableCell><TableCell>{subscription.auto_recurring?.end_date ? new Date(subscription.auto_recurring.end_date).toLocaleDateString() : "N/A"}</TableCell></TableRow>
          <TableRow>
            <TableCell className="font-semibold">Método de Pago</TableCell>
            <TableCell className="flex items-center">
              <img
                src={paymentIcons[normalizedPaymentMethod]}
                alt={normalizedPaymentMethod}
                className="w-8 h-8 mr-2"
              />
              Terminada en {lastFourDigits}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div className="mt-4 flex flex-wrap gap-2">
        {subscription.status !== "cancelled" && (
          <>
            <button onClick={() => mutationCancel.mutate(subscription.id)} className="bg-red-600 text-white px-4 py-2 rounded" disabled={isCancelling}>
              Cancelar Suscripción
            </button>

            {subscription.status === "authorized" && (
              <button onClick={() => mutationPause.mutate(subscription.id)} className="bg-yellow-500 text-white px-4 py-2 rounded">
                Pausar
              </button>
            )}

            {subscription.status === "paused" && (
              <button onClick={() => mutationReactivate.mutate(subscription.id)} className="bg-green-600 text-white px-4 py-2 rounded">
                Reactivar
              </button>
            )}
          </>
        )}
      </div>

      <UpdatePaymentMethod />
    </div>
  );
}

