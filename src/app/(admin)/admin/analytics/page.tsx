'use client';

import { trpc } from '@/lib/trpc/client';
import { BarChart3, TrendingUp, Target } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const { data: overview, isLoading: overviewLoading } =
    trpc.admin.analytics.overview.useQuery();
  const { data: lessonStats, isLoading: lessonsLoading } =
    trpc.admin.analytics.lessonStats.useQuery({});
  const { data: trends, isLoading: trendsLoading } =
    trpc.admin.analytics.activityTrends.useQuery({ days: 30 });

  if (overviewLoading || lessonsLoading || trendsLoading) {
    return (
      <div className="text-[#737373] font-mono animate-pulse">loading analytics...</div>
    );
  }

  // Calculate lesson stats summary
  const totalAttempts = lessonStats?.reduce(
    (sum, s) => sum + Number(s.totalAttempts),
    0
  ) || 0;
  const avgPassRate =
    lessonStats && lessonStats.length > 0
      ? lessonStats.reduce((sum, s) => sum + s.passRate, 0) / lessonStats.length
      : 0;
  const avgScore =
    lessonStats && lessonStats.length > 0
      ? lessonStats.reduce((sum, s) => sum + s.avgScore, 0) / lessonStats.length
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-mono text-[#E5E5E5]">analytics</h1>
        <p className="text-sm text-[#737373] font-mono mt-1">
          platform performance metrics
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#252525] border border-[#333] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="h-4 w-4 text-[#3B82F6]" />
            <span className="text-[#737373] font-mono text-sm">total attempts</span>
          </div>
          <div className="text-2xl font-mono text-[#E5E5E5]">
            {totalAttempts.toLocaleString()}
          </div>
        </div>

        <div className="bg-[#252525] border border-[#333] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-[#22C55E]" />
            <span className="text-[#737373] font-mono text-sm">avg pass rate</span>
          </div>
          <div className="text-2xl font-mono text-[#E5E5E5]">
            {avgPassRate.toFixed(1)}%
          </div>
        </div>

        <div className="bg-[#252525] border border-[#333] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-[#F59E0B]" />
            <span className="text-[#737373] font-mono text-sm">avg score</span>
          </div>
          <div className="text-2xl font-mono text-[#E5E5E5]">
            {avgScore.toFixed(1)}
          </div>
        </div>
      </div>

      {/* Activity Trends */}
      <div className="bg-[#252525] border border-[#333] rounded-lg p-4">
        <h2 className="text-[#E5E5E5] font-mono text-sm mb-4">
          activity trends (last 30 days)
        </h2>
        {trends && trends.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-mono">
              <thead>
                <tr className="text-[#737373] border-b border-[#333]">
                  <th className="text-left py-2">date</th>
                  <th className="text-right py-2">active users</th>
                  <th className="text-right py-2">scenarios</th>
                  <th className="text-right py-2">xp earned</th>
                </tr>
              </thead>
              <tbody>
                {trends.slice(-10).map((day, i) => (
                  <tr key={i} className="border-b border-[#333] last:border-0">
                    <td className="py-2 text-[#A3A3A3]">{day.date}</td>
                    <td className="py-2 text-right text-[#E5E5E5]">{day.activeUsers}</td>
                    <td className="py-2 text-right text-[#E5E5E5]">
                      {day.scenariosCompleted || 0}
                    </td>
                    <td className="py-2 text-right text-[#E5E5E5]">
                      {day.xpEarned || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-[#737373] font-mono text-sm">no activity data yet</div>
        )}
      </div>

      {/* Top Lessons by Attempts */}
      <div className="bg-[#252525] border border-[#333] rounded-lg p-4">
        <h2 className="text-[#E5E5E5] font-mono text-sm mb-4">lesson performance</h2>
        {lessonStats && lessonStats.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-mono">
              <thead>
                <tr className="text-[#737373] border-b border-[#333]">
                  <th className="text-left py-2">lesson</th>
                  <th className="text-right py-2">attempts</th>
                  <th className="text-right py-2">avg score</th>
                  <th className="text-right py-2">pass rate</th>
                </tr>
              </thead>
              <tbody>
                {lessonStats
                  .sort((a, b) => Number(b.totalAttempts) - Number(a.totalAttempts))
                  .slice(0, 10)
                  .map((lesson, i) => (
                    <tr key={i} className="border-b border-[#333] last:border-0">
                      <td className="py-2 text-[#E5E5E5]">{lesson.lessonId}</td>
                      <td className="py-2 text-right text-[#A3A3A3]">
                        {lesson.totalAttempts}
                      </td>
                      <td className="py-2 text-right text-[#A3A3A3]">
                        {lesson.avgScore.toFixed(1)}
                      </td>
                      <td className="py-2 text-right">
                        <span
                          className={
                            lesson.passRate >= 70
                              ? 'text-[#22C55E]'
                              : lesson.passRate >= 50
                                ? 'text-[#F59E0B]'
                                : 'text-[#EF4444]'
                          }
                        >
                          {lesson.passRate.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-[#737373] font-mono text-sm">no lesson data yet</div>
        )}
      </div>
    </div>
  );
}
