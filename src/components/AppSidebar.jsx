"use client";

import { Sidebar, SidebarContent, SidebarFooter, SidebarRail, SidebarTrigger } from "@/components/ui/sidebar";
import { PieChart, Building2, Boxes } from "lucide-react";
import { useUser } from "@/context/AuthContext";
import NavUser from "@/components/NavUser";
import NavProjects from "@/components/NavProjects";

export function AppSidebar() {
  const { user } = useUser();
  const isProUser = user?.plan === "pro";

  const projects = [
    {
      name: "Dashboard",
      icon: PieChart,
      href: "/dashboard",
      disabled: !isProUser,
    },
    {
      name: "Sube tus Productos",
      icon: Boxes,
      href: "/dashboard/upload-products",
      disabled: !isProUser,
    },
    {
      name: "Edita tus productos",
      icon: Boxes,
      href: "/dashboard/edit-products",
      disabled: !isProUser,
    },
    {
      name: "Mi Empresa",
      icon: Building2,
      href: "/dashboard/edit-info",
      disabled: !isProUser,
    },
  ];

  return (
      <Sidebar collapsible="icon" className="w-full sm:w-64">
        {/* Trigger visible siempre en desktop */}
        <div className="flex items-center h-12 px-2 py-6 border-b border-sidebar-border">
          <SidebarTrigger />
        </div>
        <SidebarContent>
          <NavProjects projects={projects} />
        </SidebarContent>
        <SidebarFooter>
          {user ? (
            <NavUser
              projects={[
                { name: "Account", href: "/dashboard/profile" },
                { name: "Subscription", href: "/dashboard/subscription" },
              ]}
              user={{
                name: user.name || user.displayName || "Usuario",
                email: user.email || "",
              }}
            />
          ) : (
            <p className="text-muted">No autenticado</p>
          )}
        </SidebarFooter>
        {/* Rail: barra clickable para abrir/cerrar cuando está colapsado */}
        <SidebarRail />
      </Sidebar>
  );
}
