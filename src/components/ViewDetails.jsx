"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { db } from "@/lib/db/db";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import clsx from "clsx";
import { useTheme } from "next-themes";

export default function ViewDetails({ selectedItem, onBack }) {
  const [fullData, setFullData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchDetails = async () => {
      if (!selectedItem?.id || !selectedItem?.type) return;

      setLoading(true);
      try {
        const ref = doc(db, selectedItem.type === "empresa" ? "empresas" : "products", selectedItem.id);
        const snap = await getDoc(ref);
        const data = snap.exists() ? snap.data() : null;

        if (selectedItem.type === "producto" && data?.empresaId) {
          const empresaSnap = await getDoc(doc(db, "empresas", data.empresaId));
          data.empresaData = empresaSnap.exists() ? empresaSnap.data() : null;
        }

        setFullData(data);
      } catch (err) {
        console.error("Error al obtener detalles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [selectedItem]);

  if (loading || !fullData) {
    return <Skeleton className="h-40 w-full" />;
  }

  return (
    <div className="flex flex-col gap-6">
      <button onClick={onBack} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded self-start">Volver</button>

      {selectedItem.type === "empresa" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className={clsx("border p-4 rounded shadow", theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black")}>
            <h2 className="text-2xl font-bold mb-4">{fullData.companyName}</h2>
            <p><strong>Dirección:</strong> {fullData.address || "No disponible"}</p>
            <p><strong>Código Postal:</strong> {fullData.postalCode || "-"}</p>
            <p><strong>Teléfono:</strong> {fullData.phone || "No disponible"}</p>
            <p><strong>Email:</strong> {fullData.email || "No disponible"}</p>
            <p><strong>WhatsApp:</strong> {fullData.whatsapp || "No disponible"}</p>
            <p><strong>CUIT:</strong> {fullData.cuit || "-"}</p>
            <p><strong>Website:</strong> {fullData.website ? <a href={`https://${fullData.website}`} className="text-blue-500 underline">{fullData.website}</a> : "No disponible"}</p>
            {fullData.address && (
              <div className="mt-4">
                <iframe
                  width="100%"
                  height="200"
                  className="rounded"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://www.google.com/maps?q=${encodeURIComponent(fullData.address)}&output=embed`}
                />
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-bold mb-2">Productos</h3>
            <p>No hay productos para esta empresa.</p>
          </div>
        </div>
      ) : (
        <div className={clsx("border p-4 rounded shadow max-w-2xl", theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black")}>
          <h2 className="text-2xl font-bold mb-4">{fullData.productName}</h2>
          {fullData.imageUrl && (
            <img src={fullData.imageUrl} alt={fullData.productName} className="w-full h-64 object-contain mb-4 rounded" />
          )}
          <p><strong>Descripción:</strong> {fullData.description}</p>
          <p className="font-semibold text-green-600 dark:text-green-400">Precio: ${fullData.price}</p>

          {fullData.empresaData && (
            <p className="mt-4 text-blue-600 dark:text-blue-400 font-bold">
              Este producto se vende en: {fullData.empresaData.companyName}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

