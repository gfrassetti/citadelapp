"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"

export default function RelatedProductsGrid({ products }) {
  const router = useRouter()

  if (!products || products.length === 0) return null

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Productos Relacionados</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => router.push(`/product?id=${product.id}`)}
            className="cursor-pointer border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
          >
            {product.imageUrl && (
              <Image
                src={product.imageUrl}
                alt={product.productName}
                width={400}
                height={300}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1">{product.productName}</h3>
              <p className="text-green-600 font-semibold">Precio: ${product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

