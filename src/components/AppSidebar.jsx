"use client";

import * as React from "react";
import {
  BookOpen,
  Bot,
  Frame,
  Map,
  PieChart,
  Settings2,
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
    { title: "Dashboard", url: "/dashboard", icon: SquareTerminal, isActive: true, items: [{ title: "History", url: "#" }, { title: "Starred", url: "#" }, { title: "Settings", url: "#" }] },
    { title: "Settings", url: "#", icon: Settings2, items: [{ title: "General", url: "#" }, { title: "Team", url: "#" }, { title: "Billing", url: "#" }, { title: "Limits", url: "#" }] },
  ],
};

export function AppSidebar({ setShowUpgrade, setActiveComponent }) {
  const { user } = useUser();
  const isProUser = user?.plan === "pro";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader />
      <SidebarContent>
        <NavMain items={data.navMain} />

        {/* 🔥 "Upgrade to Pro" ahora se muestra si el usuario es "free" */}
        {!isProUser ? (
          <button 
            className="w-full text-left flex items-center gap-2 text-gray-500 hover:text-black p-2"
            onClick={() => setShowUpgrade(true)}
          >
            <Frame className="text-gray-400" />
            Upgrade to Pro
          </button>
        ) : (
        <NavProjects
          setActiveComponent={setActiveComponent}
          projects={[
            { name: "Sube Tu Informacion", icon: PieChart, component: "UploadInfo" },
            { name: "Sube tus Productos", icon: Map, component: "UploadProduct" },
            { name: "Edita tus productos", icon: Map, component: null },
            { name: "Edita tu Informacion", icon: Map, component: null }
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
