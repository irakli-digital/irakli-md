import { router, protectedProcedure } from '../trpc';
import { db } from '@/lib/db';
import { achievements, profiles, attempts, userSkills, dailyActivity } from '@/lib/db/schema';
import { eq, and, sql, gte, desc } from 'drizzle-orm';
import {
  ACHIEVEMENTS,
  checkNewAchievements,
  getAchievement,
  type UserAchievementStats,
} from '@/lib/gamification/achievements';
import { calculateLevel } from '@/lib/gamification/xp';
import { calculateStreak } from '@/lib/gamification/streaks';

export const achievementsRouter = router({
  // Get all achievements with user's unlock status
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    // Get user's unlocked achievements
    const unlocked = await db
      .select({
        achievementType: achievements.achievementType,
        unlockedAt: achievements.unlockedAt,
      })
      .from(achievements)
      .where(eq(achievements.userId, userId));

    const unlockedMap = new Map(unlocked.map((a) => [a.achievementType, a.unlockedAt]));

    // Return all achievements with unlock status
    return ACHIEVEMENTS.map((achievement) => ({
      ...achievement,
      unlocked: unlockedMap.has(achievement.id),
      unlockedAt: unlockedMap.get(achievement.id) || null,
    }));
  }),

  // Get user's unlocked achievements only
  getUnlocked: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    const unlocked = await db
      .select()
      .from(achievements)
      .where(eq(achievements.userId, userId))
      .orderBy(desc(achievements.unlockedAt));

    return unlocked.map((a) => ({
      ...getAchievement(a.achievementType),
      unlockedAt: a.unlockedAt,
      data: a.achievementData,
    }));
  }),

  // Get user stats for achievement display
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const stats = await getUserAchievementStats(ctx.user.id);
    return {
      totalAchievements: ACHIEVEMENTS.length,
      unlockedCount: stats.unlockedAchievements.length,
      totalXpFromAchievements: stats.unlockedAchievements.reduce((sum, id) => {
        const achievement = getAchievement(id);
        return sum + (achievement?.xpReward || 0);
      }, 0),
    };
  }),

  // Check and unlock new achievements (called after significant events)
  checkAndUnlock: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.user.id;
    const stats = await getUserAchievementStats(userId);

    const newAchievements = checkNewAchievements(stats);

    if (newAchievements.length === 0) {
      return { newAchievements: [] };
    }

    // Insert new achievements
    const toInsert = newAchievements.map((a) => ({
      userId,
      achievementType: a.id,
      achievementData: { category: a.category, rarity: a.rarity },
    }));

    await db.insert(achievements).values(toInsert).onConflictDoNothing();

    // Award XP for achievements
    const totalXpReward = newAchievements.reduce((sum, a) => sum + a.xpReward, 0);

    if (totalXpReward > 0) {
      await db
        .update(profiles)
        .set({
          totalXp: sql`${profiles.totalXp} + ${totalXpReward}`,
        })
        .where(eq(profiles.id, userId));

      // Recalculate level after XP boost
      const [profile] = await db.select({ totalXp: profiles.totalXp }).from(profiles).where(eq(profiles.id, userId));

      if (profile) {
        const newLevel = calculateLevel(profile.totalXp || 0);
        await db.update(profiles).set({ level: newLevel }).where(eq(profiles.id, userId));
      }
    }

    return {
      newAchievements: newAchievements.map((a) => ({
        id: a.id,
        name: a.name,
        description: a.description,
        icon: a.icon,
        xpReward: a.xpReward,
        rarity: a.rarity,
      })),
      totalXpAwarded: totalXpReward,
    };
  }),

  // Get achievement progress for display
  getProgress: protectedProcedure.query(async ({ ctx }) => {
    const stats = await getUserAchievementStats(ctx.user.id);

    // Calculate progress for key achievements
    const progress = [
      {
        id: 'scenarios',
        label: 'Scenarios Completed',
        current: stats.totalScenariosCompleted,
        targets: [1, 5, 15, 50, 100],
      },
      {
        id: 'streak',
        label: 'Longest Streak',
        current: Math.max(stats.currentStreak, stats.longestStreak),
        targets: [3, 7, 14, 30, 100],
      },
      {
        id: 'perfect',
        label: 'Perfect Scores',
        current: stats.perfectScores,
        targets: [1, 10, 25],
      },
      {
        id: 'first_attempt',
        label: 'First Attempt Passes',
        current: stats.firstAttemptPasses,
        targets: [5, 20],
      },
      {
        id: 'level',
        label: 'Level',
        current: stats.level,
        targets: [5, 10, 20, 30],
      },
    ];

    return progress.map((p) => {
      const nextTarget = p.targets.find((t) => t > p.current) || p.targets[p.targets.length - 1];
      const prevTarget = [...p.targets].reverse().find((t) => t <= p.current) || 0;
      const progressPercent = Math.min(((p.current - prevTarget) / (nextTarget - prevTarget)) * 100, 100);

      return {
        ...p,
        nextTarget,
        progressPercent: Math.max(0, progressPercent),
      };
    });
  }),
});

