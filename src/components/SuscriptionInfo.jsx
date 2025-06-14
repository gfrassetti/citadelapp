"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/context/AuthContext";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import Loader from "@/components/Loader";
import UpdatePaymentMethod from "@/components/UpdatePaymentMethod";

const paymentIcons = {
  visa: "/assets/32px-Visa_Inc._logo.svg",
  mastercard: "/assets/32px-Mastercard-logo.svg",
  amex: "/assets/American_Express_logo_(2018).svg",
  default: "/assets/default_cc.svg",
};

const normalizeMethod = (brand) => {
  if (!brand) return "default";
  const map = {
    visa: "visa",
    mastercard: "mastercard",
    amex: "amex",
  };
  return map[brand.toLowerCase()] || "default";
};

async function fetchStripeSubscription(uid) {
  const res = await fetch("/api/stripe/subscription-info", {
    headers: { "x-user-id": uid },
  });

  if (res.status === 404) return { subscription: null };

  if (!res.ok) throw new Error("Error al obtener la suscripción");

  return res.json();
}

async function cancelStripeSubscription(subscriptionId) {
  const res = await fetch("/api/stripe/cancel-subscription", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subscriptionId }),
  });
  if (!res.ok) throw new Error("Error al cancelar la suscripción");
  return res.json();
}

async function pauseStripeSubscription(subscriptionId) {
  const res = await fetch("/api/stripe/pause-subscription", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subscriptionId }),
  });
  if (!res.ok) throw new Error("Error al pausar la suscripción");
  return res.json();
}

async function reactivateStripeSubscription(subscriptionId) {
  const res = await fetch("/api/stripe/reactivate-subscription", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subscriptionId }),
  });
  if (!res.ok) throw new Error("Error al reactivar la suscripción");
  return res.json();
}

export default function SubscriptionInfo() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [isCancelling, setIsCancelling] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["stripeSubscription", user.uid],
    queryFn: () => fetchStripeSubscription(user.uid),
    enabled: !!user?.uid,
  });

  const mutationCancel = useMutation({
    mutationFn: cancelStripeSubscription,
    onSuccess: () => queryClient.invalidateQueries(["stripeSubscription"]),
  });

  const mutationPause = useMutation({
    mutationFn: pauseStripeSubscription,
    onSuccess: () => queryClient.invalidateQueries(["stripeSubscription"]),
  });

  const mutationReactivate = useMutation({
    mutationFn: reactivateStripeSubscription,
    onSuccess: () => queryClient.invalidateQueries(["stripeSubscription"]),
  });

  const subscription = data?.subscription;
  const customer = data?.customer;
  if (!subscription) return <Loader text="Cargando Suscripción..." />;

  const card = subscription?.default_payment_method?.card;
  const normalized = normalizeMethod(card?.brand);
  const isPaused = !subscription?.pause_collection;
  

  if (isLoading) return <Loader text="Cargando Suscripción..." />;

  if (isError)
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-600 font-semibold">Error: {error.message}</p>
      </div>
    );

  if (!subscription)
    return (
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
          <TableRow>
            <TableCell className="font-semibold">ID</TableCell>
            <TableCell>{subscription.id}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold">Estado</TableCell>
            <TableCell>{subscription.status}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold">Monto</TableCell>
            <TableCell>
              {new Intl.NumberFormat("es-AR", {
                style: "currency",
                currency: subscription.currency?.toUpperCase() || "USD",
              }).format((subscription.plan?.amount || 0) / 100)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold">Renovación</TableCell>
            <TableCell>
              {new Date(subscription.current_period_end * 1000).toLocaleDateString()}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold">Método de Pago</TableCell>
            <TableCell className="flex items-center">
              <img
                src={paymentIcons[normalized]}
                alt={normalized}
                className="w-8 h-8 mr-2"
              />
              Terminada en {card?.last4 || "****"}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div className="mt-4 flex flex-wrap gap-2">
      {subscription.status === "active" && (
        <button
          onClick={() => mutationPause.mutate(subscription.id)}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Pausar Suscripción
        </button>
      )}

      {subscription.status === "paused" && (
        <button
          onClick={() => mutationReactivate.mutate(subscription.id)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Reactivar Suscripción
        </button>
      )}

      {subscription.status !== "cancelled" && (
        <button
          onClick={() => mutationCancel.mutate(subscription.id)}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Cancelar Suscripción
        </button>
      )}
      </div>
      <UpdatePaymentMethod />
    </div>
  );
}
