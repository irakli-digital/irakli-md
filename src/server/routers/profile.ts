import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { db } from '@/lib/db';
import { profiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const profileRouter = router({
  // Get current user's profile
  get: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, userId));

    if (!profile) {
      return null;
    }

    return {
      id: profile.id,
      email: profile.email,
      displayName: profile.displayName,
      avatarUrl: profile.avatarUrl,
      currentStage: profile.currentStage,
      totalXp: profile.totalXp,
      level: profile.level,
      currentStreak: profile.currentStreak,
      longestStreak: profile.longestStreak,
      streakFreezeCount: profile.streakFreezeCount,
      subscriptionTier: profile.subscriptionTier,
      createdAt: profile.createdAt,
    };
  }),

  // Update profile
  update: protectedProcedure
    .input(
      z.object({
        displayName: z.string().min(1).max(50).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      const [updated] = await db
        .update(profiles)
        .set({
          displayName: input.displayName,
          updatedAt: new Date(),
        })
        .where(eq(profiles.id, userId))
        .returning();

      return {
        id: updated.id,
        email: updated.email,
        displayName: updated.displayName,
      };
    }),

  // Use streak freeze
  useStreakFreeze: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.user.id;

    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, userId));

    if (!profile) {
      throw new Error('Profile not found');
    }

    if ((profile.streakFreezeCount || 0) <= 0) {
      throw new Error('No streak freezes available');
    }

    // Use a freeze
    const [updated] = await db
      .update(profiles)
      .set({
        streakFreezeCount: (profile.streakFreezeCount || 0) - 1,
        // Extend last practice date to today to preserve streak
        lastPracticeDate: new Date().toISOString().split('T')[0],
        updatedAt: new Date(),
      })
      .where(eq(profiles.id, userId))
      .returning();

    return {
      success: true,
      remainingFreezes: updated.streakFreezeCount,
    };
  }),

  // Get streak freeze status
  getStreakFreezeStatus: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    const [profile] = await db
      .select({
        streakFreezeCount: profiles.streakFreezeCount,
        currentStreak: profiles.currentStreak,
        lastPracticeDate: profiles.lastPracticeDate,
      })
      .from(profiles)
      .where(eq(profiles.id, userId));

    if (!profile) {
      return {
        available: 0,
        canUse: false,
        streakAtRisk: false,
      };
    }

    // Check if streak is at risk (didn't practice today)
    const today = new Date().toISOString().split('T')[0];
    const lastPractice = profile.lastPracticeDate;
    const hasActvityToday = lastPractice === today;

    // Streak is at risk if user hasn't practiced today and has a streak > 0
    const streakAtRisk = !hasActvityToday && (profile.currentStreak || 0) > 0;

    return {
      available: profile.streakFreezeCount || 0,
      canUse: streakAtRisk && (profile.streakFreezeCount || 0) > 0,
      streakAtRisk,
    };
  }),
});
