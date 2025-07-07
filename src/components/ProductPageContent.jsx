"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "@/lib/db/db";
import { doc, getDoc } from "firebase/firestore";
import Loader from "@/components/Loader";
import Link from "next/link";

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
        <div className="max-w-3xl mx-auto p-6 mt-[6rem]">
        <Link
          href={`/?query=${searchParams.get("query") || ""}&filter=${searchParams.get("filter") || "all"}`}
          className="text-sm"
        >
          <button className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded text-sm border border-gray-300">
            ← Volver al inicio
          </button>
        </Link>
      <div className="border p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">{product.productName}</h1>

        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.productName}
            className="w-full max-h-64 object-contain mb-4"
          />
        )}

        <p>
          <strong className="text-black">Descripción:</strong> {product.description}
        </p>

        <p className="text-green-600 font-semibold">
          Precio: ${product.price}
        </p>

        {company && (
          <p className="mt-4 font-semibold text-blue-700">
            Este producto se vende en:{" "}
            <a
              href={`/company?id=${company.id}`}
              className="underline"
            >
              {company.companyName}
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
