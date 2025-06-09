"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/lib/db/db";
import { useUserData } from "@/context/UserDataContext";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";



import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";




export function ProDashboardPanel() {
  const { theme } = useTheme();
  const { empresaId, email } = useUserData() || {};
  const [products, setProducts] = useState([]);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [nextBilling, setNextBilling] = useState(null);

  useEffect(() => {
    if (!empresaId) return;

    const fetchUserProducts = async () => {
      const q = query(collection(db, "products"), where("empresaId", "==", empresaId));
      const snap = await getDocs(q);
      const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(items);
    };

    fetchUserProducts();
  }, [empresaId]);

  useEffect(() => {
    if (!email) return;

    const fetchSubscription = async () => {
      const res = await fetch("/api/mercadopago/subscription-info", {
        headers: { "x-user-email": email },
      });

      if (res.ok) {
        const data = await res.json();
        const status = data?.subscription?.status;
        setSubscriptionStatus(status === "authorized" ? "active" : status || null);
        setNextBilling(data?.subscription?.next_payment_date || null);
      }
    };

    fetchSubscription();
  }, [email]);

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const monthsMap = {
      0: "Jan", 1: "Feb", 2: "Mar", 3: "Apr", 4: "May", 5: "Jun",
      6: "Jul", 7: "Aug", 8: "Sep", 9: "Oct", 10: "Nov", 11: "Dec",
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
    return diff < 7 * 24 * 60 * 60 * 1000; // 7 days
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Welcome to your <Badge variant="secondary">PRO</Badge> account
        </h2>
      </div>

      <Separator />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Products</CardTitle>
            <CardDescription>Uploaded by you</CardDescription>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold">{products.length}</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
            <CardDescription>Current status</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="default">{subscriptionStatus || "-"}</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Published</CardTitle>
            <CardDescription>Visible to the public</CardDescription>
          </CardHeader>
          <CardContent>
            <span className="text-xl font-semibold">+{products.length} items</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next Billing</CardTitle>
            <CardDescription>Auto-renewal date</CardDescription>
          </CardHeader>
          <CardContent>
            <span className="text-sm">
              {nextBilling ? new Date(nextBilling).toLocaleDateString() : "-"}
            </span>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-bold mb-4">Monthly activity</h3>
        <ChartContainer
          className="w-full aspect-[2/1]"
          config={{
            total: {
              label: "Total",
              color: isDark ? "#60a5fa" : "#2563eb",
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
        <h3 className="text-lg font-bold mb-4">Recently added products</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card key={product.id} className="relative">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {product.productName}
                  {isNewProduct(product.createdAt) && (
                    <Badge variant="destructive">New</Badge>
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
    </div>
  );
}
