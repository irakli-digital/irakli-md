'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { getRarityColor } from '@/lib/gamification/achievements';
import { Trophy, X } from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface AchievementToastProps {
  achievement: Achievement;
  onClose: () => void;
  duration?: number;
  className?: string;
}

export function AchievementToast({
  achievement,
  onClose,
  duration = 5000,
  className,
}: AchievementToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const rarityColor = getRarityColor(achievement.rarity);

  useEffect(() => {
    // Animate in
    const showTimer = setTimeout(() => setIsVisible(true), 50);

    // Auto-dismiss
    const hideTimer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onClose, 300);
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [duration, onClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={cn(
        'fixed bottom-20 right-4 z-50 font-mono transition-all duration-300 transform',
        isVisible && !isExiting ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
        className
      )}
    >
      <div
        className="relative overflow-hidden rounded-lg border bg-[#1A1A1A] shadow-lg"
        style={{
          borderColor: `${rarityColor}50`,
          boxShadow: `0 0 30px ${rarityColor}30`,
        }}
      >
        {/* Animated glow background */}
        <div
          className="absolute inset-0 opacity-10 animate-pulse"
          style={{ backgroundColor: rarityColor }}
        />

        <div className="relative p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4" style={{ color: rarityColor }} />
              <span className="text-xs font-semibold uppercase tracking-wide text-[#A3A3A3]">
                Achievement Unlocked
              </span>
            </div>
            <button
              onClick={handleClose}
              className="p-1 rounded hover:bg-[#333] transition-colors"
            >
              <X className="h-3 w-3 text-[#737373]" />
            </button>
          </div>

          {/* Achievement info */}
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center h-12 w-12 rounded-lg bg-[#252525]"
              style={{
                border: `1px solid ${rarityColor}50`,
                boxShadow: `0 0 15px ${rarityColor}30`,
              }}
            >
              <span className="text-2xl">{achievement.icon}</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[#E5E5E5]">{achievement.name}</h3>
              <p className="text-xs text-[#A3A3A3] line-clamp-1">{achievement.description}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-medium text-[#D97706]">
                  +{achievement.xpReward} XP
                </span>
                <span
                  className="px-1.5 py-0.5 text-[10px] font-semibold rounded uppercase tracking-wide"
                  style={{
                    backgroundColor: `${rarityColor}20`,
                    color: rarityColor,
                  }}
                >
                  {achievement.rarity}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar animation */}
        <div className="h-0.5 bg-[#333]">
          <div
            className="h-full transition-all ease-linear"
            style={{
              backgroundColor: rarityColor,
              width: isVisible && !isExiting ? '0%' : '100%',
              transitionDuration: `${duration}ms`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

interface AchievementToastContainerProps {
  achievements: Achievement[];
  onDismiss: (id: string) => void;
}

export function AchievementToastContainer({
  achievements,
  onDismiss,
}: AchievementToastContainerProps) {
  if (achievements.length === 0) return null;

  // Only show the first achievement (queue the rest)
  const currentAchievement = achievements[0];

  return (
    <AchievementToast
      key={currentAchievement.id}
      achievement={currentAchievement}
      onClose={() => onDismiss(currentAchievement.id)}
    />
  );
}
