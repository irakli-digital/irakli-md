'use client';

import { cn } from '@/lib/utils';
import { Lock, CheckCircle2, Circle } from 'lucide-react';
import skillTreeData from '@/../content/skills/skill-tree.json';

interface UserSkillProgress {
  skillId: string;
  scenariosCompleted: number;
  isUnlocked: boolean;
  masteryLevel: number;
}

interface SkillTreeProps {
  userProgress: UserSkillProgress[];
  currentStage: number;
  onSkillClick?: (skillId: string, stageId: number) => void;
  className?: string;
}

export function SkillTree({ userProgress, currentStage, onSkillClick, className }: SkillTreeProps) {
  const getSkillProgress = (skillId: string): UserSkillProgress | undefined => {
    return userProgress.find((p) => p.skillId === skillId);
  };

  const isSkillUnlocked = (skillId: string, stageId: number, prerequisites: string[]): boolean => {
    // Stage must be unlocked
    if (stageId > currentStage) return false;

    // Check prerequisites
    if (prerequisites.length === 0) return true;

    return prerequisites.every((prereqId) => {
      const prereqProgress = getSkillProgress(prereqId);
      return prereqProgress && prereqProgress.scenariosCompleted >= 3;
    });
  };

  const getSkillStatus = (
    skillId: string,
    stageId: number,
    prerequisites: string[],
    scenariosRequired: number
  ): 'locked' | 'available' | 'in-progress' | 'completed' => {
    if (!isSkillUnlocked(skillId, stageId, prerequisites)) return 'locked';

    const progress = getSkillProgress(skillId);
    if (!progress || progress.scenariosCompleted === 0) return 'available';
    if (progress.scenariosCompleted >= scenariosRequired) return 'completed';
    return 'in-progress';
  };

  return (
    <div className={cn('space-y-8', className)}>
      {skillTreeData.stages.map((stage) => (
        <div key={stage.id} className="space-y-4">
          {/* Stage Header */}
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-sm"
              style={{ backgroundColor: `${stage.color}20`, color: stage.color }}
            >
              {stage.id}
            </div>
            <div>
              <h3 className="font-mono font-medium text-[#E5E5E5]">{stage.name}</h3>
              <p className="text-xs text-[#737373]">{stage.description}</p>
            </div>
            {stage.id > currentStage && (
              <Lock className="h-4 w-4 text-[#737373] ml-auto" />
            )}
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 ml-11">
            {stage.skills.map((skill) => {
              const status = getSkillStatus(
                skill.id,
                stage.id,
                skill.prerequisites,
                skill.scenariosRequired
              );
              const progress = getSkillProgress(skill.id);
              const completedCount = progress?.scenariosCompleted || 0;

              return (
                <button
                  key={skill.id}
                  onClick={() => status !== 'locked' && onSkillClick?.(skill.id, stage.id)}
                  disabled={status === 'locked'}
                  className={cn(
                    'p-3 rounded-lg border text-left font-mono transition-all',
                    status === 'locked' && 'bg-[#1A1A1A] border-[#333] opacity-50 cursor-not-allowed',
                    status === 'available' && 'bg-[#252525] border-[#333] hover:border-[#444] cursor-pointer',
                    status === 'in-progress' && 'bg-[#252525] cursor-pointer',
                    status === 'completed' && 'bg-[#22C55E]/10 border-[#22C55E]/50 cursor-pointer'
                  )}
                  style={{
                    borderColor: status === 'in-progress' ? stage.color : undefined,
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm text-[#E5E5E5]">{skill.name}</span>
                    {status === 'locked' && <Lock className="h-4 w-4 text-[#737373]" />}
                    {status === 'completed' && <CheckCircle2 className="h-4 w-4 text-[#22C55E]" />}
                    {status === 'available' && <Circle className="h-4 w-4 text-[#737373]" />}
                    {status === 'in-progress' && (
                      <span className="text-xs" style={{ color: stage.color }}>
                        {completedCount}/{skill.scenariosRequired}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#737373] line-clamp-2">{skill.description}</p>

                  {/* Progress bar for in-progress */}
                  {status === 'in-progress' && (
                    <div className="mt-2 h-1 bg-[#333] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${(completedCount / skill.scenariosRequired) * 100}%`,
                          backgroundColor: stage.color,
                        }}
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

interface StageCardProps {
  stageNumber: number;
  isUnlocked: boolean;
  completedSkills: number;
  totalSkills: number;
  onClick?: () => void;
  className?: string;
}

export function StageCard({
  stageNumber,
  isUnlocked,
  completedSkills,
  totalSkills,
  onClick,
  className,
}: StageCardProps) {
  const stage = skillTreeData.stages.find((s) => s.id === stageNumber);
  if (!stage) return null;

  const progress = totalSkills > 0 ? (completedSkills / totalSkills) * 100 : 0;
  const isComplete = completedSkills >= totalSkills;

  return (
    <button
      onClick={isUnlocked ? onClick : undefined}
      disabled={!isUnlocked}
      className={cn(
        'p-4 rounded-lg border text-left font-mono transition-all w-full',
        !isUnlocked && 'bg-[#1A1A1A] border-[#333] opacity-50 cursor-not-allowed',
        isUnlocked && !isComplete && 'bg-[#252525] border-[#333] hover:border-[#444] cursor-pointer',
        isComplete && 'bg-[#22C55E]/10 border-[#22C55E]/50 cursor-pointer',
        className
      )}
    >
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center font-bold"
          style={{ backgroundColor: `${stage.color}20`, color: stage.color }}
        >
          {stage.id}
        </div>
        <div className="flex-1">
          <h3 className="text-[#E5E5E5] font-medium">{stage.name}</h3>
          <p className="text-xs text-[#737373]">{stage.description}</p>
        </div>
        {!isUnlocked && <Lock className="h-5 w-5 text-[#737373]" />}
        {isComplete && <CheckCircle2 className="h-5 w-5 text-[#22C55E]" />}
      </div>

      {isUnlocked && (
        <>
          <div className="flex justify-between text-xs text-[#737373] mb-1">
            <span>Progress</span>
            <span>
              {completedSkills}/{totalSkills} skills
            </span>
          </div>
          <div className="h-2 bg-[#333] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${progress}%`,
                backgroundColor: isComplete ? '#22C55E' : stage.color,
              }}
            />
          </div>
        </>
      )}

      {isUnlocked && (
        <p className="text-xs text-[#D97706] mt-2">
          {isComplete ? `Certification: ${stage.certification}` : 'In progress...'}
        </p>
      )}
    </button>
  );
}
