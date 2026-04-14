'use client';

import React from 'react';
import { useDashboardStats } from '../hooks/useDashboardQuery';
import { StatCard } from '@/shared/components/StatCard';
import { FileCheck, Cpu, CheckCircle, AlertTriangle } from 'lucide-react';

export const DashboardStats: React.FC = () => {
  const { data, isLoading } = useDashboardStats();

  const stats = data?.data;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <StatCard
        title="Processed Today"
        value={isLoading ? '...' : (stats?.processed_today.count ?? 0)}
        icon={FileCheck}
        variant="primary"
        trend={stats?.processed_today.percentage_change ? `+${stats.processed_today.percentage_change}% from yesterday` : undefined}
      />
      <StatCard
        title="Currently Processing"
        value={isLoading ? '...' : (stats?.currently_processing.count ?? 0)}
        icon={Cpu}
        variant="info"
      />
      <StatCard
        title="Completed Jobs"
        value={isLoading ? '...' : (stats?.completed_jobs.count ?? 0)}
        icon={CheckCircle}
        variant="success"
      />
      <StatCard
        title="Failed Jobs"
        value={isLoading ? '...' : (stats?.failed_jobs.count ?? 0)}
        icon={AlertTriangle}
        variant="destructive"
      />
    </div>
  );
};
