'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { trpc } from '@/lib/trpc/client';
import { User, Shield, Zap, LogOut, Check, AlertTriangle, Snowflake } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { data: session } = useSession();
  const [displayName, setDisplayName] = useState('');
  const [saved, setSaved] = useState(false);

  const { data: profile, isLoading: profileLoading } = trpc.profile.get.useQuery();

  // Set display name when profile loads
  useEffect(() => {
    if (profile?.displayName) {
      setDisplayName(profile.displayName);
    }
  }, [profile]);

  const { data: subscription } = trpc.subscription.getStatus.useQuery();
  const { data: streakStatus, refetch: refetchStreak } = trpc.profile.getStreakFreezeStatus.useQuery();

  const updateProfile = trpc.profile.update.useMutation({
    onSuccess: () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
  });

  const useStreakFreeze = trpc.profile.useStreakFreeze.useMutation({
    onSuccess: () => {
      refetchStreak();
    },
  });

  if (profileLoading) {
    return (
      <div className="text-[#737373] font-mono animate-pulse">loading settings...</div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-mono text-[#E5E5E5]">settings</h1>
        <p className="text-sm text-[#737373] font-mono mt-1">
          manage your profile and preferences
        </p>
      </div>

      {/* Profile Section */}
      <div className="bg-[#252525] border border-[#333] rounded-lg p-6 space-y-6">
        <div className="flex items-center gap-2 border-b border-[#333] pb-3">
          <User className="h-4 w-4 text-[#D97706]" />
          <h2 className="text-[#E5E5E5] font-mono text-sm">profile</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[#737373] font-mono text-xs mb-2">
              email
            </label>
            <div className="bg-[#1A1A1A] border border-[#333] rounded px-3 py-2 text-sm font-mono text-[#A3A3A3]">
              {session?.user?.email}
            </div>
            <p className="text-[#525252] text-xs font-mono mt-1">
              email cannot be changed
            </p>
          </div>

          <div>
            <label className="block text-[#737373] font-mono text-xs mb-2">
              display name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter display name"
              className="w-full bg-[#1A1A1A] border border-[#333] rounded px-3 py-2 text-sm font-mono text-[#E5E5E5] placeholder:text-[#525252] focus:border-[#D97706] outline-none"
            />
          </div>

          <button
            onClick={() => updateProfile.mutate({ displayName })}
            disabled={updateProfile.isPending}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded font-mono text-sm transition-colors',
              saved
                ? 'bg-[#22C55E]/20 text-[#22C55E]'
                : 'bg-[#D97706] hover:bg-[#F59E0B] text-[#1A1A1A]'
            )}
          >
            {saved ? (
              <>
                <Check className="h-4 w-4" />
                saved
              </>
            ) : updateProfile.isPending ? (
              'saving...'
            ) : (
              'save changes'
            )}
          </button>
        </div>
      </div>

      {/* Streak Freeze Section */}
      <div className="bg-[#252525] border border-[#333] rounded-lg p-6 space-y-6">
        <div className="flex items-center gap-2 border-b border-[#333] pb-3">
          <Snowflake className="h-4 w-4 text-[#3B82F6]" />
          <h2 className="text-[#E5E5E5] font-mono text-sm">streak freeze</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#E5E5E5] font-mono text-sm">
                available freezes
              </p>
              <p className="text-[#737373] text-xs font-mono mt-0.5">
                use a freeze to protect your streak when you miss a day
              </p>
            </div>
            <div className="text-2xl font-mono text-[#3B82F6]">
              {streakStatus?.available || 0}
            </div>
          </div>

          {streakStatus?.streakAtRisk && (
            <div className="flex items-center gap-2 p-3 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded">
              <AlertTriangle className="h-4 w-4 text-[#F59E0B]" />
              <span className="text-[#F59E0B] text-sm font-mono">
                your streak is at risk! practice today or use a freeze.
              </span>
            </div>
          )}

          <button
            onClick={() => useStreakFreeze.mutate()}
            disabled={!streakStatus?.canUse || useStreakFreeze.isPending}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded font-mono text-sm transition-colors',
              streakStatus?.canUse
                ? 'bg-[#3B82F6]/20 text-[#3B82F6] hover:bg-[#3B82F6]/30'
                : 'bg-[#333] text-[#525252] cursor-not-allowed'
            )}
          >
            <Snowflake className="h-4 w-4" />
            {useStreakFreeze.isPending
              ? 'using freeze...'
              : streakStatus?.canUse
                ? 'use streak freeze'
                : 'no freeze needed'}
          </button>
        </div>
      </div>

      {/* Subscription Section */}
      <div className="bg-[#252525] border border-[#333] rounded-lg p-6 space-y-6">
        <div className="flex items-center gap-2 border-b border-[#333] pb-3">
          <Zap className="h-4 w-4 text-[#F59E0B]" />
          <h2 className="text-[#E5E5E5] font-mono text-sm">subscription</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#E5E5E5] font-mono text-sm">
                current plan
              </p>
              <p className="text-[#737373] text-xs font-mono mt-0.5">
                {subscription?.tier === 'pro'
                  ? 'full access to all features'
                  : subscription?.tier === 'trial'
                    ? `trial expires in ${subscription.daysRemaining} days`
                    : 'limited access to free content'}
              </p>
            </div>
            <span
              className={cn(
                'px-3 py-1 rounded text-sm font-mono',
                subscription?.tier === 'pro'
                  ? 'bg-[#D97706]/20 text-[#D97706]'
                  : subscription?.tier === 'trial'
                    ? 'bg-[#3B82F6]/20 text-[#3B82F6]'
                    : 'bg-[#333] text-[#737373]'
              )}
            >
              {subscription?.tier || 'free'}
            </span>
          </div>

          {subscription?.tier !== 'pro' && (
            <a
              href="/pricing"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#D97706] hover:bg-[#F59E0B] text-[#1A1A1A] rounded font-mono text-sm transition-colors"
            >
              upgrade to pro
            </a>
          )}
        </div>
      </div>

      {/* Account Stats */}
      <div className="bg-[#252525] border border-[#333] rounded-lg p-6 space-y-6">
        <div className="flex items-center gap-2 border-b border-[#333] pb-3">
          <Shield className="h-4 w-4 text-[#8B5CF6]" />
          <h2 className="text-[#E5E5E5] font-mono text-sm">account</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm font-mono">
          <div>
            <p className="text-[#737373]">member since</p>
            <p className="text-[#E5E5E5]">
              {profile?.createdAt
                ? new Date(profile.createdAt).toLocaleDateString()
                : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-[#737373]">total XP</p>
            <p className="text-[#E5E5E5]">{profile?.totalXp?.toLocaleString() || 0}</p>
          </div>
          <div>
            <p className="text-[#737373]">level</p>
            <p className="text-[#E5E5E5]">{profile?.level || 1}</p>
          </div>
          <div>
            <p className="text-[#737373]">longest streak</p>
            <p className="text-[#E5E5E5]">{profile?.longestStreak || 0} days</p>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-[#252525] border border-[#EF4444]/30 rounded-lg p-6 space-y-6">
        <div className="flex items-center gap-2 border-b border-[#333] pb-3">
          <LogOut className="h-4 w-4 text-[#EF4444]" />
          <h2 className="text-[#E5E5E5] font-mono text-sm">session</h2>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex items-center gap-2 px-4 py-2 bg-[#EF4444]/10 hover:bg-[#EF4444]/20 text-[#EF4444] rounded font-mono text-sm transition-colors"
          >
            <LogOut className="h-4 w-4" />
            sign out
          </button>
        </div>
      </div>
    </div>
  );
}
