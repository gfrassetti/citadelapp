"use client";
import { useSubscription } from "@/context/SubscriptionContext";
import { useInvoices } from "@/hooks/useInvoices"; // Suponiendo que tengas este hook
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function Billing() {
  const { subscription, customer } = useSubscription();
  const { invoices, loading } = useInvoices(); // Asume que devuelve un array de facturas Stripe

  if (!subscription) return <div className="text-muted-foreground">No hay suscripción activa.</div>;

  const price = subscription.items[0]?.price;
    const plan = price?.nickname || price?.product?.name || "Plan desconocido";
  const status = subscription.status;
  const nextBilling = subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000).toLocaleDateString("es-AR")
    : "-";
  const cardInfo = subscription.default_payment_method?.card
    ? `${subscription.default_payment_method.card.brand.toUpperCase()} •••• ${subscription.default_payment_method.card.last4}`
    : "No payment method";
  const amount = subscription.items[0]?.price?.unit_amount 
    ? (subscription.items[0].price.unit_amount / 100).toLocaleString("es-AR", { style: "currency", currency: "USD" })
    : "-";

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Facturación actual</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between"><span>Estado</span><Badge>{status}</Badge></div>
          <div className="flex justify-between"><span>Plan</span><span>{plan}</span></div>
          <div className="flex justify-between"><span>Monto</span><span>{amount}</span></div>
          <div className="flex justify-between"><span>Próxima factura</span><span>{nextBilling}</span></div>
          <div className="flex justify-between"><span>Método de pago</span><span>{cardInfo}</span></div>
          <div className="flex justify-between"><span>Email cliente</span><span>{customer?.email || "-"}</span></div>
          <Separator />
          {invoices?.[0]?.hosted_invoice_url && (
            <a
              href={invoices[0].hosted_invoice_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm mt-3 bg-blue-600 text-white px-3 py-2 rounded"
            >
              Ver/descargar factura actual
            </a>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historial de facturas</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-sm text-gray-400">Cargando facturas...</div>
          ) : invoices?.length > 0 ? (
            <ul className="space-y-3">
              {invoices.map((inv) => (
                <li key={inv.id} className="flex justify-between items-center border-b pb-2">
                  <span>
                    {new Date(inv.created * 1000).toLocaleDateString("es-AR")}{" "}
                    ({(inv.amount_paid / 100).toLocaleString("es-AR", { style: "currency", currency: "USD" })})
                  </span>
                  <span className="flex gap-3">
                    <a
                      href={inv.hosted_invoice_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline text-xs"
                    >
                      Ver online
                    </a>
                    {inv.invoice_pdf && (
                      <a
                        href={inv.invoice_pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 underline text-xs"
                      >
                        Descargar PDF
                      </a>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-400 text-sm">No hay facturas anteriores.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
