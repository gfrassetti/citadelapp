'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/AuthContext';
import ProDashboardPanel from '@/components/ProDashboardPanel';
import FreeDashboardPanel from '@/components/FreeDashboardPanel';
import { DashboardBreadcrumb } from '@/components/DashboardBreadcrumb';
import FullScreenLoader from '@/components/FullScreenLoader';

export default function DashboardHome() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [loading, user]);

  if (loading || !user || !user.plan) return <FullScreenLoader />;

  return (
    <>
      <DashboardBreadcrumb />
      {user.plan === 'free' ? <FreeDashboardPanel /> : <ProDashboardPanel />}
    </>
  );
}
