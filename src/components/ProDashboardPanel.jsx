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
import { Chart, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export function ProDashboardPanel() {
  const { theme } = useTheme();
  const { empresaId } = useUserData() || {};
  const [products, setProducts] = useState([]);

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

  const chartData = [
    { name: "Jan", total: 20 },
    { name: "Feb", total: 45 },
    { name: "Mar", total: 30 },
    { name: "Apr", total: 50 },
    { name: "May", total: 25 },
    { name: "Jun", total: 40 },
  ];

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
            <Badge variant="default">Active</Badge>
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
            <span className="text-sm">07/06/2025</span>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-bold mb-4">Monthly activity</h3>
        <ChartTooltip content={<ChartTooltipContent />}>
          <Chart
            className="w-full aspect-[2/1]"
            data={chartData}
            index="name"
            categories={["total"]}
            colors={[isDark ? "blue-400" : "blue-600"]}
            showLegend={false}
          />
        </ChartTooltip>
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