// Helper function to get all user stats needed for achievement checking
async function getUserAchievementStats(userId: string): Promise<UserAchievementStats> {
  // Get profile
  const [profile] = await db.select().from(profiles).where(eq(profiles.id, userId));

  // Get completed scenarios count (passed attempts, unique lessons)
  const completedResult = await db
    .select({ count: sql<number>`count(distinct ${attempts.lessonId})` })
    .from(attempts)
    .where(and(eq(attempts.userId, userId), gte(attempts.score, 70)));

  const totalScenariosCompleted = Number(completedResult[0]?.count ?? 0);

  // Get perfect scores count (90+)
  const perfectResult = await db
    .select({ count: sql<number>`count(distinct ${attempts.lessonId})` })
    .from(attempts)
    .where(and(eq(attempts.userId, userId), gte(attempts.score, 90)));

  const perfectScores = Number(perfectResult[0]?.count ?? 0);

  // Get first attempt passes
  const firstAttemptResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(attempts)
    .where(and(eq(attempts.userId, userId), eq(attempts.attemptNumber, 1), gte(attempts.score, 70)));

  const firstAttemptPasses = Number(firstAttemptResult[0]?.count ?? 0);

  // Get no-hint completions
  const noHintResult = await db
    .select({ count: sql<number>`count(distinct ${attempts.lessonId})` })
    .from(attempts)
    .where(and(eq(attempts.userId, userId), eq(attempts.hintsUsed, 0), gte(attempts.score, 70)));

  const noHintCompletions = Number(noHintResult[0]?.count ?? 0);

  // Get speed completions (under 2 min = 120 sec)
  const speedResult = await db
    .select({ count: sql<number>`count(distinct ${attempts.lessonId})` })
    .from(attempts)
    .where(
      and(
        eq(attempts.userId, userId),
        gte(attempts.score, 70),
        sql`${attempts.timeSpentSeconds} IS NOT NULL AND ${attempts.timeSpentSeconds} < 120`
      )
    );

  const speedCompletions = Number(speedResult[0]?.count ?? 0);

  // Get streak info
  const activityRecords = await db
    .select({ date: dailyActivity.activityDate })
    .from(dailyActivity)
    .where(eq(dailyActivity.userId, userId))
    .orderBy(desc(dailyActivity.activityDate))
    .limit(365);

  const streak = calculateStreak(activityRecords.map((r) => r.date));

  // Get mastered skills (all 3 scenarios completed with 80+ avg)
  const skills = await db.select().from(userSkills).where(eq(userSkills.userId, userId));

  const masteredSkills = skills
    .filter((s) => (s.scenariosCompleted || 0) >= 3 && (s.masteryLevel || 0) >= 2)
    .map((s) => s.skillId);

  // Determine completed stages based on skills
  const completedStages: number[] = [];
  const stage1Skills = ['clarity', 'context', 'constraints', 'reasoning', 'output-shaping'];
  const stage1Mastered = stage1Skills.every((skillId) => masteredSkills.includes(skillId));
  if (stage1Mastered) completedStages.push(1);

  // Get unlocked achievements
  const unlockedRows = await db
    .select({ type: achievements.achievementType })
    .from(achievements)
    .where(eq(achievements.userId, userId));

  const unlockedAchievements = unlockedRows.map((r) => r.type);

  return {
    totalScenariosCompleted,
    currentStreak: streak.currentStreak,
    longestStreak: Math.max(streak.longestStreak, profile?.longestStreak || 0),
    perfectScores,
    firstAttemptPasses,
    noHintCompletions,
    speedCompletions,
    level: profile?.level || 1,
    totalXp: profile?.totalXp || 0,
    masteredSkills,
    completedStages,
    unlockedAchievements,
  };
}
