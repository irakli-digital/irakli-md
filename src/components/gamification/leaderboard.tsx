'use client';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Crown, Medal, Award, TrendingUp, Flame, Target } from 'lucide-react';

export type LeaderboardMetric = 'xp' | 'current_streak' | 'longest_streak' | 'scenarios';

interface LeaderboardEntry {
  rank: number;
  id: string;
  displayName: string;
  avatarUrl: string | null;
  score: number;
  level: number;
  levelTitle: string;
  isCurrentUser: boolean;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  metric: LeaderboardMetric;
  timeRange: 'week' | 'month' | 'all_time';
  currentUserEntry?: LeaderboardEntry | null;
  className?: string;
}

export function Leaderboard({
  entries,
  metric,
  timeRange,
  currentUserEntry,
  className,
}: LeaderboardProps) {
  const getMetricLabel = () => {
    switch (metric) {
      case 'xp':
        return 'XP';
      case 'current_streak':
        return 'Current Streak';
      case 'longest_streak':
        return 'Longest Streak';
      case 'scenarios':
        return 'Scenarios';
    }
  };

  const getMetricIcon = () => {
    switch (metric) {
      case 'xp':
        return <TrendingUp className="h-4 w-4" />;
      case 'current_streak':
      case 'longest_streak':
        return <Flame className="h-4 w-4" />;
      case 'scenarios':
        return <Target className="h-4 w-4" />;
    }
  };

  const formatScore = (score: number) => {
    if (metric === 'current_streak' || metric === 'longest_streak') {
      return `${score} day${score !== 1 ? 's' : ''}`;
    }
    if (score >= 10000) {
      return `${(score / 1000).toFixed(1)}k`;
    }
    return score.toLocaleString();
  };

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case 'week':
        return 'This Week';
      case 'month':
        return 'This Month';
      case 'all_time':
        return 'All Time';
    }
  };

  return (
    <div className={cn('font-mono', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-[#A3A3A3]">
          {getMetricIcon()}
          <span className="text-sm font-semibold">{getMetricLabel()}</span>
        </div>
        <span className="text-xs text-[#737373]">{getTimeRangeLabel()}</span>
      </div>

      {/* Entries */}
      <div className="space-y-2">
        {entries.map((entry) => (
          <LeaderboardRow
            key={entry.id}
            entry={entry}
            formatScore={formatScore}
          />
        ))}

        {/* Current user if not in list */}
        {currentUserEntry && !entries.some((e) => e.isCurrentUser) && (
          <>
            <div className="my-3 border-t border-dashed border-[#333]" />
            <LeaderboardRow entry={currentUserEntry} formatScore={formatScore} />
          </>
        )}
      </div>

      {entries.length === 0 && (
        <div className="text-center py-8 text-[#737373] text-sm">
          No entries yet. Be the first!
        </div>
      )}
    </div>
  );
}

interface LeaderboardRowProps {
  entry: LeaderboardEntry;
  formatScore: (score: number) => string;
}

function LeaderboardRow({ entry, formatScore }: LeaderboardRowProps) {
  const getRankDisplay = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-[#F59E0B]" />;
      case 2:
        return <Medal className="h-5 w-5 text-[#9CA3AF]" />;
      case 3:
        return <Award className="h-5 w-5 text-[#B45309]" />;
      default:
        return (
          <span className="w-5 text-center text-sm font-medium text-[#737373]">
            {rank}
          </span>
        );
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
        entry.isCurrentUser
          ? 'bg-[#D97706]/10 border border-[#D97706]/30'
          : 'bg-[#1A1A1A] border border-transparent hover:border-[#333]'
      )}
    >
      {/* Rank */}
      <div className="flex items-center justify-center w-8">
        {getRankDisplay(entry.rank)}
      </div>

      {/* Avatar */}
      <Avatar className="h-8 w-8">
        {entry.avatarUrl && <AvatarImage src={entry.avatarUrl} alt={entry.displayName} />}
        <AvatarFallback className="bg-[#333] text-[#A3A3A3] text-xs">
          {getInitials(entry.displayName)}
        </AvatarFallback>
      </Avatar>

      {/* Name & Level */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'font-medium truncate',
              entry.isCurrentUser ? 'text-[#D97706]' : 'text-[#E5E5E5]'
            )}
          >
            {entry.displayName}
            {entry.isCurrentUser && <span className="ml-1 text-xs">(you)</span>}
          </span>
        </div>
        <span className="text-xs text-[#737373]">
          Lv.{entry.level} {entry.levelTitle}
        </span>
      </div>

      {/* Score */}
      <div className="text-right">
        <span
          className={cn(
            'font-semibold',
            entry.isCurrentUser ? 'text-[#D97706]' : 'text-[#E5E5E5]'
          )}
        >
          {formatScore(entry.score)}
        </span>
      </div>
    </div>
  );
}

interface LeaderboardTabsProps {
  activeMetric: LeaderboardMetric;
  onMetricChange: (metric: LeaderboardMetric) => void;
  className?: string;
}

export function LeaderboardTabs({
  activeMetric,
  onMetricChange,
  className,
}: LeaderboardTabsProps) {
  const tabs: { metric: LeaderboardMetric; label: string; icon: React.ReactNode }[] = [
    { metric: 'xp', label: 'XP', icon: <TrendingUp className="h-4 w-4" /> },
    { metric: 'longest_streak', label: 'Streak', icon: <Flame className="h-4 w-4" /> },
    { metric: 'scenarios', label: 'Scenarios', icon: <Target className="h-4 w-4" /> },
  ];

  return (
    <div className={cn('flex gap-2', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.metric}
          onClick={() => onMetricChange(tab.metric)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-mono font-medium transition-colors',
            activeMetric === tab.metric
              ? 'bg-[#D97706]/20 text-[#D97706] border border-[#D97706]/30'
              : 'bg-[#1A1A1A] text-[#A3A3A3] border border-[#333] hover:border-[#444]'
          )}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

interface TimeRangeTabsProps {
  activeRange: 'week' | 'month' | 'all_time';
  onRangeChange: (range: 'week' | 'month' | 'all_time') => void;
  className?: string;
}

export function TimeRangeTabs({
  activeRange,
  onRangeChange,
  className,
}: TimeRangeTabsProps) {
  const ranges: { value: 'week' | 'month' | 'all_time'; label: string }[] = [
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: 'all_time', label: 'All Time' },
  ];

  return (
    <div className={cn('flex gap-1 p-1 bg-[#1A1A1A] rounded-lg', className)}>
      {ranges.map((range) => (
        <button
          key={range.value}
          onClick={() => onRangeChange(range.value)}
          className={cn(
            'px-3 py-1 rounded text-xs font-mono font-medium transition-colors',
            activeRange === range.value
              ? 'bg-[#333] text-[#E5E5E5]'
              : 'text-[#737373] hover:text-[#A3A3A3]'
          )}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}
