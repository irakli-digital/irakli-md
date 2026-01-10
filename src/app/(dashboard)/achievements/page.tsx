'use client';

import { useState, useMemo } from 'react';
import { TerminalWindow } from '@/components/terminal/terminal-window';
import { TerminalLine } from '@/components/terminal/terminal-line';
import { AchievementGrid, RarityBadge } from '@/components/gamification/achievement-badge';
import { trpc } from '@/lib/trpc/client';
import { ACHIEVEMENTS, getCategoryLabel } from '@/lib/gamification/achievements';
import { Trophy, Filter } from 'lucide-react';

type FilterType = 'all' | 'unlocked' | 'locked';
type CategoryType = 'all' | 'milestone' | 'streak' | 'skill' | 'quality' | 'special';

export default function AchievementsPage() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [category, setCategory] = useState<CategoryType>('all');

  const { data: achievements, isLoading } = trpc.achievements.getAll.useQuery();
  const { data: stats } = trpc.achievements.getStats.useQuery();

  const filteredAchievements = useMemo(() => {
    if (!achievements) return [];

    return achievements.filter((a) => {
      const filterMatch =
        filter === 'all' ||
        (filter === 'unlocked' && a.unlocked) ||
        (filter === 'locked' && !a.unlocked);

      const categoryMatch = category === 'all' || a.category === category;

      return filterMatch && categoryMatch;
    });
  }, [achievements, filter, category]);

  const categories: CategoryType[] = ['all', 'milestone', 'streak', 'skill', 'quality', 'special'];

  const unlockedCount = achievements?.filter((a) => a.unlocked).length || 0;
  const totalCount = achievements?.length || ACHIEVEMENTS.length;
  const progressPercent = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#252525] rounded-lg border border-[#333]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-[#D97706]" />
            <span className="font-mono text-lg font-semibold text-[#E5E5E5]">
              {unlockedCount}/{totalCount}
            </span>
            <span className="font-mono text-sm text-[#737373]">achievements</span>
          </div>
          <div className="h-6 w-px bg-[#333]" />
          <span className="font-mono text-sm text-[#A3A3A3]">{progressPercent}% complete</span>
        </div>
        <div className="font-mono text-sm">
          <span className="text-[#737373]">XP earned: </span>
          <span className="text-[#D97706] font-medium">
            +{stats?.totalXpFromAchievements.toLocaleString() || 0}
          </span>
        </div>
      </div>

      {/* Filters */}
      <TerminalWindow title="~/achievements">
        <div className="space-y-6">
          {/* Filter Row */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-[#737373]" />
              <div className="flex gap-1 p-1 bg-[#1A1A1A] rounded-lg">
                {(['all', 'unlocked', 'locked'] as FilterType[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1 rounded text-xs font-mono font-medium transition-colors ${
                      filter === f
                        ? 'bg-[#333] text-[#E5E5E5]'
                        : 'text-[#737373] hover:text-[#A3A3A3]'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-2 py-1 rounded text-xs font-mono font-medium transition-colors ${
                    category === cat
                      ? 'bg-[#D97706]/20 text-[#D97706] border border-[#D97706]/30'
                      : 'bg-[#1A1A1A] text-[#737373] border border-transparent hover:border-[#333]'
                  }`}
                >
                  {cat === 'all' ? 'All' : getCategoryLabel(cat)}
                </button>
              ))}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono text-[#737373]">
              <span>collection progress</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-2 bg-[#333] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#D97706] transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Rarity Legend */}
          <div className="flex flex-wrap gap-3">
            {(['common', 'rare', 'epic', 'legendary'] as const).map((rarity) => (
              <div key={rarity} className="flex items-center gap-1.5">
                <RarityBadge rarity={rarity} />
                <span className="text-xs font-mono text-[#737373]">
                  {achievements?.filter((a) => a.rarity === rarity && a.unlocked).length || 0}/
                  {achievements?.filter((a) => a.rarity === rarity).length || 0}
                </span>
              </div>
            ))}
          </div>
        </div>
      </TerminalWindow>

      {/* Achievements Grid */}
      <TerminalWindow title="~/collection">
        {isLoading ? (
          <TerminalLine prefixColor="muted" animate>
            loading achievements...
          </TerminalLine>
        ) : filteredAchievements.length > 0 ? (
          <AchievementGrid achievements={filteredAchievements} size="md" />
        ) : (
          <div className="text-center py-8">
            <p className="text-[#737373] font-mono text-sm">
              {filter === 'unlocked'
                ? 'No achievements unlocked yet. Keep practicing!'
                : filter === 'locked'
                  ? 'All achievements in this category are unlocked!'
                  : 'No achievements found.'}
            </p>
          </div>
        )}
      </TerminalWindow>
    </div>
  );
}
