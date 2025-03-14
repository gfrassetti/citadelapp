"use client";

import { useQuery } from "@tanstack/react-query";
import { useUserData } from "@/context/UserDataContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

async function fetchSubscription(userEmail) {
  const response = await fetch("/api/mercadopago/subscription", {
    headers: { "x-user-email": userEmail },
  });

  if (!response.ok) {
    throw new Error("Error al obtener la suscripción");
  }

  return response.json();
}

export default function SuscriptionInfo() {
  const userData = useUserData();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["mercadoPagoSubscription", userData.email],
    queryFn: () => fetchSubscription(userData.email),
    enabled: !!userData.email,
  });

  if (isLoading) return <p>Cargando suscripción...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  const subscription = data?.subscription;

  if (!subscription) return <p>No hay suscripción activa.</p>;

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
            <TableCell>{new Date(subscription.next_payment_date).toLocaleDateString()}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold">Monto</TableCell>
            <TableCell>{subscription.auto_recurring.transaction_amount} {subscription.auto_recurring.currency_id}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold">Frecuencia</TableCell>
            <TableCell>
              {subscription.auto_recurring.frequency} {subscription.auto_recurring.frequency_type}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold">Vencimiento</TableCell>
            <TableCell>{new Date(subscription.auto_recurring.end_date).toLocaleDateString()}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}