'use client';

import { useUser } from '@/context/AuthContext';
import ProDashboardPanel from '@/components/ProDashboardPanel';
import FreeDashboardPanel from '@/components/FreeDashboardPanel';
import { DashboardBreadcrumb } from '@/components/DashboardBreadcrumb';
import FullScreenLoader from '@/components/FullScreenLoader';

export default function DashboardHome() {
  const { user, loading } = useUser();

  if (loading || !user) return <FullScreenLoader />;

  return (
    <>
      <DashboardBreadcrumb />
      {user.plan === 'free' ? <FreeDashboardPanel /> : <ProDashboardPanel />}
    </>
  );
}
