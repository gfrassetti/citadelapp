"use client";
import ProDashboardPanel from "@/components/ProDashboardPanel";
import FreeDashboardPanel from "@/components/FreeDashboardPanel";
import { DashboardBreadcrumb } from "@/components/DashboardBreadcrumb";
import { useUser } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardHome() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user]);

  if (loading || !user) return null;

  return (
    <>
      <DashboardBreadcrumb />
      {user.plan === "free" ? <FreeDashboardPanel /> : <ProDashboardPanel />}
    </>
  );
}
