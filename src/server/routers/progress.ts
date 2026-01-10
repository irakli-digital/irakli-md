import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { db } from '@/lib/db';
import { profiles, userSkills, attempts, dailyActivity } from '@/lib/db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';
import { calculateLevel, getXPForCurrentLevel, getLevelTitle } from '@/lib/gamification/xp';
import { calculateStreak } from '@/lib/gamification/streaks';
import skillTreeData from '@/../content/skills/skill-tree.json';

export const progressRouter = router({
  // Get user's overall progress
  getOverview: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    // Get profile
    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, userId));

    if (!profile) {
      return {
        level: 1,
        totalXP: 0,
        currentStage: 1,
        levelProgress: { current: 0, required: 100, progress: 0 },
        levelTitle: 'Novice',
        streak: { currentStreak: 0, longestStreak: 0, isActiveToday: false },
      };
    }

    const totalXp = profile.totalXp || 0;
    const level = calculateLevel(totalXp);
    const levelProgress = getXPForCurrentLevel(totalXp);
    const levelTitle = getLevelTitle(level);

    // Get streak data
    const activityRecords = await db
      .select({ date: dailyActivity.activityDate })
      .from(dailyActivity)
      .where(eq(dailyActivity.userId, userId))
      .orderBy(desc(dailyActivity.activityDate))
      .limit(100);

    const streak = calculateStreak(activityRecords.map((r) => r.date));

    return {
      level,
      totalXP: totalXp,
      currentStage: profile.currentStage || 1,
      levelProgress,
      levelTitle,
      streak: {
        currentStreak: streak.currentStreak,
        longestStreak: Math.max(streak.longestStreak, profile.longestStreak || 0),
        isActiveToday: streak.isActiveToday,
      },
    };
  }),

  // Get skill tree data with user progress
  getSkillTree: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    // Get user's current stage
    const [profile] = await db
      .select({ currentStage: profiles.currentStage })
      .from(profiles)
      .where(eq(profiles.id, userId));

    const currentStage = profile?.currentStage || 1;

    // Get user's skill progress
    const skills = await db
      .select()
      .from(userSkills)
      .where(eq(userSkills.userId, userId));

    const userProgress = skills.map((skill) => ({
      skillId: skill.skillId,
      scenariosCompleted: skill.scenariosCompleted,
      isUnlocked: skill.isUnlocked,
      masteryLevel: skill.masteryLevel,
    }));

    return {
      stages: skillTreeData.stages,
      userProgress,
      currentStage,
    };
  }),

  // Get progress for a specific skill
  getSkillProgress: protectedProcedure
    .input(z.object({ skillId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      const [skill] = await db
        .select()
        .from(userSkills)
        .where(and(eq(userSkills.userId, userId), eq(userSkills.skillId, input.skillId)));

      if (!skill) {
        return {
          skillId: input.skillId,
          scenariosCompleted: 0,
          scenariosAvailable: 3,
          bestScore: 0,
          averageScore: 0,
          totalAttempts: 0,
          masteryLevel: 0,
          isUnlocked: false,
        };
      }

      return {
        skillId: skill.skillId,
        scenariosCompleted: skill.scenariosCompleted,
        scenariosAvailable: skill.scenariosAvailable,
        bestScore: skill.bestScore,
        averageScore: Number(skill.averageScore) || 0,
        totalAttempts: skill.totalAttempts,
        masteryLevel: skill.masteryLevel,
        isUnlocked: skill.isUnlocked,
      };
    }),

  // Get recent activity
  getRecentActivity: protectedProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      const recentAttempts = await db
        .select({
          id: attempts.id,
          lessonId: attempts.lessonId,
          score: attempts.score,
          passed: sql<boolean>`${attempts.score} >= 70`,
          submittedAt: attempts.submittedAt,
        })
        .from(attempts)
        .where(eq(attempts.userId, userId))
        .orderBy(desc(attempts.submittedAt))
        .limit(input.limit);

      return recentAttempts;
    }),

  // Record daily activity (called after completing a scenario)
  recordActivity: protectedProcedure
    .input(
      z.object({
        scenariosCompleted: z.number().default(1),
        xpEarned: z.number(),
        timeSpentSeconds: z.number().default(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD format

      // Upsert daily activity
      await db
        .insert(dailyActivity)
        .values({
          userId,
          activityDate: todayStr,
          scenariosCompleted: input.scenariosCompleted,
          xpEarned: input.xpEarned,
          timeSpentSeconds: input.timeSpentSeconds,
        })
        .onConflictDoUpdate({
          target: [dailyActivity.userId, dailyActivity.activityDate],
          set: {
            scenariosCompleted: sql`${dailyActivity.scenariosCompleted} + ${input.scenariosCompleted}`,
            xpEarned: sql`${dailyActivity.xpEarned} + ${input.xpEarned}`,
            timeSpentSeconds: sql`${dailyActivity.timeSpentSeconds} + ${input.timeSpentSeconds}`,
          },
        });

      // Update streak in profile
      const [profile] = await db
        .select()
        .from(profiles)
        .where(eq(profiles.id, userId));

      if (profile) {
        const activityRecords = await db
          .select({ date: dailyActivity.activityDate })
          .from(dailyActivity)
          .where(eq(dailyActivity.userId, userId))
          .orderBy(desc(dailyActivity.activityDate))
          .limit(100);

        const streak = calculateStreak(activityRecords.map((r) => r.date));

        await db
          .update(profiles)
          .set({
            currentStreak: streak.currentStreak,
            longestStreak: Math.max(streak.longestStreak, profile.longestStreak || 0),
            lastPracticeDate: todayStr,
          })
          .where(eq(profiles.id, userId));
      }

      return { success: true };
    }),
});
