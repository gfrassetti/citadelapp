"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import UploadInfo from "@/components/UploadInfo";



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
    { title: "Playground", url: "#", icon: SquareTerminal, isActive: true, items: [{ title: "History", url: "#" }, { title: "Starred", url: "#" }, { title: "Settings", url: "#" }] },
    { title: "Models", url: "#", icon: Bot, items: [{ title: "Genesis", url: "#" }, { title: "Explorer", url: "#" }, { title: "Quantum", url: "#" }] },
    { title: "Documentation", url: "#", icon: BookOpen, items: [{ title: "Introduction", url: "#" }, { title: "Get Started", url: "#" }, { title: "Tutorials", url: "#" }, { title: "Changelog", url: "#" }] },
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
            { name: "Subir Productos", icon: PieChart, component: "UploadInfo" },
            { name: "Tu cuenta", icon: Map, component: null },
            { name: "Editar tu Info", icon: Map, component: null }
          ]}
          
        />
        )}
      </SidebarContent>
      <SidebarFooter>
        {user ? (
          <NavUser 
            user={{ 
              name: user.name || user.displayName || "Usuario",  // 🔥 Ahora muestra correctamente el nombre real
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
