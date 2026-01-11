'use client';

import { useRouter } from 'next/navigation';
import { TerminalWindow } from '@/components/terminal/terminal-window';
import { TerminalLine } from '@/components/terminal/terminal-line';
import { ScenarioCard } from '@/components/scenario/scenario-card';
import { LevelProgress, LevelBadge } from '@/components/gamification/level-progress';
import { XPDisplay } from '@/components/gamification/xp-display';
import { StreakBadge, StreakWarning } from '@/components/gamification/streak-badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { trpc } from '@/lib/trpc/client';

export default function DashboardPage() {
  const router = useRouter();
  const { data: scenarios, isLoading } = trpc.scenario.getAvailable.useQuery();
  const { data: progress } = trpc.progress.getOverview.useQuery();

  const stageDescriptions: Record<number, string> = {
    1: 'prompting - get correct reasoning and output shape from AI',
    2: 'structuring - turn AI output into machine-usable structure',
    3: 'automation - wire AI into workflows',
    4: 'vibe coding - ship real products with AI',
  };

  return (
    <div className="space-y-8">
      {/* Stats Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 bg-[#252525] rounded-lg border border-[#333]">
        <div className="flex flex-wrap items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <LevelBadge level={progress?.level || 1} size="md" />
            <XPDisplay xp={progress?.totalXP || 0} size="md" />
          </div>
          <StreakBadge
            days={progress?.streak.currentStreak || 0}
            isActiveToday={progress?.streak.isActiveToday || false}
            size="md"
          />
        </div>
        <Button
          onClick={() => router.push('/progress')}
          variant="ghost"
          size="sm"
          className="text-[#D97706] hover:text-[#F59E0B] hover:bg-[#D97706]/10 font-mono text-xs sm:text-sm"
        >
          view progress
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* Streak Warning */}
      {progress && !progress.streak.isActiveToday && progress.streak.currentStreak > 0 && (
        <StreakWarning />
      )}

      {/* Welcome Section */}
      <TerminalWindow title="~/dashboard">
        <div className="space-y-4">
          {/* ASCII banner - hidden on mobile */}
          <pre className="hidden sm:block text-[#D97706] text-xs leading-tight">
{`   █████╗ ██╗    ██╗     ██╗████████╗
  ██╔══██╗██║    ██║     ██║╚══██╔══╝
  ███████║██║    ██║     ██║   ██║
  ██╔══██║██║    ██║     ██║   ██║
  ██║  ██║██║    ███████╗██║   ██║
  ╚═╝  ╚═╝╚═╝    ╚══════╝╚═╝   ╚═╝   `}
          </pre>
          {/* Mobile title */}
          <h1 className="sm:hidden text-xl font-bold text-[#D97706] font-mono">AI_LIT</h1>

          <TerminalLine prefix=">" prefixColor="accent">
            welcome back. ready to practice?
          </TerminalLine>

          {/* Level Progress */}
          <div className="mt-4 p-3 bg-[#2D2D2D] rounded border border-[#333]">
            <LevelProgress totalXP={progress?.totalXP || 0} size="md" />
          </div>
        </div>
      </TerminalWindow>

      {/* Stage Overview */}
      <TerminalWindow title="~/stages">
        <div className="space-y-3">
          <TerminalLine prefix="info:" prefixColor="muted">
            master each stage to become an AI practitioner
          </TerminalLine>
          <div className="grid md:grid-cols-2 gap-3 mt-4">
            {[1, 2, 3, 4].map((stage) => (
              <div
                key={stage}
                className="p-3 bg-[#2D2D2D] rounded border border-[#333] hover:border-[#444] transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-xs px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: `${
                        stage === 1 ? '#3B82F6' :
                        stage === 2 ? '#8B5CF6' :
                        stage === 3 ? '#F59E0B' :
                        '#10B981'
                      }20`,
                      color:
                        stage === 1 ? '#3B82F6' :
                        stage === 2 ? '#8B5CF6' :
                        stage === 3 ? '#F59E0B' :
                        '#10B981',
                    }}
                  >
                    stage {stage}
                  </span>
                  {stage > 1 && (
                    <span className="text-xs text-[#737373]">locked</span>
                  )}
                </div>
                <p className="text-sm text-[#A3A3A3]">{stageDescriptions[stage]}</p>
              </div>
            ))}
          </div>
        </div>
      </TerminalWindow>

      {/* Available Scenarios */}
      <TerminalWindow title="~/scenarios">
        <div className="space-y-4">
          <TerminalLine prefix=">" prefixColor="accent">
            available scenarios
          </TerminalLine>

          {isLoading ? (
            <TerminalLine prefixColor="muted" animate>
              loading scenarios...
            </TerminalLine>
          ) : scenarios && scenarios.length > 0 ? (
            <div className="grid gap-4 mt-4">
              {scenarios.map((scenario) => (
                <ScenarioCard
                  key={scenario.id}
                  lesson={scenario}
                  onClick={() => router.push(`/scenarios/${scenario.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2 mt-4">
              <TerminalLine prefix="error:" prefixColor="error">
                no scenarios found
              </TerminalLine>
              <TerminalLine prefixColor="muted">
                scenarios will appear here once lessons are added to /content/lessons/
              </TerminalLine>
            </div>
          )}
        </div>
      </TerminalWindow>
    </div>
  );
}
