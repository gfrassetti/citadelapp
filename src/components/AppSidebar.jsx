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

import {useUser}  from "@/context/AuthContext";
import NavUser  from "@/components/NavUser";
import NavProjects from "@/components/NavProjects";

export function AppSidebar({ setShowUpgrade, setActiveComponent }) {
  const { user } = useUser();
  const isProUser = user?.plan === "pro";

  const {
    setOpenMobile,
    isMobile,
  } = useSidebar();

  const handleItemClick = (component) => {
    setActiveComponent(component);
    if (isMobile) setOpenMobile(false);
  };

  return (
    <Sidebar collapsible="icon" className="w-full sm:w-64">
      <SidebarHeader className="block sm:hidden p-4 border-b">
        <h2 className="text-lg font-bold">Mi Panel</h2>
      </SidebarHeader>

      <SidebarContent>
        <NavProjects
          setActiveComponent={handleItemClick}
          projects={[
            {
              name: "Dashboard",
              icon: PieChart,
              component: "ProDashboard", // este es el nombre que deberías usar en tu router interno
              disabled: !isProUser,
            },
            {
              name: "Sube tus Productos",
              icon: Map,
              component: "UploadProduct",
              disabled: !isProUser,
            },
            {
              name: "Edita tus productos",
              icon: Map,
              component: "EditProduct",
              disabled: !isProUser,
            },
            {
              name: "Mi Empresa",
              icon: Map,
              component: "EditInfo",
              disabled: !isProUser,
            },
          ]}
        />
      </SidebarContent>

      <SidebarFooter>
        {user ? (
          <NavUser
            setActiveComponent={handleItemClick}
            projects={[
              { name: "Account", component: "Profile" },
              { name: "My Suscription", component: "SuscriptionInfo" },
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
