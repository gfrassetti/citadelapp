'use client';

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { useUser } from "@/context/AuthContext";
import FullScreenLoader from "@/components/FullScreenLoader";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({ children }) {
  const { user, loading } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }

    if (!loading && user) {
      setReady(true);
    }
  }, [loading, user]);

  if (!ready) return <FullScreenLoader />;

  return (
    <SidebarProvider>
      <AppSidebar currentPath={pathname} />
      <SidebarInset>
        <DashboardHeader />
        <main className="flex-1 p-4 pt-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
