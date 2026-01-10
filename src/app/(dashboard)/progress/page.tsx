'use client';

import { useRouter } from 'next/navigation';
import { TerminalWindow } from '@/components/terminal/terminal-window';
import { TerminalLine } from '@/components/terminal/terminal-line';
import { SkillTree, StageCard } from '@/components/progression/skill-tree';
import { LevelProgress, LevelBadge } from '@/components/gamification/level-progress';
import { XPDisplay } from '@/components/gamification/xp-display';
import { StreakBadge } from '@/components/gamification/streak-badge';
import { trpc } from '@/lib/trpc/client';

export default function ProgressPage() {
  const router = useRouter();
  const { data: overview, isLoading: overviewLoading } = trpc.progress.getOverview.useQuery();
  const { data: skillTree, isLoading: skillTreeLoading } = trpc.progress.getSkillTree.useQuery();

  const handleSkillClick = (skillId: string, stageId: number) => {
    router.push(`/?stage=${stageId}&skill=${skillId}`);
  };

  if (overviewLoading || skillTreeLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <TerminalWindow title="~/progress">
          <TerminalLine prefixColor="muted" animate>
            loading progress data...
          </TerminalLine>
        </TerminalWindow>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <TerminalWindow title="~/progress/stats">
        <div className="space-y-6">
          <TerminalLine prefix=">" prefixColor="accent">
            your progress overview
          </TerminalLine>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Level & XP */}
            <div className="p-4 bg-[#2D2D2D] rounded-lg border border-[#333]">
              <div className="flex items-center justify-between mb-3">
                <LevelBadge level={overview?.level || 1} size="md" />
                <XPDisplay xp={overview?.totalXP || 0} size="sm" />
              </div>
              <LevelProgress totalXP={overview?.totalXP || 0} size="sm" />
            </div>

            {/* Current Stage */}
            <div className="p-4 bg-[#2D2D2D] rounded-lg border border-[#333]">
              <p className="text-xs text-[#737373] mb-1">current stage</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-[#E5E5E5]">{overview?.currentStage || 1}</span>
                <span className="text-sm text-[#A3A3A3]">
                  {overview?.currentStage === 1 && 'Prompting'}
                  {overview?.currentStage === 2 && 'Structuring'}
                  {overview?.currentStage === 3 && 'Automation'}
                  {overview?.currentStage === 4 && 'Vibe Coding'}
                </span>
              </div>
            </div>

            {/* Streak */}
            <div className="p-4 bg-[#2D2D2D] rounded-lg border border-[#333]">
              <p className="text-xs text-[#737373] mb-1">streak</p>
              <div className="flex items-center justify-between">
                <StreakBadge
                  days={overview?.streak.currentStreak || 0}
                  isActiveToday={overview?.streak.isActiveToday || false}
                  size="lg"
                />
                <div className="text-right">
                  <p className="text-xs text-[#737373]">longest</p>
                  <p className="text-sm text-[#A3A3A3]">{overview?.streak.longestStreak || 0} days</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TerminalWindow>

      {/* Stage Cards */}
      <TerminalWindow title="~/progress/stages">
        <div className="space-y-4">
          <TerminalLine prefix=">" prefixColor="accent">
            stage progression
          </TerminalLine>

          <div className="grid md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((stageNum) => {
              const stageData = skillTree?.stages.find((s) => s.id === stageNum);
              const stageSkills = stageData?.skills || [];
              const completedSkills = stageSkills.filter((skill) => {
                const progress = skillTree?.userProgress.find((p) => p.skillId === skill.id);
                return progress && (progress.scenariosCompleted || 0) >= skill.scenariosRequired;
              }).length;

              return (
                <StageCard
                  key={stageNum}
                  stageNumber={stageNum}
                  isUnlocked={stageNum <= (overview?.currentStage || 1)}
                  completedSkills={completedSkills}
                  totalSkills={stageSkills.length}
                  onClick={() => router.push(`/?stage=${stageNum}`)}
                />
              );
            })}
          </div>
        </div>
      </TerminalWindow>

      {/* Skill Tree */}
      <TerminalWindow title="~/progress/skills">
        <div className="space-y-4">
          <TerminalLine prefix=">" prefixColor="accent">
            skill tree
          </TerminalLine>

          <TerminalLine prefixColor="muted">
            complete scenarios to master skills and unlock new stages
          </TerminalLine>

          {skillTree && (
            <SkillTree
              userProgress={skillTree.userProgress.map(p => ({
                skillId: p.skillId,
                scenariosCompleted: p.scenariosCompleted || 0,
                isUnlocked: p.isUnlocked || false,
                masteryLevel: p.masteryLevel || 0,
              }))}
              currentStage={skillTree.currentStage}
              onSkillClick={handleSkillClick}
              className="mt-4"
            />
          )}
        </div>
      </TerminalWindow>
    </div>
  );
}
