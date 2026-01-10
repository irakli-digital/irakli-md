import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { db } from '@/lib/db';
import { profiles, dailyActivity } from '@/lib/db/schema';
import { eq, desc, sql, gte, and, count } from 'drizzle-orm';
import { getLevelTitle } from '@/lib/gamification/xp';

const timeRangeSchema = z.enum(['week', 'month', 'all_time']);
type TimeRange = z.infer<typeof timeRangeSchema>;

function getDateThreshold(range: TimeRange): Date | null {
  const now = new Date();
  switch (range) {
    case 'week':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case 'month':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case 'all_time':
      return null;
  }
}

export const leaderboardRouter = router({
  // Get XP leaderboard
  getByXP: protectedProcedure
    .input(
      z.object({
        timeRange: timeRangeSchema.default('all_time'),
        limit: z.number().min(1).max(100).default(50),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const dateThreshold = getDateThreshold(input.timeRange);

      if (input.timeRange === 'all_time') {
        // All-time: use total XP from profiles
        const leaders = await db
          .select({
            id: profiles.id,
            displayName: profiles.displayName,
            avatarUrl: profiles.avatarUrl,
            totalXp: profiles.totalXp,
            level: profiles.level,
          })
          .from(profiles)
          .orderBy(desc(profiles.totalXp))
          .limit(input.limit);

        const rankedLeaders = leaders.map((leader, index) => ({
          rank: index + 1,
          id: leader.id,
          displayName: leader.displayName || 'Anonymous',
          avatarUrl: leader.avatarUrl,
          score: leader.totalXp || 0,
          level: leader.level || 1,
          levelTitle: getLevelTitle(leader.level || 1),
          isCurrentUser: leader.id === userId,
        }));

        // Find current user's rank if not in top list
        const currentUserEntry = rankedLeaders.find((l) => l.isCurrentUser);
        let currentUserRank = null;

        if (!currentUserEntry) {
          const [rankResult] = await db
            .select({
              rank: sql<number>`(SELECT COUNT(*) + 1 FROM profiles WHERE total_xp > (SELECT total_xp FROM profiles WHERE id = ${userId}))`,
            })
            .from(profiles)
            .where(eq(profiles.id, userId));

          if (rankResult) {
            const [userProfile] = await db.select().from(profiles).where(eq(profiles.id, userId));

            if (userProfile) {
              currentUserRank = {
                rank: Number(rankResult.rank),
                id: userProfile.id,
                displayName: userProfile.displayName || 'Anonymous',
                avatarUrl: userProfile.avatarUrl,
                score: userProfile.totalXp || 0,
                level: userProfile.level || 1,
                levelTitle: getLevelTitle(userProfile.level || 1),
                isCurrentUser: true,
              };
            }
          }
        }

        return {
          leaders: rankedLeaders,
          currentUserRank,
          timeRange: input.timeRange,
          metric: 'xp' as const,
        };
      } else {
        // Time-bounded: aggregate from daily_activity
        const dateStr = dateThreshold?.toISOString().split('T')[0];

        const leaders = await db
          .select({
            userId: dailyActivity.userId,
            totalXp: sql<number>`SUM(${dailyActivity.xpEarned})`.as('total_xp'),
          })
          .from(dailyActivity)
          .where(dateStr ? gte(dailyActivity.activityDate, dateStr) : undefined)
          .groupBy(dailyActivity.userId)
          .orderBy(desc(sql`total_xp`))
          .limit(input.limit);

        // Get profile info for leaders
        const leaderProfiles = await db
          .select()
          .from(profiles)
          .where(
            sql`${profiles.id} IN (${
              leaders.length > 0 ? sql.join(leaders.map((l) => sql`${l.userId}`)) : sql`NULL`
            })`
          );

        const profileMap = new Map(leaderProfiles.map((p) => [p.id, p]));

        const rankedLeaders = leaders.map((leader, index) => {
          const profile = profileMap.get(leader.userId || '');
          return {
            rank: index + 1,
            id: leader.userId || '',
            displayName: profile?.displayName || 'Anonymous',
            avatarUrl: profile?.avatarUrl || null,
            score: Number(leader.totalXp) || 0,
            level: profile?.level || 1,
            levelTitle: getLevelTitle(profile?.level || 1),
            isCurrentUser: leader.userId === userId,
          };
        });

        return {
          leaders: rankedLeaders,
          currentUserRank: null,
          timeRange: input.timeRange,
          metric: 'xp' as const,
        };
      }
    }),

  // Get streak leaderboard
  getByStreak: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        type: z.enum(['current', 'longest']).default('longest'),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const orderByField = input.type === 'current' ? profiles.currentStreak : profiles.longestStreak;

      const leaders = await db
        .select({
          id: profiles.id,
          displayName: profiles.displayName,
          avatarUrl: profiles.avatarUrl,
          currentStreak: profiles.currentStreak,
          longestStreak: profiles.longestStreak,
          level: profiles.level,
        })
        .from(profiles)
        .where(
          input.type === 'current'
            ? gte(profiles.currentStreak, 1)
            : gte(profiles.longestStreak, 1)
        )
        .orderBy(desc(orderByField))
        .limit(input.limit);

      const rankedLeaders = leaders.map((leader, index) => ({
        rank: index + 1,
        id: leader.id,
        displayName: leader.displayName || 'Anonymous',
        avatarUrl: leader.avatarUrl,
        score: (input.type === 'current' ? leader.currentStreak : leader.longestStreak) || 0,
        level: leader.level || 1,
        levelTitle: getLevelTitle(leader.level || 1),
        isCurrentUser: leader.id === userId,
      }));

      return {
        leaders: rankedLeaders,
        currentUserRank: null,
        timeRange: 'all_time' as const,
        metric: input.type === 'current' ? ('current_streak' as const) : ('longest_streak' as const),
      };
    }),

  // Get scenarios completed leaderboard
  getByScenarios: protectedProcedure
    .input(
      z.object({
        timeRange: timeRangeSchema.default('all_time'),
        limit: z.number().min(1).max(100).default(50),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const dateThreshold = getDateThreshold(input.timeRange);
      const dateStr = dateThreshold?.toISOString().split('T')[0];

      const whereClause = dateStr ? gte(dailyActivity.activityDate, dateStr) : undefined;

      const leaders = await db
        .select({
          odUserId: dailyActivity.userId,
          totalScenarios: sql<number>`SUM(${dailyActivity.scenariosCompleted})`.as('total_scenarios'),
        })
        .from(dailyActivity)
        .where(whereClause)
        .groupBy(dailyActivity.userId)
        .orderBy(desc(sql`total_scenarios`))
        .limit(input.limit);

      // Get profile info
      const leaderProfiles = await db
        .select()
        .from(profiles)
        .where(
          sql`${profiles.id} IN (${
            leaders.length > 0 ? sql.join(leaders.map((l) => sql`${l.odUserId}`)) : sql`NULL`
          })`
        );

      const profileMap = new Map(leaderProfiles.map((p) => [p.id, p]));

      const rankedLeaders = leaders.map((leader, index) => {
        const profile = profileMap.get(leader.odUserId || '');
        return {
          rank: index + 1,
          id: leader.odUserId || '',
          displayName: profile?.displayName || 'Anonymous',
          avatarUrl: profile?.avatarUrl || null,
          score: Number(leader.totalScenarios) || 0,
          level: profile?.level || 1,
          levelTitle: getLevelTitle(profile?.level || 1),
          isCurrentUser: leader.odUserId === userId,
        };
      });

      return {
        leaders: rankedLeaders,
        currentUserRank: null,
        timeRange: input.timeRange,
        metric: 'scenarios' as const,
      };
    }),

  // Get total user count for display
  getTotalUsers: protectedProcedure.query(async () => {
    const [result] = await db.select({ count: count() }).from(profiles);
    return { totalUsers: result?.count || 0 };
  }),
});
