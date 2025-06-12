"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export default function NavProjects({ projects, setActiveComponent }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Mi Cuenta</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuButton
            key={item.name}
            onClick={() => !item.disabled && setActiveComponent(item.component)}
            className={item.disabled ? "opacity-50 pointer-events-none" : ""}
          >
            {item.name}
          </SidebarMenuButton>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
