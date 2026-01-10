'use client';

import { cn } from '@/lib/utils';
import { getRarityColor } from '@/lib/gamification/achievements';

interface AchievementBadgeProps {
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlockedAt?: Date | string | null;
  xpReward: number;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  className?: string;
}

export function AchievementBadge({
  name,
  description,
  icon,
  rarity,
  unlocked,
  unlockedAt,
  xpReward,
  size = 'md',
  showDetails = true,
  className,
}: AchievementBadgeProps) {
  const rarityColor = getRarityColor(rarity);

  const sizeClasses = {
    sm: { icon: 'text-2xl', card: 'p-2', name: 'text-xs', desc: 'text-[10px]' },
    md: { icon: 'text-3xl', card: 'p-3', name: 'text-sm', desc: 'text-xs' },
    lg: { icon: 'text-4xl', card: 'p-4', name: 'text-base', desc: 'text-sm' },
  };

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return null;
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div
      className={cn(
        'rounded-lg border font-mono transition-all duration-200',
        sizeClasses[size].card,
        unlocked
          ? 'bg-[#1A1A1A] border-[#333] hover:border-[#444]'
          : 'bg-[#0D0D0D] border-[#222] opacity-50 grayscale',
        className
      )}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={cn(
            'flex items-center justify-center rounded-lg',
            size === 'sm' ? 'h-10 w-10' : size === 'md' ? 'h-12 w-12' : 'h-14 w-14',
            unlocked ? 'bg-[#252525]' : 'bg-[#1A1A1A]'
          )}
          style={{
            boxShadow: unlocked ? `0 0 20px ${rarityColor}30` : 'none',
            border: unlocked ? `1px solid ${rarityColor}50` : '1px solid #333',
          }}
        >
          <span className={sizeClasses[size].icon}>{unlocked ? icon : '?'}</span>
        </div>

        {/* Details */}
        {showDetails && (
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3
                className={cn(
                  'font-semibold truncate',
                  sizeClasses[size].name,
                  unlocked ? 'text-[#E5E5E5]' : 'text-[#737373]'
                )}
              >
                {name}
              </h3>
              <RarityBadge rarity={rarity} />
            </div>
            <p
              className={cn(
                'mt-0.5 line-clamp-2',
                sizeClasses[size].desc,
                unlocked ? 'text-[#A3A3A3]' : 'text-[#525252]'
              )}
            >
              {description}
            </p>
            <div className="flex items-center gap-3 mt-1.5">
              <span
                className={cn(
                  'font-medium',
                  sizeClasses[size].desc,
                  unlocked ? 'text-[#D97706]' : 'text-[#525252]'
                )}
              >
                +{xpReward} XP
              </span>
              {unlocked && unlockedAt && (
                <span className={cn('text-[#525252]', sizeClasses[size].desc)}>
                  {formatDate(unlockedAt)}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface RarityBadgeProps {
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  className?: string;
}

export function RarityBadge({ rarity, className }: RarityBadgeProps) {
  const rarityColor = getRarityColor(rarity);
  const label = rarity.charAt(0).toUpperCase() + rarity.slice(1);

  return (
    <span
      className={cn(
        'px-1.5 py-0.5 text-[10px] font-semibold rounded uppercase tracking-wide',
        className
      )}
      style={{
        backgroundColor: `${rarityColor}20`,
        color: rarityColor,
      }}
    >
      {label}
    </span>
  );
}

interface AchievementGridProps {
  achievements: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    xpReward: number;
    unlocked: boolean;
    unlockedAt?: Date | string | null;
  }>;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AchievementGrid({ achievements, size = 'md', className }: AchievementGridProps) {
  return (
    <div
      className={cn(
        'grid gap-3',
        size === 'sm' ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2',
        className
      )}
    >
      {achievements.map((achievement) => (
        <AchievementBadge key={achievement.id} {...achievement} size={size} />
      ))}
    </div>
  );
}
