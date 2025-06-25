"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavProjects({ projects }) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Mi Cuenta</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuButton
            key={item.name}
            asChild
            isActive={pathname === item.href}
            className={`
              ${item.disabled ? "opacity-50 pointer-events-none" : ""}
            `}
            tooltip={item.name} // Tooltip en modo collapsed
          >
            <Link href={item.disabled ? "#" : item.href}>
              <item.icon className="mr-2" />
              <span>{item.name}</span>
            </Link>
          </SidebarMenuButton>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
