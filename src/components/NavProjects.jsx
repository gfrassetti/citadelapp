"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export default function NavUser({ user, projects, setActiveComponent }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Mi Cuenta</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuButton
            key={item.name}
            onClick={() => setActiveComponent(item.component)}
          >
            {item.name}
          </SidebarMenuButton>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
