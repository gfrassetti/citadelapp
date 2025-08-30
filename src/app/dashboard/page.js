"use client";

import ProDashboardPanel from "@/components/ProDashboardPanel";
import FreeDashboardPanel from "@/components/FreeDashboardPanel";
import { DashboardBreadcrumb } from "@/components/DashboardBreadcrumb";
import { useSubscription } from "@/context/SubscriptionContext";


export default function DashboardHome() {
  const { subscription, loading: subscriptionLoading } = useSubscription();

  const isPro =
    subscription?.status === "active" && !subscription?.pause_collection;

  if (subscriptionLoading) return null; // o loader

  return (
    <>
      <DashboardBreadcrumb />
      {isPro ? <ProDashboardPanel /> : <FreeDashboardPanel />}
    </>
  );
}

/* 
'use client';

import { useUser } from '@/context/AuthContext';
import ProDashboardPanel from '@/components/ProDashboardPanel';
import FreeDashboardPanel from '@/components/FreeDashboardPanel';
import { DashboardBreadcrumb } from '@/components/DashboardBreadcrumb';

export default function DashboardHome() {
  const { user } = useUser();

  return (
    <>
      <DashboardBreadcrumb />
      {user.plan === 'free' ? <FreeDashboardPanel /> : <ProDashboardPanel />}
    </>
  );
}
 */