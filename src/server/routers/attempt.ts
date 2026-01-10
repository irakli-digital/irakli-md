import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { db } from '@/lib/db';
import { attempts, profiles, userSkills, dailyActivity, achievements } from '@/lib/db/schema';
import { eq, and, sql, gte, desc } from 'drizzle-orm';
import { evaluatePrompt } from '@/lib/anthropic/evaluator';
import { loadLesson } from '@/lib/lessons/loader';
import { TRPCError } from '@trpc/server';
import { calculateXPGain, checkLevelUp, calculateLevel } from '@/lib/gamification/xp';
import { checkNewAchievements, type UserAchievementStats } from '@/lib/gamification/achievements';
import { calculateStreak } from '@/lib/gamification/streaks';

export const attemptRouter = router({
  submit: protectedProcedure
    .input(
      z.object({
        lessonId: z.string(),
        promptText: z.string().min(10).max(5000),
        timeSpentSeconds: z.number().optional(),
        hintsUsed: z.number().default(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const startTime = Date.now();

      // Load lesson
      const lesson = await loadLesson(input.lessonId);
      if (!lesson) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Lesson not found',
        });
      }

      // Get attempt number
      const previousAttempts = await db
        .select({ count: sql<number>`count(*)` })
        .from(attempts)
        .where(and(eq(attempts.userId, ctx.user.id), eq(attempts.lessonId, input.lessonId)));

      const attemptNumber = Number(previousAttempts[0]?.count ?? 0) + 1;

      // Evaluate with Claude
      const evaluation = await evaluatePrompt(lesson, input.promptText);
      const latency = Date.now() - startTime;

      // Save attempt
      const [attempt] = await db
        .insert(attempts)
        .values({
          userId: ctx.user.id,
          lessonId: input.lessonId,
          promptText: input.promptText,
          score: evaluation.totalScore,
          feedback: evaluation,
          rubricScores: evaluation.rubricScores,
          evaluationModel: 'claude-sonnet-4-20250514',
          evaluationLatencyMs: latency,
          attemptNumber,
          timeSpentSeconds: input.timeSpentSeconds,
          hintsUsed: input.hintsUsed,
        })
        .returning();

      const passed = evaluation.totalScore >= lesson.evaluation.passingScore;

      // Calculate XP gain
      const xpResult = calculateXPGain({
        passed,
        score: evaluation.totalScore,
        attemptNumber,
        hintsUsed: input.hintsUsed,
      });

      // Get current user profile
      const [profile] = await db
        .select()
        .from(profiles)
        .where(eq(profiles.id, ctx.user.id));

      const previousXP = profile?.totalXp || 0;
      const newXP = previousXP + xpResult.total;

      // Check for level up
      const levelUpResult = checkLevelUp(previousXP, newXP);

      // Update profile with XP
      if (xpResult.total > 0) {
        await db
          .update(profiles)
          .set({
            totalXp: newXP,
            level: calculateLevel(newXP),
          })
          .where(eq(profiles.id, ctx.user.id));
      }

      // Update skill progress if passed (first time pass for this lesson)
      if (passed && attemptNumber === 1) {
        const skillId = lesson.meta.skill;

        // Upsert user skill
        await db
          .insert(userSkills)
          .values({
            userId: ctx.user.id,
            skillId,
            scenariosCompleted: 1,
            scenariosAvailable: 3,
            bestScore: evaluation.totalScore,
            totalAttempts: 1,
            isUnlocked: true,
            unlockedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: [userSkills.userId, userSkills.skillId],
            set: {
              scenariosCompleted: sql`${userSkills.scenariosCompleted} + 1`,
              totalAttempts: sql`${userSkills.totalAttempts} + 1`,
              bestScore: sql`GREATEST(${userSkills.bestScore}, ${evaluation.totalScore})`,
            },
          });
      }

      // Record daily activity
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD format

      await db
        .insert(dailyActivity)
        .values({
          userId: ctx.user.id,
          activityDate: todayStr,
          scenariosCompleted: passed ? 1 : 0,
          xpEarned: xpResult.total,
          timeSpentSeconds: input.timeSpentSeconds || 0,
        })
        .onConflictDoUpdate({
          target: [dailyActivity.userId, dailyActivity.activityDate],
          set: {
            scenariosCompleted: passed
              ? sql`${dailyActivity.scenariosCompleted} + 1`
              : dailyActivity.scenariosCompleted,
            xpEarned: sql`${dailyActivity.xpEarned} + ${xpResult.total}`,
            timeSpentSeconds: sql`${dailyActivity.timeSpentSeconds} + ${input.timeSpentSeconds || 0}`,
          },
        });

      // Check for new achievements
      const achievementStats = await getQuickAchievementStats(ctx.user.id, {
        justPassed: passed,
        score: evaluation.totalScore,
        attemptNumber,
        hintsUsed: input.hintsUsed,
        timeSpentSeconds: input.timeSpentSeconds,
      });

      const newAchievements = checkNewAchievements(achievementStats);
      let achievementXpAwarded = 0;

      if (newAchievements.length > 0) {
        // Insert new achievements
        const toInsert = newAchievements.map((a) => ({
          userId: ctx.user.id,
          achievementType: a.id,
          achievementData: { category: a.category, rarity: a.rarity },
        }));

        await db.insert(achievements).values(toInsert).onConflictDoNothing();

        // Award XP for achievements
        achievementXpAwarded = newAchievements.reduce((sum, a) => sum + a.xpReward, 0);

        if (achievementXpAwarded > 0) {
          await db
            .update(profiles)
            .set({
              totalXp: sql`${profiles.totalXp} + ${achievementXpAwarded}`,
              level: calculateLevel(newXP + achievementXpAwarded),
            })
            .where(eq(profiles.id, ctx.user.id));
        }
      }

      return {
        attemptId: attempt.id,
        ...evaluation,
        passed,
        xpGained: xpResult.total,
        xpBreakdown: xpResult.breakdown,
        leveledUp: levelUpResult.leveledUp,
        newLevel: levelUpResult.newLevel,
        newAchievements: newAchievements.map((a) => ({
          id: a.id,
          name: a.name,
          description: a.description,
          icon: a.icon,
          xpReward: a.xpReward,
          rarity: a.rarity,
        })),
        achievementXpAwarded,
      };
    }),

  getHistory: protectedProcedure
    .input(z.object({ lessonId: z.string() }))
    .query(async ({ ctx, input }) => {
      return db.query.attempts.findMany({
        where: and(eq(attempts.userId, ctx.user.id), eq(attempts.lessonId, input.lessonId)),
        orderBy: (attempts, { desc }) => [desc(attempts.createdAt)],
      });
    }),
});

