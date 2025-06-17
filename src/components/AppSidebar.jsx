"use client";

import { useSidebar } from "@/components/ui/sidebar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Map, PieChart } from "lucide-react";
import { useUser } from "@/context/AuthContext";
import NavUser from "@/components/NavUser";
import NavProjects from "@/components/NavProjects";

export function AppSidebar() {
  const { user } = useUser();
  const isProUser = user?.plan === "pro";

  return (
    <Sidebar collapsible="icon" className="w-full sm:w-64">
      <SidebarHeader className="block sm:hidden p-4 border-b">
        <h2 className="text-lg font-bold">Mi Panel</h2>
      </SidebarHeader>

      <SidebarContent>
        <NavProjects
          projects={[
            {
              name: "Dashboard",
              icon: PieChart,
              href: "/dashboard",
              disabled: !isProUser,
            },
            {
              name: "Sube tus Productos",
              icon: Map,
              href: "/dashboard/upload-products",
              disabled: !isProUser,
            },
            {
              name: "Edita tus productos",
              icon: Map,
              href: "/dashboard/edit-products",
              disabled: !isProUser,
            },
            {
              name: "Mi Empresa",
              icon: Map,
              href: "/dashboard/edit-info",
              disabled: !isProUser,
            },
          ]}
        />
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

      <SidebarRail />
    </Sidebar>
  );
}
