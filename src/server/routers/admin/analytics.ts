import { z } from 'zod';
import { router, adminProcedure } from '../../trpc';
import { db, profiles, attempts, lessons, dailyActivity } from '@/lib/db';
import { eq, sql, gte, count, avg } from 'drizzle-orm';

export const adminAnalyticsRouter = router({
  // Dashboard overview stats
  overview: adminProcedure.query(async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalUsers, activeToday, subscriptionStats, totalLessons, attemptsTodayResult] =
      await Promise.all([
        db.select({ count: count() }).from(profiles),
        db
          .select({ count: count() })
          .from(dailyActivity)
          .where(eq(dailyActivity.activityDate, today.toISOString().split('T')[0])),
        db
          .select({
            tier: profiles.subscriptionTier,
            count: count(),
          })
          .from(profiles)
          .groupBy(profiles.subscriptionTier),
        db.select({ count: count() }).from(lessons),
        db
          .select({ count: count() })
          .from(attempts)
          .where(gte(attempts.createdAt, today)),
      ]);

    return {
      totalUsers: totalUsers[0].count,
      activeToday: activeToday[0].count,
      subscriptions: subscriptionStats.reduce(
        (acc, { tier, count }) => ({ ...acc, [tier || 'free']: count }),
        {} as Record<string, number>
      ),
      totalLessons: totalLessons[0].count,
      attemptsToday: attemptsTodayResult[0].count,
    };
  }),

  // Lesson performance stats
  lessonStats: adminProcedure
    .input(z.object({ lessonId: z.string().optional() }))
    .query(async ({ input }) => {
      const baseQuery = input.lessonId
        ? eq(attempts.lessonId, input.lessonId)
        : undefined;

      const stats = await db
        .select({
          lessonId: attempts.lessonId,
          totalAttempts: count(),
          avgScore: avg(attempts.score),
          passCount: sql<number>`count(case when ${attempts.score} >= 70 then 1 end)`,
        })
        .from(attempts)
        .where(baseQuery)
        .groupBy(attempts.lessonId);

      return stats.map((s) => ({
        ...s,
        avgScore: s.avgScore ? Number(s.avgScore) : 0,
        passRate:
          Number(s.totalAttempts) > 0
            ? (Number(s.passCount) / Number(s.totalAttempts)) * 100
            : 0,
      }));
    }),

  // Activity trends
  activityTrends: adminProcedure
    .input(z.object({ days: z.number().default(30) }))
    .query(async ({ input }) => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - input.days);

      const trends = await db
        .select({
          date: dailyActivity.activityDate,
          activeUsers: count(),
          scenariosCompleted: sql<number>`sum(${dailyActivity.scenariosCompleted})`,
          xpEarned: sql<number>`sum(${dailyActivity.xpEarned})`,
        })
        .from(dailyActivity)
        .where(gte(dailyActivity.activityDate, startDate.toISOString().split('T')[0]))
        .groupBy(dailyActivity.activityDate)
        .orderBy(dailyActivity.activityDate);

      return trends;
    }),
});
