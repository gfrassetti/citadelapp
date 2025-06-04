"use client";

import {
  BadgeCheck,
  ChevronsUpDown,
  LogOut,
  Sparkles,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader2Icon } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { signOut } from "firebase/auth";
import { auth } from "@/lib/db/db";
import { useRouter } from "next/navigation";
import { useUserData } from "@/context/UserDataContext";
import { useHandleUpgrade } from "@/hooks/useHandleUpgrade";

// Función para obtener iniciales
function getInitials(name) {
  if (!name) return "";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function NavUser({ projects, setActiveComponent }) {
  const userData = useUserData();
  const { isMobile } = useSidebar();
  const router = useRouter();
  const handleUpgrade = useHandleUpgrade(user);

  const displayName = userData?.name || "Usuario";
  const displayEmail = userData?.email || "";
  const avatarUrl = userData?.avatarUrl || "";
  const userPlan = userData?.plan || "free";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={avatarUrl} alt={displayName} />
                <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{displayName}</span>
                <span className="truncate text-xs">{displayEmail}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-full">
                  <AvatarImage className="rounded-full" src={avatarUrl} alt={displayName} />
                  <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{displayName}</span>
                  <span className="truncate text-xs">{displayEmail}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              {userPlan === "free" && (
                <DropdownMenuItem
                    onClick={() => handleUpgrade.mutate()}
                    disabled={handleUpgrade.isPending}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    {handleUpgrade.isPending ? (
                      <>
                        <Loader2Icon className="animate-spin h-4 w-4 mr-1" />
                        Cargando...
                      </>
                    ) : (
                      "Upgrade to Pro"
                    )}
                  </DropdownMenuItem>

              )}
            </DropdownMenuGroup>

            {userPlan === "free" && <DropdownMenuSeparator />}

            <DropdownMenuGroup>
              {projects.map((project, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={() => setActiveComponent(project.component)}
                >
                  <BadgeCheck className="mr-2" />
                  {project.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>

            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2" />
              <button onClick={() => signOut(auth).then(() => router.push("/login"))}>
                Cerrar sesión
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}