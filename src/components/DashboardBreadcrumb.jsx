"use client";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator, BreadcrumbLink, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

const DASHBOARD_LABELS = {
  "dashboard": "Dashboard",
  "profile": "Account",
  "subscription": "Subscription",
  "edit-info": "Mi Empresa",
  "edit-products": "Editar Productos",
  "upload-products": "Sube tus Productos",
  "product": "Producto",
};

export function DashboardBreadcrumb() {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);

  if (!pathname.startsWith("dashboard") && !pathname.startsWith("/dashboard")) return null;
  if (parts.length <= 1) return null;

  let label = DASHBOARD_LABELS[parts[1]] || "Dashboard";
  // Caso especial para producto/id
  if (parts[1] === "product" && parts[2]) label = "Editar producto";

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{label}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
