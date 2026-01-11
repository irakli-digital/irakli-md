'use client';

import { trpc } from '@/lib/trpc/client';
import { Users, BookOpen, BarChart3, Zap } from 'lucide-react';

export default function AdminDashboard() {
  const { data: stats, isLoading } = trpc.admin.analytics.overview.useQuery();

  if (isLoading) {
    return (
      <div className="text-[#737373] font-mono animate-pulse">loading dashboard...</div>
    );
  }

  const statCards = [
    {
      label: 'total users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: '#3B82F6',
    },
    {
      label: 'active today',
      value: stats?.activeToday || 0,
      icon: Zap,
      color: '#22C55E',
    },
    {
      label: 'total lessons',
      value: stats?.totalLessons || 0,
      icon: BookOpen,
      color: '#8B5CF6',
    },
    {
      label: 'attempts today',
      value: stats?.attemptsToday || 0,
      icon: BarChart3,
      color: '#F59E0B',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-mono text-[#E5E5E5]">dashboard</h1>
        <p className="text-sm text-[#737373] font-mono mt-1">
          overview of platform stats
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-[#252525] border border-[#333] rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-[#737373] font-mono text-sm">{stat.label}</span>
                <Icon className="h-4 w-4" style={{ color: stat.color }} />
              </div>
              <div className="mt-2 text-2xl font-mono text-[#E5E5E5]">
                {stat.value.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Subscription Breakdown */}
      <div className="bg-[#252525] border border-[#333] rounded-lg p-4">
        <h2 className="text-[#E5E5E5] font-mono text-sm mb-4">subscriptions</h2>
        <div className="grid grid-cols-3 gap-4">
          {['free', 'trial', 'pro'].map((tier) => (
            <div key={tier} className="text-center">
              <div className="text-[#737373] font-mono text-xs uppercase">{tier}</div>
              <div className="text-xl font-mono text-[#E5E5E5] mt-1">
                {stats?.subscriptions[tier] || 0}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
