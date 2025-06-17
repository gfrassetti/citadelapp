"use client";
import ProductEditForm from "@/components/ProductEditForm";
import { DashboardBreadcrumb } from "@/components/DashboardBreadcrumb";

export default function ProductEdit({ params }) {
  return (
    <>
      <DashboardBreadcrumb />
      <ProductEditForm productId={params.id} />
    </>
  );
}
