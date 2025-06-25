"use client";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { useUser } from "@/context/AuthContext";
import Loader from "@/components/Loader";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }) {
  const { user, loading } = useUser();
  const pathname = usePathname();

  if (loading || !user) return <Loader text="" />;

  return (
    <SidebarProvider>
      <AppSidebar currentPath={pathname} />
      <SidebarInset>
        <DashboardHeader />
        <main className="flex-1 p-4 pt-0">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
