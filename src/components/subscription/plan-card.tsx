'use client';

import { cn } from '@/lib/utils';
import { Check, Sparkles, Zap } from 'lucide-react';
import type { SubscriptionPlan } from '@/lib/flitt/types';

interface PlanCardProps {
  plan: SubscriptionPlan;
  isCurrentPlan?: boolean;
  isFeatured?: boolean;
  onSelect: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  buttonText?: string;
}

export function PlanCard({
  plan,
  isCurrentPlan,
  isFeatured,
  onSelect,
  isLoading,
  disabled,
  buttonText,
}: PlanCardProps) {
  return (
    <div
      className={cn(
        'relative flex flex-col p-6 rounded-lg border transition-all',
        isFeatured
          ? 'border-[#D97706] bg-[#D97706]/5 shadow-lg shadow-[#D97706]/10'
          : 'border-[#333] bg-[#252525]',
        isCurrentPlan && 'ring-2 ring-[#D97706]'
      )}
    >
      {/* Featured badge */}
      {isFeatured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#D97706] rounded-full">
          <span className="text-xs font-mono font-medium text-white flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Best Value
          </span>
        </div>
      )}

      {/* Current plan badge */}
      {isCurrentPlan && (
        <div className="absolute -top-3 right-4 px-3 py-1 bg-[#333] rounded-full border border-[#D97706]">
          <span className="text-xs font-mono font-medium text-[#D97706]">Current Plan</span>
        </div>
      )}

      {/* Plan name */}
      <div className="flex items-center gap-2 mb-4">
        <Zap className={cn('h-5 w-5', isFeatured ? 'text-[#D97706]' : 'text-[#737373]')} />
        <h3 className="font-mono font-semibold text-[#E5E5E5]">{plan.name}</h3>
      </div>

      {/* Price */}
      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-[#E5E5E5]">{plan.price}</span>
          <span className="text-lg text-[#737373]">GEL</span>
          <span className="text-sm text-[#737373]">/{plan.interval === 'month' ? 'mo' : 'yr'}</span>
        </div>
        {plan.savings && (
          <span className="inline-block mt-1 px-2 py-0.5 bg-[#22C55E]/10 text-[#22C55E] text-xs font-mono rounded">
            {plan.savings}
          </span>
        )}
      </div>

      {/* Features */}
      <ul className="flex-1 space-y-3 mb-6">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-sm">
            <Check className="h-4 w-4 text-[#22C55E] mt-0.5 flex-shrink-0" />
            <span className="text-[#A3A3A3] font-mono">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <button
        onClick={onSelect}
        disabled={disabled || isLoading || isCurrentPlan}
        className={cn(
          'w-full py-3 px-4 rounded-lg font-mono font-medium text-sm transition-all',
          isFeatured
            ? 'bg-[#D97706] text-white hover:bg-[#B45309] disabled:bg-[#D97706]/50'
            : 'bg-[#333] text-[#E5E5E5] hover:bg-[#444] disabled:bg-[#333]/50',
          (disabled || isCurrentPlan) && 'cursor-not-allowed opacity-50'
        )}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
            Processing...
          </span>
        ) : isCurrentPlan ? (
          'Current Plan'
        ) : (
          buttonText || 'Subscribe'
        )}
      </button>
    </div>
  );
}

interface FreePlanCardProps {
  isCurrentPlan?: boolean;
}

export function FreePlanCard({ isCurrentPlan }: FreePlanCardProps) {
  return (
    <div
      className={cn(
        'relative flex flex-col p-6 rounded-lg border border-[#333] bg-[#1A1A1A]',
        isCurrentPlan && 'ring-2 ring-[#737373]'
      )}
    >
      {isCurrentPlan && (
        <div className="absolute -top-3 right-4 px-3 py-1 bg-[#333] rounded-full">
          <span className="text-xs font-mono font-medium text-[#737373]">Current</span>
        </div>
      )}

      <div className="flex items-center gap-2 mb-4">
        <Zap className="h-5 w-5 text-[#737373]" />
        <h3 className="font-mono font-semibold text-[#A3A3A3]">Free</h3>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-[#A3A3A3]">0</span>
          <span className="text-lg text-[#737373]">GEL</span>
        </div>
        <span className="text-xs text-[#737373] font-mono">Forever free</span>
      </div>

      <ul className="flex-1 space-y-3 mb-6">
        <li className="flex items-start gap-2 text-sm">
          <Check className="h-4 w-4 text-[#737373] mt-0.5 flex-shrink-0" />
          <span className="text-[#737373] font-mono">Stage 1 - Prompting (15 scenarios)</span>
        </li>
        <li className="flex items-start gap-2 text-sm">
          <Check className="h-4 w-4 text-[#737373] mt-0.5 flex-shrink-0" />
          <span className="text-[#737373] font-mono">Basic AI feedback</span>
        </li>
        <li className="flex items-start gap-2 text-sm">
          <Check className="h-4 w-4 text-[#737373] mt-0.5 flex-shrink-0" />
          <span className="text-[#737373] font-mono">Progress tracking</span>
        </li>
      </ul>

      <div className="py-3 px-4 rounded-lg bg-[#252525] text-center">
        <span className="text-sm font-mono text-[#737373]">
          {isCurrentPlan ? 'Your current plan' : 'Upgrade to unlock more'}
        </span>
      </div>
    </div>
  );
}

interface TrialCardProps {
  onStartTrial: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  hasUsedTrial?: boolean;
}

export function TrialCard({ onStartTrial, isLoading, disabled, hasUsedTrial }: TrialCardProps) {
  if (hasUsedTrial) {
    return null;
  }

  return (
    <div className="p-6 rounded-lg border border-dashed border-[#D97706]/50 bg-[#D97706]/5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-[#D97706]" />
            <h3 className="font-mono font-semibold text-[#E5E5E5]">7-Day Free Trial</h3>
          </div>
          <p className="text-sm text-[#A3A3A3] font-mono">
            Get full access to all stages. Card required, cancel anytime before trial ends.
          </p>
        </div>
        <button
          onClick={onStartTrial}
          disabled={disabled || isLoading}
          className={cn(
            'px-6 py-3 rounded-lg font-mono font-medium text-sm transition-all',
            'bg-[#D97706] text-white hover:bg-[#B45309]',
            'disabled:bg-[#D97706]/50 disabled:cursor-not-allowed'
          )}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
              Processing...
            </span>
          ) : (
            'Start Free Trial'
          )}
        </button>
      </div>
    </div>
  );
}
