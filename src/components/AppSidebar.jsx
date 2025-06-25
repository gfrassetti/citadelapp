"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar";
import { LayoutDashboard, UploadCloud, PencilLine, Building2 } from "lucide-react";
import { useUser } from "@/context/AuthContext";
import NavUser from "@/components/NavUser";
import NavProjects from "@/components/NavProjects";

export function AppSidebar() {
  const { user } = useUser();
  const isProUser = user?.plan === "pro";

  const projects = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      disabled: !isProUser,
    },
    {
      name: "Sube tus Productos",
      icon: UploadCloud,
      href: "/dashboard/upload-products",
      disabled: !isProUser,
    },
    {
      name: "Edita tus productos",
      icon: PencilLine,
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
    <SidebarProvider>
      <Sidebar collapsible="icon" className="w-full sm:w-64">
        <div className="flex items-center h-12 px-2 border-b border-sidebar-border">
          <SidebarTrigger />
        </div>
        <SidebarContent>
          <NavProjects projects={projects} />
        </SidebarContent>
        <SidebarFooter>
          {user ? (
            <NavUser />
          ) : (
            <p className="text-muted">No autenticado</p>
          )}
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </SidebarProvider>
  );
}
