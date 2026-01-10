'use client';

import { cn } from '@/lib/utils';
import { Clock, CheckCircle2, Lock } from 'lucide-react';
import type { PublicLesson } from '@/types/lesson';

interface ScenarioCardProps {
  lesson: PublicLesson;
  status?: 'locked' | 'available' | 'in-progress' | 'completed';
  bestScore?: number;
  onClick?: () => void;
}

const stageColors = {
  1: { border: 'border-[#3B82F6]', bg: 'bg-[#3B82F6]/10', text: 'text-[#3B82F6]' },
  2: { border: 'border-[#8B5CF6]', bg: 'bg-[#8B5CF6]/10', text: 'text-[#8B5CF6]' },
  3: { border: 'border-[#F59E0B]', bg: 'bg-[#F59E0B]/10', text: 'text-[#F59E0B]' },
  4: { border: 'border-[#10B981]', bg: 'bg-[#10B981]/10', text: 'text-[#10B981]' },
};

export function ScenarioCard({
  lesson,
  status = 'available',
  bestScore,
  onClick,
}: ScenarioCardProps) {
  const colors = stageColors[lesson.meta.stage];

  return (
    <div
      onClick={status !== 'locked' ? onClick : undefined}
      className={cn(
        'rounded-lg border bg-[#252525] p-4 font-mono transition-all',
        colors.border,
        status === 'locked' && 'opacity-50 cursor-not-allowed',
        status !== 'locked' && 'cursor-pointer hover:bg-[#2D2D2D] hover:shadow-lg',
        status === 'completed' && 'border-[#22C55E]'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className={cn('text-xs px-2 py-0.5 rounded', colors.bg, colors.text)}>
          stage {lesson.meta.stage}
        </span>
        {status === 'locked' && <Lock className="h-4 w-4 text-[#737373]" />}
        {status === 'completed' && <CheckCircle2 className="h-4 w-4 text-[#22C55E]" />}
      </div>

      {/* Title */}
      <h3 className="text-[#E5E5E5] font-medium mb-1">{lesson.scenario.title}</h3>
      <p className="text-xs text-[#737373] mb-3">{lesson.meta.skill}</p>

      {/* Context preview */}
      <p className="text-xs text-[#A3A3A3] line-clamp-2 mb-3">{lesson.scenario.context}</p>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-[#737373]">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{lesson.meta.estimatedMinutes} min</span>
        </div>
        {bestScore !== undefined && (
          <span className={cn(bestScore >= 70 ? 'text-[#22C55E]' : 'text-[#F59E0B]')}>
            best: {bestScore}%
          </span>
        )}
      </div>
    </div>
  );
}
