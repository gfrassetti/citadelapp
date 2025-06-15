"use client"
import { use } from "react"
import ProductEditForm from "@/components/ProductEditForm";

export default function Page(props) {
  const { id } = use(props.params);
  return <ProductEditForm productId={id} />;
}
