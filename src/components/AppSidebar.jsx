"use client";

import * as React from "react";
import {
  Frame,
  Map,
  PieChart,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/NavMain";
import  NavProjects from "@/components/NavProjects";
import { NavUser } from "@/components/NavUser";
import { Button } from "@/components/ui/button";


import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import { useUser } from "@/context/AuthContext";

/* const data = {
  user: { avatar: 'https://github.com/shadcn.png' },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      onClick: () => setActiveComponent(null),
      items: [
        { title: "Inicio", url: "#", onClick: () => setActiveComponent(null) },
      ]
    }
  ]
}; */


export function AppSidebar({ setShowUpgrade, setActiveComponent }) {
  const { user } = useUser();
  const isProUser = user?.plan === "pro";

  return (
    <Sidebar collapsible="icon" className="w-full sm:w-64">
      <SidebarHeader className="block sm:hidden p-4 border-b">
        <h2 className="text-lg font-bold">Mi Panel</h2>
      </SidebarHeader>
      <SidebarContent>
        {/* SIDE NAV BAR */}
        <NavProjects
          setActiveComponent={setActiveComponent}
          projects={[
            {
              name: "Sube Tu Informacion",
              icon: PieChart,
              component: "UploadInfo",
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
              name: "Edita Informacion de tu empresas",
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
            setActiveComponent={setActiveComponent} 
            projects={[
              { name: "Account" , component: "Profile" },
              { name: "My Suscription" , component: "SuscriptionInfo" },
            ]}
            user={{ 
              name: user.name || user.displayName || "Usuario", 
              email: user.email || "", 
              /* avatar: user.photoURL || data.user.avatar  */
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
