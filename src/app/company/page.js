// app/empresa/page.jsx
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/db/db";

export default function EmpresaPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [empresa, setEmpresa] = useState(null);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    if (!id) return;
    const fetchEmpresa = async () => {
      const ref = doc(db, "empresas", id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setEmpresa({ id: snap.id, ...snap.data() });
      }
    };

    const fetchProductos = async () => {
      const q = query(collection(db, "products"), where("empresaId", "==", id));
      const snap = await getDocs(q);
      const list = [];
      snap.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
      setProductos(list);
    };

    fetchEmpresa();
    fetchProductos();
  }, [id]);

  if (!empresa) return <p className="text-center mt-10">Cargando empresa...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{empresa.companyName}</h1>
      <p>Dirección: {empresa.address || "-"}</p>
      <p>Teléfono: {empresa.phone || "-"}</p>
      <p>Email: {empresa.email || "-"}</p>
      <p>WhatsApp: {empresa.whatsapp || "-"}</p>
      <p>CUIT: {empresa.cuit || "-"}</p>
      <p>Website: {empresa.website || "-"}</p>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Productos</h2>
        {productos.length === 0 ? (
          <p>No hay productos para esta empresa.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {productos.map((prod) => (
              <div key={prod.id} className="border rounded p-4">
                <h3 className="font-bold">{prod.productName}</h3>
                {prod.imageUrl && (
                  <img src={prod.imageUrl} alt={prod.productName} className="h-32 object-contain my-2" />
                )}
                <p>{prod.description}</p>
                <p className="font-semibold">Precio: ${prod.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
