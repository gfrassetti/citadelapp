"use client";

import UploadProduct from "@/components/UploadProduct";
import { useUser } from "@/context/AuthContext";
import { DashboardBreadcrumb } from "@/components/DashboardBreadcrumb";

export default function UploadProductsPage() {
  const { userData } = useUser();
  return (
    <>
      <DashboardBreadcrumb />
      <UploadProduct empresaId={userData?.empresaId} />
    </>
  );
}
