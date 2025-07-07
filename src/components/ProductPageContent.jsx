"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "@/lib/db/db";
import { doc, getDoc } from "firebase/firestore";
import Loader from "@/components/Loader";
import Link from "next/link";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ProductPageContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [product, setProduct] = useState(null);
  const [company, setCompany] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchProductAndCompany = async () => {
      const productRef = doc(db, "products", id);
      const productSnap = await getDoc(productRef);
      if (!productSnap.exists()) return;

      const prodData = { id: productSnap.id, ...productSnap.data() };
      setProduct(prodData);

      if (prodData.empresaId) {
        const companyRef = doc(db, "empresas", prodData.empresaId);
        const companySnap = await getDoc(companyRef);
        if (companySnap.exists()) {
          setCompany({ id: companySnap.id, ...companySnap.data() });
        }
      }
    };

    fetchProductAndCompany();
  }, [id]);

  if (!product) {
    return <Loader text="Cargando producto..." />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 mt-24">
      <Link
        href={`/?query=${searchParams.get("query") || ""}&filter=${searchParams.get("filter") || "all"}`}
      >
        <Button variant="outline" className="mb-6">
          ← Volver al inicio
        </Button>
      </Link>

      <Card className="shadow-lg border border-muted">
        <CardHeader>
          <h1 className="text-3xl font-bold">{product.productName}</h1>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.productName}
              className="w-full max-h-72 object-contain rounded"
            />
          ) : (
            <div className="w-full h-72 bg-gray-100 flex items-center justify-center rounded text-gray-500">
              Sin imagen
            </div>
          )}

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Descripción:</strong>{" "}
              {product.description}
            </p>

            <div className="flex items-center gap-2">
              <Badge variant="outline">Orden mínima: {product.minOrder || "1 unidad"}</Badge>
              <Badge className="bg-green-100 text-green-700 border-green-300">
                Precio: ${product.price}
              </Badge>
            </div>

            {company && (
              <div className="text-sm text-muted-foreground mt-4">
                <span className="text-foreground font-medium">
                  Este producto se vende en:{" "}
                </span>
                <Link
                  href={`/company?id=${company.id}`}
                  className="underline text-blue-600 hover:text-blue-800"
                >
                  {company.companyName}
                </Link>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="mt-6">
          {/* futuro CTA o contacto */}
        </CardFooter>
      </Card>
    </div>
  );
}
