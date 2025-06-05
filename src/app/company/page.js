"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/lib/db/db"
import RelatedProductsGrid from "@/components/RelatedProductsGrid"

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

      <div className="flex flex-col md:flex-row gap-6">
        {/* Info Empresa */}
        <div className="md:w-1/3 border rounded-lg p-4 shadow">
          <h2 className="text-xl font-bold mb-2">{empresa.companyName || "Mi Empresa"}</h2>
          <p><strong>Dirección:</strong> {empresa.address || "No disponible"}</p>
          <p><strong>Código Postal:</strong> {empresa.postalCode || "-"}</p>
          <p><strong>Teléfono:</strong> {empresa.phone || "No disponible"}</p>
          <p><strong>Email:</strong> {empresa.email || "No disponible"}</p>
          <p><strong>WhatsApp:</strong> {empresa.whatsapp || "No disponible"}</p>
          <p><strong>CUIT:</strong> {empresa.cuit || "-"}</p>
          <p><strong>Website:</strong>{" "}
            {empresa.website ? (
              <a href={`https://${empresa.website}`} className="text-blue-600 underline" target="_blank">
                {empresa.website}
              </a>
            ) : (
              "No disponible"
            )}
          </p>

          {empresa.address && (
            <div className="mt-4">
              <iframe
                width="100%"
                height="200"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={`https://maps.google.com/maps?q=${encodeURIComponent(empresa.address)}&output=embed`}
              ></iframe>
            </div>
          )}
        </div>

        {/* Productos */}
        <div className="md:w-2/3">
          <RelatedProductsGrid products={productos} />
        </div>
      </div>
    </div>
  )
}
