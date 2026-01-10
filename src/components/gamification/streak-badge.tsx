'use client';

import { cn } from '@/lib/utils';
import { Flame } from 'lucide-react';
import { getStreakMessage, getStreakEmoji } from '@/lib/gamification/streaks';

interface StreakBadgeProps {
  days: number;
  isActiveToday: boolean;
  size?: 'sm' | 'md' | 'lg';
  showMessage?: boolean;
  className?: string;
}

export function StreakBadge({
  days,
  isActiveToday,
  size = 'md',
  showMessage = false,
  className,
}: StreakBadgeProps) {
  const emoji = getStreakEmoji(days, isActiveToday);
  const message = getStreakMessage(days);

  const sizeClasses = {
    sm: { text: 'text-xs', icon: 'h-3 w-3', padding: 'px-2 py-0.5' },
    md: { text: 'text-sm', icon: 'h-4 w-4', padding: 'px-3 py-1' },
    lg: { text: 'text-base', icon: 'h-5 w-5', padding: 'px-4 py-1.5' },
  };

  const isAtRisk = !isActiveToday && days > 0;

  return (
    <div className={cn('font-mono', className)}>
      <div
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full font-medium',
          sizeClasses[size].padding,
          sizeClasses[size].text,
          days === 0
            ? 'bg-[#333] text-[#737373]'
            : isAtRisk
              ? 'bg-[#F59E0B]/20 text-[#F59E0B] animate-pulse'
              : 'bg-[#EF4444]/20 text-[#EF4444]'
        )}
      >
        <Flame className={cn(sizeClasses[size].icon, days > 0 && 'fill-current')} />
        <span>{days}</span>
        {days > 0 && <span className="ml-0.5">{emoji}</span>}
      </div>
      {showMessage && (
        <p className={cn('mt-1 text-[#737373]', sizeClasses[size].text)}>{message}</p>
      )}
    </div>
  );
}

interface StreakWarningProps {
  className?: string;
}

export function StreakWarning({ className }: StreakWarningProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-2 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-lg font-mono text-sm',
        className
      )}
    >
      <Flame className="h-4 w-4 text-[#F59E0B] animate-pulse" />
      <span className="text-[#F59E0B]">Complete a scenario to keep your streak!</span>
    </div>
  );
}
