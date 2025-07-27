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
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";


const paymentIcons = {
  visa: "/assets/visa-4.svg",
  mastercard: "/assets/mastercard-4.svg",
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

  /* if (isLoading) return <Loader text="Cargando Suscripción..." />; */

  if (isError)
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-600 font-semibold">Error: {error.message}</p>
      </div>
    );

    if (!subscription || subscription.status === "canceled") {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-center gap-4">
          <p className="text-gray-700 text-lg dark:text-gray-200">
            No tenés una suscripción activa.
          </p>
          <Button
            onClick={() => handleUpgrade.mutate()}
            className="bg-accent-blue hover:bg-primary-dark text-white font-semibold px-6 py-2 rounded"
            disabled={handleUpgrade.isPending}
          >
            {handleUpgrade.isPending ? (
              <>
                <Loader2Icon className="animate-spin mr-2 h-4 w-4" />
                Procesando...
              </>
            ) : (
              "Actualizar a PRO"
            )}
          </Button>
        </div>
      );
    }
    
    

  const card = subscription?.default_payment_method?.card;
  const normalized = normalizeMethod(card?.brand);
  const isPaused = !!subscription?.pause_collection;

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
            <TableCell>{isPaused ? "paused" : subscription.status}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold">Monto</TableCell>
            <TableCell>
              {new Intl.NumberFormat("es-AR", {
                style: "currency",
                currency: subscription.currency?.toUpperCase() || "USD",
              }).format((subscription.items?.[0]?.price?.unit_amount || 0) / 100
            )}
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
                src={paymentIcons[normalized] || paymentIcons.default}
                alt={normalized}
                className="w-8 h-8 mr-2"
              />
              Terminada en {card?.last4 || "****"}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div className="mt-4 flex flex-wrap gap-2">
        {subscription.status === "active" && !isPaused && (
          <button
            onClick={() => mutationPause.mutate(subscription.id)}
            className="bg-yellow-500 hover:bg-violet-500 transition-colors text-white px-4 py-2 rounded"
          >
            Pausar Suscripción
          </button>
        )}

        {isPaused && (
          <button
            onClick={() => mutationReactivate.mutate(subscription.id)}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Reactivar Suscripción
          </button>
        )}

{subscription.status !== "canceled" && (
  <button
    onClick={() =>
      mutationCancel.mutate(subscription.id, {
        onSuccess: () => {
          toast.success("Suscripción cancelada correctamente");
        },
        onError: () => {
          toast.error("Error al cancelar suscripción");
        },
      })
    }
    disabled={mutationCancel.isPending}
    className="btn-secondary flex items-center justify-center gap-2 px-4 py-2 rounded"
  >
    {mutationCancel.isPending ? (
      <>
        <Loader2Icon className="animate-spin w-4 h-4" />
        Cancelando...
      </>
    ) : (
      "Cancelar Suscripción"
    )}
  </button>
)}
      </div>

      <UpdatePaymentMethod />
    </div>
  );
}
