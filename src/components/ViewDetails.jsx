"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/db/db";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function ViewDetails({ selectedItem, onBack }) {
  const [itemData, setItemData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      if (!selectedItem?.id || !selectedItem?.type) return;

      setLoading(true);
      try {
        const collection = selectedItem.type === "producto" ? "products" : "empresas";
        const ref = doc(db, collection, selectedItem.id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setItemData({ ...snap.data(), type: selectedItem.type });
        } else {
          console.warn("No existe el documento");
        }
      } catch (err) {
        console.error("Error obteniendo datos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [selectedItem]);

  if (loading) return <Skeleton className="w-full h-40" />;
  if (!itemData) return <p className="text-center text-red-600">No se pudo cargar la información.</p>;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Button onClick={onBack} className="mb-4">
        Volver
      </Button>

      {itemData.type === "producto" ? (
        <div>
          <h2 className="text-2xl font-bold mb-2">{itemData.productName}</h2>
          {itemData.imageUrl && (
            <img
              src={itemData.imageUrl}
              alt={itemData.productName}
              className="h-48 object-contain mb-2"
            />
          )}
          <p>{itemData.description}</p>
          <p className="font-semibold mt-2">Precio: ${itemData.price}</p>
        </div>
      ) : (
        <div className="border p-4 rounded shadow">
          <div className="flex items-center mb-4">
            <Avatar className="h-12 w-12 mr-4">
              <AvatarImage src={itemData.imageUrl} />
              <AvatarFallback>EM</AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-bold">{itemData.companyName}</h3>
          </div>
          <p>{itemData.address || "Dirección no disponible"}</p>
          <p>Tel: {itemData.phone || "No disponible"}</p>
          <p>WhatsApp: {itemData.whatsapp || "No disponible"}</p>
          <p>Email: {itemData.email || "No disponible"}</p>
          {itemData.website && (
            <p>
              Website:{" "}
              <a
                href={`https://${itemData.website}`}
                className="text-blue-500 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {itemData.website}
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
