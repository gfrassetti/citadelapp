"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/lib/db/db"
import Link from "next/link"

export default function CompanyPage() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id")
  const router = useRouter()
  const [empresa, setEmpresa] = useState(null)
  const [productos, setProductos] = useState([])

  useEffect(() => {
    if (!id) return

    const fetchEmpresa = async () => {
      const ref = doc(db, "empresas", id)
      const snap = await getDoc(ref)
      if (snap.exists()) {
        setEmpresa({ id: snap.id, ...snap.data() })
      }
    }

    const fetchProductos = async () => {
      const q = query(collection(db, "products"), where("empresaId", "==", id))
      const snap = await getDocs(q)
      const list = []
      snap.forEach((doc) => list.push({ id: doc.id, ...doc.data() }))
      setProductos(list)
    }

    fetchEmpresa()
    fetchProductos()
  }, [id])

  if (!empresa) return <p className="text-center mt-10">Cargando empresa...</p>

  return (
    <div className="max-w-7xl mx-auto p-6">
      <button onClick={() => router.back()} className="mb-4 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm">
        Volver
      </button>

      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 space-y-2 col-span-1 border">
          <h2 className="text-lg font-bold">{empresa.companyName || "Empresa sin nombre"}</h2>
          <p><span className="font-semibold">Dirección:</span> {empresa.address || "-"}</p>
          <p><span className="font-semibold">Código Postal:</span> {empresa.postalCode || "-"}</p>
          <p><span className="font-semibold">Teléfono:</span> {empresa.phone || "-"}</p>
          <p><span className="font-semibold">Email:</span> {empresa.email || "-"}</p>
          <p><span className="font-semibold">WhatsApp:</span> {empresa.whatsapp || "-"}</p>
          <p><span className="font-semibold">CUIT:</span> {empresa.cuit || "-"}</p>
          <p><span className="font-semibold">Website:</span> {empresa.website
            ? <a href={`https://${empresa.website}`} target="_blank" className="text-blue-600 underline">{empresa.website}</a>
            : "-"}</p>
        </div>

        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Productos</h2>
          {productos.length === 0 ? (
            <p className="text-gray-500 italic">No hay productos asociados a esta empresa.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {productos.map((prod) => (
                <Link
                  key={prod.id}
                  href={`/product?id=${prod.id}`}
                  className="border rounded p-4 bg-white shadow-sm hover:shadow-md transition-shadow block"
                >
                  <h3 className="font-bold">{prod.productName}</h3>
                  {prod.imageUrl && <img src={prod.imageUrl} alt={prod.productName} className="h-32 object-contain my-2" />}
                  <p className="text-sm text-gray-700">{prod.description}</p>
                  <p className="font-semibold text-green-600 mt-2">${prod.price}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
