'use client';

import { cn } from '@/lib/utils';
import { Clock, Sparkles, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface TrialBannerProps {
  tier: 'free' | 'trial' | 'pro';
  daysRemaining?: number;
  isExpired?: boolean;
  className?: string;
}

export function TrialBanner({ tier, daysRemaining, isExpired, className }: TrialBannerProps) {
  // Don't show banner for pro users
  if (tier === 'pro' && !isExpired) {
    return null;
  }

  // Trial user with days remaining
  if (tier === 'trial' && !isExpired && daysRemaining !== undefined && daysRemaining > 0) {
    return (
      <div
        className={cn(
          'flex items-center justify-between gap-4 px-4 py-3 rounded-lg',
          daysRemaining <= 2
            ? 'bg-[#F59E0B]/10 border border-[#F59E0B]/30'
            : 'bg-[#D97706]/10 border border-[#D97706]/30',
          className
        )}
      >
        <div className="flex items-center gap-3">
          <Clock className={cn('h-5 w-5', daysRemaining <= 2 ? 'text-[#F59E0B]' : 'text-[#D97706]')} />
          <div>
            <p className="font-mono text-sm text-[#E5E5E5]">
              {daysRemaining === 1 ? (
                <span className="text-[#F59E0B]">Last day of your trial!</span>
              ) : (
                <>
                  <span className="text-[#D97706] font-medium">{daysRemaining} days</span> left in your trial
                </>
              )}
            </p>
            <p className="font-mono text-xs text-[#737373]">Subscribe to keep full access</p>
          </div>
        </div>
        <Link
          href="/pricing"
          className="px-4 py-2 bg-[#D97706] hover:bg-[#B45309] text-white rounded-lg font-mono text-sm font-medium transition-colors"
        >
          Subscribe Now
        </Link>
      </div>
    );
  }

  // Expired trial or subscription
  if (isExpired) {
    return (
      <div
        className={cn(
          'flex items-center justify-between gap-4 px-4 py-3 rounded-lg',
          'bg-[#EF4444]/10 border border-[#EF4444]/30',
          className
        )}
      >
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-[#EF4444]" />
          <div>
            <p className="font-mono text-sm text-[#E5E5E5]">
              <span className="text-[#EF4444]">Your {tier === 'trial' ? 'trial' : 'subscription'} has expired</span>
            </p>
            <p className="font-mono text-xs text-[#737373]">Subscribe to regain access to all stages</p>
          </div>
        </div>
        <Link
          href="/pricing"
          className="px-4 py-2 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-lg font-mono text-sm font-medium transition-colors"
        >
          Reactivate
        </Link>
      </div>
    );
  }

  // Free user - show upgrade prompt
  if (tier === 'free') {
    return (
      <div
        className={cn(
          'flex items-center justify-between gap-4 px-4 py-3 rounded-lg',
          'bg-[#333] border border-[#444]',
          className
        )}
      >
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-[#D97706]" />
          <div>
            <p className="font-mono text-sm text-[#E5E5E5]">Unlock all 4 stages with a free trial</p>
            <p className="font-mono text-xs text-[#737373]">7 days free, then 29 GEL/month</p>
          </div>
        </div>
        <Link
          href="/pricing"
          className="px-4 py-2 bg-[#D97706] hover:bg-[#B45309] text-white rounded-lg font-mono text-sm font-medium transition-colors"
        >
          Start Free Trial
        </Link>
      </div>
    );
  }

  return null;
}
