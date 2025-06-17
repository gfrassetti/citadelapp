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
            className={`
              ${item.disabled ? "opacity-50 pointer-events-none" : ""}
              ${pathname === item.href ? "font-bold text-blue-600" : ""}
            `}
          >
            <Link href={item.disabled ? "#" : item.href}>
              {item.name}
            </Link>
          </SidebarMenuButton>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
