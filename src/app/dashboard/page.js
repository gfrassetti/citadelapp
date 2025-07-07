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
