'use client';

import { cn } from '@/lib/utils';
import { calculateLevel, getXPForCurrentLevel, getLevelTitle } from '@/lib/gamification/xp';

interface LevelProgressProps {
  totalXP: number;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LevelProgress({ totalXP, showDetails = true, size = 'md', className }: LevelProgressProps) {
  const level = calculateLevel(totalXP);
  const { current, required, progress } = getXPForCurrentLevel(totalXP);
  const title = getLevelTitle(level);

  const sizeClasses = {
    sm: { text: 'text-xs', bar: 'h-1.5', level: 'text-sm' },
    md: { text: 'text-sm', bar: 'h-2', level: 'text-base' },
    lg: { text: 'text-base', bar: 'h-3', level: 'text-lg' },
  };

  return (
    <div className={cn('font-mono', className)}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className={cn('font-bold text-[#D97706]', sizeClasses[size].level)}>
            Lv. {level}
          </span>
          <span className={cn('text-[#737373]', sizeClasses[size].text)}>{title}</span>
        </div>
        {showDetails && (
          <span className={cn('text-[#737373]', sizeClasses[size].text)}>
            {current.toLocaleString()} / {required.toLocaleString()} XP
          </span>
        )}
      </div>
      <div className={cn('bg-[#333] rounded-full overflow-hidden', sizeClasses[size].bar)}>
        <div
          className="h-full bg-gradient-to-r from-[#D97706] to-[#F59E0B] transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

interface LevelBadgeProps {
  level: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LevelBadge({ level, size = 'md', className }: LevelBadgeProps) {
  const title = getLevelTitle(level);

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full bg-[#D97706]/20 text-[#D97706] font-mono font-medium',
        sizeClasses[size],
        className
      )}
    >
      <span>Lv.{level}</span>
      <span className="text-[#A3A3A3]">{title}</span>
    </div>
  );
}
