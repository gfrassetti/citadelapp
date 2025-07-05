'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/AuthContext';
import ProDashboardPanel from '@/components/ProDashboardPanel';
import FreeDashboardPanel from '@/components/FreeDashboardPanel';
import {DashboardBreadcrumb} from '@/components/DashboardBreadcrumb';
import FullScreenLoader from '@/components/FullScreenLoader';

export default function DashboardHome() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      console.log('Redirigiendo al login...');
      router.replace('/login');
    }
  }, [loading, user]);

  if (loading || !user) return <FullScreenLoader />;

  return (
    <>
      <DashboardBreadcrumb />
      {user.plan === 'free' ? <FreeDashboardPanel /> : <ProDashboardPanel />}
    </>
  );
}
