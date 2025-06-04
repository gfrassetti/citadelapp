"use client";
import { useState } from "react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton
} from "@/components/ui/sidebar";

export default function NavProjects({ projects, setActiveComponent }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Mi Dashboard</SidebarGroupLabel>
      <SidebarMenu>
      {projects.map((project, index) => {
        const Icon = project.icon;
        return (
          <SidebarMenuButton key={project.name} onClick={() => setActiveComponent(project.component)}>
            {Icon && <Icon />}
            <span>{project.name}</span>
          </SidebarMenuButton>
        );
      })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
