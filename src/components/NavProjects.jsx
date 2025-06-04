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
      <SidebarMenu>
        {projects.map((project, index) => {
          const Icon = project.icon;
          const isDisabled = project.disabled;

          return (
            <SidebarMenuButton
              key={project.name}
              onClick={() => {
                if (!isDisabled) setActiveComponent(project.component);
              }}
              disabled={isDisabled}
              className={isDisabled ? "opacity-40 pointer-events-none" : ""}
            >
              {Icon && <Icon className="mr-2 h-4 w-4" />}
              <span>{project.name}</span>
            </SidebarMenuButton>
          );
        })}
      </SidebarMenu>
      </SidebarMenu>
    </SidebarGroup>
  );
}
