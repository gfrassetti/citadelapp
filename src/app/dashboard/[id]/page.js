"use client"

import { use } from "react"
import ProductEditForm from "@/components/ProductEditForm"

export default function Page({ params }) {
  const id = params.id
  return <ProductEditForm productId={id} />
}
