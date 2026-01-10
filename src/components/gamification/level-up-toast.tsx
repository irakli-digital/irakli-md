'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';
import { getLevelTitle } from '@/lib/gamification/xp';

interface LevelUpToastProps {
  newLevel: number;
  onClose: () => void;
}

export function LevelUpToast({ newLevel, onClose }: LevelUpToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const title = getLevelTitle(newLevel);

  useEffect(() => {
    // Trigger animation
    setTimeout(() => setIsVisible(true), 50);

    // Auto-close after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300',
        isVisible ? 'opacity-100' : 'opacity-0'
      )}
      onClick={() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }}
    >
      <div
        className={cn(
          'bg-[#252525] border-2 border-[#D97706] rounded-xl p-8 text-center font-mono transform transition-all duration-500',
          isVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
        )}
      >
        {/* Stars animation */}
        <div className="flex justify-center gap-2 mb-4">
          {[...Array(3)].map((_, i) => (
            <Star
              key={i}
              className={cn(
                'h-8 w-8 text-[#D97706] fill-current transition-all duration-500',
                isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
              )}
              style={{ transitionDelay: `${i * 100 + 200}ms` }}
            />
          ))}
        </div>

        <h2 className="text-2xl font-bold text-[#D97706] mb-2">LEVEL UP!</h2>

        <div className="text-5xl font-bold text-[#E5E5E5] mb-2">{newLevel}</div>

        <p className="text-[#A3A3A3] mb-4">{title}</p>

        <pre className="text-[#D97706] text-xs leading-tight">
{`  ╔═══════════════╗
  ║  LEVEL ${String(newLevel).padStart(2, ' ')}     ║
  ║  ACHIEVED!    ║
  ╚═══════════════╝`}
        </pre>

        <p className="text-xs text-[#737373] mt-4">click anywhere to continue</p>
      </div>
    </div>
  );
}

interface AchievementToastProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  onClose: () => void;
}

export function AchievementToast({ title, description, icon, onClose }: AchievementToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 50);

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-50 transform transition-all duration-300',
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      )}
    >
      <div className="bg-[#252525] border border-[#D97706] rounded-lg p-4 font-mono shadow-lg max-w-sm">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#D97706]/20 flex items-center justify-center text-[#D97706]">
            {icon || <Star className="h-5 w-5 fill-current" />}
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#D97706]">{title}</h4>
            <p className="text-xs text-[#A3A3A3]">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
