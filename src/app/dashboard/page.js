"use client";
import ProDashboardPanel from "@/components/ProDashboardPanel";
import FreeDashboardPanel from "@/components/FreeDashboardPanel";
import { DashboardBreadcrumb } from "@/components/DashboardBreadcrumb";
import { useUser } from "@/context/AuthContext";

export default function DashboardHome() {
  const { user, loading } = useUser();

  if (loading || !user) return null;

  return (
    <>
      <DashboardBreadcrumb />
      {user.plan === "free"
        ? <FreeDashboardPanel />
        : <ProDashboardPanel />
      }
    </>
  );
}