// Helper function to get achievement stats efficiently
async function getQuickAchievementStats(
  userId: string,
  currentAttempt: {
    justPassed: boolean;
    score: number;
    attemptNumber: number;
    hintsUsed: number;
    timeSpentSeconds?: number;
  }
): Promise<UserAchievementStats> {
  // Get profile
  const [profile] = await db.select().from(profiles).where(eq(profiles.id, userId));

  // Get completed scenarios count
  const completedResult = await db
    .select({ count: sql<number>`count(distinct ${attempts.lessonId})` })
    .from(attempts)
    .where(and(eq(attempts.userId, userId), gte(attempts.score, 70)));

  let totalScenariosCompleted = Number(completedResult[0]?.count ?? 0);
  if (currentAttempt.justPassed) totalScenariosCompleted++; // Include current

  // Get perfect scores count (90+)
  const perfectResult = await db
    .select({ count: sql<number>`count(distinct ${attempts.lessonId})` })
    .from(attempts)
    .where(and(eq(attempts.userId, userId), gte(attempts.score, 90)));

  let perfectScores = Number(perfectResult[0]?.count ?? 0);
  if (currentAttempt.score >= 90) perfectScores++;

  // Get first attempt passes
  const firstAttemptResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(attempts)
    .where(and(eq(attempts.userId, userId), eq(attempts.attemptNumber, 1), gte(attempts.score, 70)));

  let firstAttemptPasses = Number(firstAttemptResult[0]?.count ?? 0);
  if (currentAttempt.justPassed && currentAttempt.attemptNumber === 1) firstAttemptPasses++;

  // Get no-hint completions
  const noHintResult = await db
    .select({ count: sql<number>`count(distinct ${attempts.lessonId})` })
    .from(attempts)
    .where(and(eq(attempts.userId, userId), eq(attempts.hintsUsed, 0), gte(attempts.score, 70)));

  let noHintCompletions = Number(noHintResult[0]?.count ?? 0);
  if (currentAttempt.justPassed && currentAttempt.hintsUsed === 0) noHintCompletions++;

  // Get speed completions
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

  let speedCompletions = Number(speedResult[0]?.count ?? 0);
  if (
    currentAttempt.justPassed &&
    currentAttempt.timeSpentSeconds &&
    currentAttempt.timeSpentSeconds < 120
  ) {
    speedCompletions++;
  }

  // Get streak info
  const activityRecords = await db
    .select({ date: dailyActivity.activityDate })
    .from(dailyActivity)
    .where(eq(dailyActivity.userId, userId))
    .orderBy(desc(dailyActivity.activityDate))
    .limit(365);

  const streak = calculateStreak(activityRecords.map((r) => r.date));

  // Get mastered skills
  const skills = await db.select().from(userSkills).where(eq(userSkills.userId, userId));
  const masteredSkills = skills
    .filter((s) => (s.scenariosCompleted || 0) >= 3 && (s.masteryLevel || 0) >= 2)
    .map((s) => s.skillId);

  // Completed stages
  const completedStages: number[] = [];
  const stage1Skills = ['clarity', 'context', 'constraints', 'reasoning', 'output-shaping'];
  if (stage1Skills.every((skillId) => masteredSkills.includes(skillId))) {
    completedStages.push(1);
  }

  // Get unlocked achievements
  const unlockedRows = await db
    .select({ type: achievements.achievementType })
    .from(achievements)
    .where(eq(achievements.userId, userId));

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
    unlockedAchievements: unlockedRows.map((r) => r.type),
  };
}
