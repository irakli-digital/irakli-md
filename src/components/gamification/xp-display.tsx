'use client';

import { cn } from '@/lib/utils';
import { Zap } from 'lucide-react';

interface XPDisplayProps {
  xp: number;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function XPDisplay({ xp, showIcon = true, size = 'md', className }: XPDisplayProps) {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <div className={cn('flex items-center gap-1 font-mono text-[#D97706]', sizeClasses[size], className)}>
      {showIcon && <Zap className={cn(iconSizes[size], 'fill-current')} />}
      <span>{xp.toLocaleString()} XP</span>
    </div>
  );
}

interface XPGainProps {
  amount: number;
  breakdown?: { reason: string; xp: number }[];
  className?: string;
}

export function XPGain({ amount, breakdown, className }: XPGainProps) {
  return (
    <div className={cn('font-mono', className)}>
      <div className="flex items-center gap-2 text-[#22C55E]">
        <Zap className="h-5 w-5 fill-current" />
        <span className="text-lg font-bold">+{amount} XP</span>
      </div>
      {breakdown && breakdown.length > 0 && (
        <div className="mt-2 space-y-1 text-xs text-[#A3A3A3]">
          {breakdown.map((item, i) => (
            <div key={i} className="flex justify-between">
              <span>{item.reason}</span>
              <span className={item.xp >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}>
                {item.xp >= 0 ? '+' : ''}{item.xp}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
