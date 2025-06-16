"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function PaymentUpdatedPage() {
  const router = useRouter()

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/dashboard")
    }, 3000)

    return () => clearTimeout(timeout)
  }, [router])

  return (
    <div className="max-w-xl mx-auto mt-20 text-center">
      <h1 className="text-2xl font-bold text-green-600 mb-4">
        ✅ Método de pago actualizado
      </h1>
      <p className="text-gray-700">Serás redirigido al panel en unos segundos...</p>
    </div>
  )
}
