"use client";

import { useSubscription } from "@/context/SubscriptionContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function BillingPanel() {
  const { subscription, customer } = useSubscription();

  if (!subscription) {
    return (
      <div className="text-sm text-muted-foreground">
        No active subscription found.
      </div>
    );
  }

  const status = subscription.status;
  const isCanceled = status === "canceled";
  const currentPeriodEndMs = subscription.current_period_end * 1000;
  const isExpired = isCanceled && currentPeriodEndMs < Date.now();

  const nextBilling = !isExpired && subscription.current_period_end
    ? new Date(currentPeriodEndMs).toLocaleDateString("es-AR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "-";

  const cancelAtPeriodEnd = subscription.cancel_at_period_end;
  const plan = subscription.items[0]?.price?.nickname ||
               subscription.items[0]?.price?.product?.name ||
               "Plan name not available";

  const method = subscription.default_payment_method;
  const cardInfo = method?.card
    ? `${method.card.brand.toUpperCase()} •••• ${method.card.last4}`
    : "No payment method";

  // Renovación lógica y mensajes
  let renewal;
  if (isCanceled) {
    renewal = isExpired
      ? "Suscripción terminada"
      : "Cancelada, válido hasta el " + nextBilling;
  } else if (cancelAtPeriodEnd) {
    renewal = "Cancelada, válido hasta el " + nextBilling;
  } else {
    renewal = "Renovación automática activada";
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing Details</CardTitle>
        <CardDescription>Stripe subscription info</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 text-sm">
        <div className="flex justify-between">
          <span>Status</span>
          <Badge variant={isCanceled ? "destructive" : "outline"}>{status}</Badge>
        </div>
        <Separator />
        <div className="flex justify-between">
          <span>Plan</span>
          <span>{plan}</span>
        </div>
        <div className="flex justify-between">
          <span>Next billing</span>
          <span>{isExpired ? "-" : nextBilling}</span>
        </div>
        <div className="flex justify-between">
          <span>Renewal</span>
          <span>{renewal}</span>
        </div>
        <Separator />
        <div className="flex justify-between">
          <span>Payment method</span>
          <span>{cardInfo}</span>
        </div>
        <div className="flex justify-between">
          <span>Customer email</span>
          <span>{customer?.email || "-"}</span>
        </div>
      </CardContent>
    </Card>
  );
}
