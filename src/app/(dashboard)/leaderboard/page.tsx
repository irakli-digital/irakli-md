'use client';

import { useState } from 'react';
import { TerminalWindow } from '@/components/terminal/terminal-window';
import { TerminalLine } from '@/components/terminal/terminal-line';
import {
  Leaderboard,
  LeaderboardTabs,
  TimeRangeTabs,
  type LeaderboardMetric,
} from '@/components/gamification/leaderboard';
import { trpc } from '@/lib/trpc/client';
import { Users } from 'lucide-react';

export default function LeaderboardPage() {
  const [metric, setMetric] = useState<LeaderboardMetric>('xp');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all_time'>('all_time');

  const { data: totalUsers } = trpc.leaderboard.getTotalUsers.useQuery();

  // Fetch leaderboard data based on metric
  const { data: xpData, isLoading: xpLoading } = trpc.leaderboard.getByXP.useQuery(
    { timeRange, limit: 50 },
    { enabled: metric === 'xp' }
  );

  const { data: streakData, isLoading: streakLoading } = trpc.leaderboard.getByStreak.useQuery(
    { type: 'longest', limit: 50 },
    { enabled: metric === 'longest_streak' || metric === 'current_streak' }
  );

  const { data: scenariosData, isLoading: scenariosLoading } =
    trpc.leaderboard.getByScenarios.useQuery(
      { timeRange, limit: 50 },
      { enabled: metric === 'scenarios' }
    );

  const getCurrentData = () => {
    switch (metric) {
      case 'xp':
        return { data: xpData, loading: xpLoading };
      case 'longest_streak':
      case 'current_streak':
        return { data: streakData, loading: streakLoading };
      case 'scenarios':
        return { data: scenariosData, loading: scenariosLoading };
    }
  };

  const { data: currentData, loading: isLoading } = getCurrentData();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#252525] rounded-lg border border-[#333]">
        <div className="flex items-center gap-3">
          <Users className="h-5 w-5 text-[#D97706]" />
          <div>
            <h1 className="font-mono font-semibold text-[#E5E5E5]">Leaderboard</h1>
            <p className="font-mono text-xs text-[#737373]">
              {totalUsers?.totalUsers || 0} practitioners competing
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <TerminalWindow title="~/leaderboard">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <LeaderboardTabs activeMetric={metric} onMetricChange={setMetric} />
            {metric !== 'longest_streak' && metric !== 'current_streak' && (
              <TimeRangeTabs activeRange={timeRange} onRangeChange={setTimeRange} />
            )}
          </div>

          <TerminalLine prefix="info:" prefixColor="muted">
            {metric === 'xp'
              ? 'ranked by total experience points earned'
              : metric === 'longest_streak'
                ? 'ranked by longest practice streak achieved'
                : 'ranked by scenarios completed'}
          </TerminalLine>
        </div>
      </TerminalWindow>

      {/* Leaderboard */}
      <TerminalWindow title="~/rankings">
        {isLoading ? (
          <div className="space-y-2">
            <TerminalLine prefixColor="muted" animate>
              loading rankings...
            </TerminalLine>
          </div>
        ) : currentData ? (
          <Leaderboard
            entries={currentData.leaders}
            metric={currentData.metric}
            timeRange={currentData.timeRange}
            currentUserEntry={currentData.currentUserRank}
          />
        ) : (
          <div className="text-center py-8">
            <p className="text-[#737373] font-mono text-sm">No rankings available</p>
          </div>
        )}
      </TerminalWindow>

      {/* Tips */}
      <TerminalWindow title="~/tips">
        <div className="space-y-2">
          <TerminalLine prefix=">" prefixColor="accent">
            how to climb the leaderboard
          </TerminalLine>
          <ul className="mt-3 space-y-2 text-sm font-mono text-[#A3A3A3]">
            <li className="flex items-start gap-2">
              <span className="text-[#D97706]">1.</span>
              <span>
                Complete scenarios daily to maintain your streak and earn bonus XP
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#D97706]">2.</span>
              <span>Score 90+ to get excellent score bonuses</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#D97706]">3.</span>
              <span>Pass on first attempt for extra XP rewards</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#D97706]">4.</span>
              <span>Unlock achievements to earn bonus XP</span>
            </li>
          </ul>
        </div>
      </TerminalWindow>
    </div>
  );
}
