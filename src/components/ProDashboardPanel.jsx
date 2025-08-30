"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/db/db";
import { useUserData } from "@/context/UserDataContext";
import { useSubscription } from "@/context/SubscriptionContext";
import BillingPanel from "@/components/BillingPanel";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ProDashboardPanel() {
  const { theme } = useTheme();
  const { empresaId } = useUserData() || {};
  const { subscription, loading } = useSubscription();
  const [products, setProducts] = useState([]);

  const isPaused = !!subscription?.pause_collection;
  const isCanceled = subscription?.status === "canceled";
  const isActive = subscription?.status === "active" && !isPaused;
  const isTrialing = subscription?.status === "trialing" && !isPaused;
  const isPro = (subscription?.status === "active" || subscription?.status === "trialing") && !subscription?.pause_collection;

  useEffect(() => {
    if (!empresaId) return;

    const fetchUserProducts = async () => {
      const q = query(
        collection(db, "products"),
        where("empresaId", "==", empresaId)
      );
      const snap = await getDocs(q);
      const items = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProducts(items);
    };

    fetchUserProducts();
  }, [empresaId]);

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const monthsMap = {
      0: "Ene",
      1: "Feb",
      2: "Mar",
      3: "Abr",
      4: "May",
      5: "Jun",
      6: "Jul",
      7: "Ago",
      8: "Sep",
      9: "Oct",
      10: "Nov",
      11: "Dic",
    };

    const countByMonth = {};

    products.forEach((p) => {
      if (p.createdAt?.toDate) {
        const date = p.createdAt.toDate();
        const month = date.getMonth();
        const label = monthsMap[month];
        countByMonth[label] = (countByMonth[label] || 0) + 1;
      }
    });

    const formatted = Object.keys(monthsMap).map((i) => {
      const label = monthsMap[i];
      return {
        name: label,
        total: countByMonth[label] || 0,
      };
    });

    setChartData(formatted);
  }, [products]);

  const isDark = theme === "dark";

  const isNewProduct = (createdAt) => {
    if (!createdAt || !createdAt.toDate) return false;
    const now = new Date();
    const diff = now - createdAt.toDate();
    return diff < 7 * 24 * 60 * 60 * 1000;
  };

  const subscriptionStatus = subscription?.status ?? "-";
  const nextBilling =
    (subscription?.status === "active" || subscription?.status === "trialing") &&
    subscription?.current_period_end
      ? new Date(subscription.current_period_end * 1000).toLocaleDateString("es-AR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : null;

  return (
    <div className="w-full px-4 md:px-8 py-6 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Bienvenido a tu cuenta{" "}
          {isPro && <Badge variant="secondary">PRO</Badge>}
        </h2>
      </div>

      <Separator />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total de productos</CardTitle>
            <CardDescription>Subidos por ti</CardDescription>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold">{products.length}</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Suscripción</CardTitle>
            <CardDescription>Estado actual</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="default">{subscriptionStatus}</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Publicado</CardTitle>
            <CardDescription>Visible al público</CardDescription>
          </CardHeader>
          <CardContent>
            <span className="text-xl font-semibold">
              +{products.length} productos
            </span>
          </CardContent>
        </Card>

        {isPaused && (
          <Card>
            <CardHeader>
              <CardTitle>Suscripción pausada</CardTitle>
              <CardDescription>Tu suscripción fue pausada</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc ml-4 text-sm space-y-1">
                <li>La suscripción sigue existiendo y vigente.</li>
                <li>Stripe no cobra al usuario mientras está pausada.</li>
                <li>Podés reanudarla en cualquier momento.</li>
                <li>No se pierde historial, ni datos de pago.</li>
              </ul>
            </CardContent>
          </Card>
        )}

        {isCanceled && (
          <Card>
            <CardHeader>
              <CardTitle>Suscripción cancelada</CardTitle>
              <CardDescription>Tu suscripción está cancelada</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc ml-4 text-sm space-y-1">
                <li>Seguís teniendo acceso hasta el final del ciclo actual.</li>
                <li>Después de eso, la suscripción termina definitivamente.</li>
                <li>No se puede reanudar automáticamente.</li>
                <li>Debés crear una nueva si querés volver a PRO.</li>
              </ul>
            </CardContent>
          </Card>
        )}

        {nextBilling && (
          <Card>
            <CardHeader>
              <CardTitle>Próximo cobro</CardTitle>
              <CardDescription>Fecha de renovación automática</CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-sm">{nextBilling}</span>
            </CardContent>
          </Card>
        )}
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-bold mb-16">Actividad mensual</h3>
        <ChartContainer
          className="mx-auto w-3/4 aspect-[3/1]"
          config={{
            total: {
              label: "Total",
              color: isDark ? "#60a5fa" : "#8038e9",
            },
          }}
        >
          <BarChart data={chartData}>
            <XAxis dataKey="name" stroke="#888888" fontSize={12} />
            <YAxis stroke="#888888" fontSize={12} />
            <Tooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="total"
              fill="var(--color-total)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-bold mb-4">
          Productos agregados recientemente
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card key={product.id} className="relative">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {product.productName}
                  {isNewProduct(product.createdAt) && (
                    <Badge variant="destructive">Nuevo</Badge>
                  )}
                </CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-green-600 font-semibold">${product.price}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Separator />
      <div>
        <BillingPanel />
      </div>
    </div>
  );
}

