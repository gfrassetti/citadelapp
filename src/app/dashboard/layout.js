"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useUser } from "@/context/AuthContext";
import Loader from "@/components/Loader";
import { usePathname } from "next/navigation";
import DashboardHeader from "@/components/DashboardHeader";

export default function DashboardLayout({ children }) {
  const { user, loading } = useUser();
  const pathname = usePathname();

  if (loading || !user) return <Loader text="" />;

  return (
    <SidebarProvider>
      <div className="flex h-dvh w-full">
        <AppSidebar currentPath={pathname} />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-4 pt-0">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
