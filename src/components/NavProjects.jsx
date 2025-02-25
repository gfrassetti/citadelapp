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
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((project, index) => (
  <SidebarMenuButton key={index} onClick={() => setActiveComponent(project.component)}>
    <project.icon />
    <span>{project.name}</span>
  </SidebarMenuButton>

        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
