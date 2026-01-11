'use client';

import { useParams, useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc/client';
import { cn } from '@/lib/utils';
import { ChevronLeft, RotateCcw, Shield, Mail, Calendar, Zap, Trophy } from 'lucide-react';
import Link from 'next/link';

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: user, isLoading, refetch } = trpc.admin.users.getById.useQuery({ id });

  const updateSubscription = trpc.admin.users.updateSubscription.useMutation({
    onSuccess: () => refetch(),
  });

  const updateRole = trpc.admin.users.updateRole.useMutation({
    onSuccess: () => refetch(),
  });

  const resetProgress = trpc.admin.users.resetProgress.useMutation({
    onSuccess: () => refetch(),
  });

  if (isLoading) {
    return (
      <div className="text-[#737373] font-mono animate-pulse">loading user...</div>
    );
  }

  if (!user) {
    return <div className="text-[#EF4444] font-mono">user not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/users"
          className="p-2 text-[#737373] hover:text-[#E5E5E5] transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-xl font-mono text-[#E5E5E5]">{user.email}</h1>
          <p className="text-sm text-[#737373] font-mono mt-0.5">
            {user.displayName || 'No display name'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Info */}
        <div className="bg-[#252525] border border-[#333] rounded-lg p-6 space-y-4">
          <h2 className="text-[#E5E5E5] font-mono text-sm border-b border-[#333] pb-2">
            profile
          </h2>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-[#737373]" />
              <span className="text-[#A3A3A3] font-mono text-sm">{user.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-[#737373]" />
              <span className="text-[#A3A3A3] font-mono text-sm">
                Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-4 w-4 text-[#737373]" />
              <select
                value={user.role || 'user'}
                onChange={(e) =>
                  updateRole.mutate({
                    userId: user.id,
                    role: e.target.value as 'user' | 'admin' | 'moderator',
                  })
                }
                className="bg-[#1A1A1A] border border-[#333] rounded px-3 py-1 text-sm font-mono text-[#E5E5E5]"
              >
                <option value="user">user</option>
                <option value="moderator">moderator</option>
                <option value="admin">admin</option>
              </select>
            </div>
          </div>
        </div>

        {/* Subscription */}
        <div className="bg-[#252525] border border-[#333] rounded-lg p-6 space-y-4">
          <h2 className="text-[#E5E5E5] font-mono text-sm border-b border-[#333] pb-2">
            subscription
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-[#737373] font-mono text-xs mb-2">tier</label>
              <div className="flex gap-2">
                {['free', 'trial', 'pro'].map((t) => (
                  <button
                    key={t}
                    onClick={() =>
                      updateSubscription.mutate({
                        userId: user.id,
                        tier: t as 'free' | 'trial' | 'pro',
                      })
                    }
                    className={cn(
                      'px-4 py-2 rounded font-mono text-sm transition-colors',
                      user.subscriptionTier === t
                        ? 'bg-[#D97706]/20 text-[#D97706]'
                        : 'bg-[#333] text-[#737373] hover:text-[#E5E5E5]'
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-[#737373] font-mono">status:</span>
                <span className="text-[#E5E5E5] font-mono ml-2">
                  {user.subscriptionStatus || 'active'}
                </span>
              </div>
              <div>
                <span className="text-[#737373] font-mono">expires:</span>
                <span className="text-[#E5E5E5] font-mono ml-2">
                  {user.subscriptionEndDate
                    ? new Date(user.subscriptionEndDate).toLocaleDateString()
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Stats */}
        <div className="bg-[#252525] border border-[#333] rounded-lg p-6 space-y-4">
          <h2 className="text-[#E5E5E5] font-mono text-sm border-b border-[#333] pb-2">
            progress
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#1A1A1A] rounded-lg p-4 text-center">
              <Zap className="h-5 w-5 text-[#F59E0B] mx-auto mb-2" />
              <div className="text-xl font-mono text-[#E5E5E5]">
                {user.totalXp?.toLocaleString() || 0}
              </div>
              <div className="text-xs text-[#737373] font-mono">total XP</div>
            </div>
            <div className="bg-[#1A1A1A] rounded-lg p-4 text-center">
              <Trophy className="h-5 w-5 text-[#8B5CF6] mx-auto mb-2" />
              <div className="text-xl font-mono text-[#E5E5E5]">{user.level || 1}</div>
              <div className="text-xs text-[#737373] font-mono">level</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-mono text-[#E5E5E5]">
                {user.currentStage || 1}
              </div>
              <div className="text-xs text-[#737373] font-mono">stage</div>
            </div>
            <div>
              <div className="text-lg font-mono text-[#E5E5E5]">
                {user.currentStreak || 0}
              </div>
              <div className="text-xs text-[#737373] font-mono">streak</div>
            </div>
            <div>
              <div className="text-lg font-mono text-[#E5E5E5]">
                {user.stats?.totalAttempts || 0}
              </div>
              <div className="text-xs text-[#737373] font-mono">attempts</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-[#252525] border border-[#333] rounded-lg p-6 space-y-4">
          <h2 className="text-[#E5E5E5] font-mono text-sm border-b border-[#333] pb-2">
            actions
          </h2>

          <div className="space-y-3">
            <button
              onClick={() => {
                if (
                  confirm(
                    'Are you sure you want to reset all progress for this user? This cannot be undone.'
                  )
                ) {
                  resetProgress.mutate({ userId: user.id });
                }
              }}
              disabled={resetProgress.isPending}
              className="flex items-center gap-2 w-full px-4 py-2 bg-[#EF4444]/10 text-[#EF4444] rounded font-mono text-sm hover:bg-[#EF4444]/20 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              {resetProgress.isPending ? 'resetting...' : 'reset all progress'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
