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

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import { useUser } from "@/context/AuthContext";

const data = {
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
};


export function AppSidebar({ setShowUpgrade, setActiveComponent }) {
  const { user } = useUser();
  const isProUser = user?.plan === "pro";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader />
      <SidebarContent>
        {/* <NavMain items={data.navMain} /> */}

        {/* 🔥 "Upgrade to Pro" ahora se muestra si el usuario es "free" */}
        {!isProUser ? (
          <Button
              onClick={() => {
                setShowUpgrade(true);
                setActiveComponent(null); // 👈 esto activa la vista por defecto
              }}
              className="w-full text-left flex items-center gap-2 text-gray-500 hover:text-black p-2"
            >
              <Frame className="text-gray-400" />
              Upgrade to Pro
         </Button>
        ) : (
        <NavProjects
          setActiveComponent={setActiveComponent}
          projects={[
            { name: "Sube Tu Informacion", icon: PieChart, component: "UploadInfo" },
            { name: "Sube tus Productos", icon: Map, component: "UploadProduct" },
            { name: "Edita tus productos", icon: Map, component: "EditProduct" },
            { name: "Edita Informacion de tu empresas", icon: Map, component: "EditInfo" }
          ]}
        />
        )}
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
              avatar: user.photoURL || data.user.avatar 
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
