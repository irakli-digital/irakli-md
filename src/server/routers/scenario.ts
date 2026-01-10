import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { loadLesson, loadLessonsByStage } from '@/lib/lessons/loader';
import { TRPCError } from '@trpc/server';
import { db } from '@/lib/db';
import { profiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// Helper to check subscription access
async function checkSubscriptionAccess(userId: string, stage: number): Promise<{ hasAccess: boolean; message?: string }> {
  // Stage 1 is always free
  if (stage === 1) {
    return { hasAccess: true };
  }

  // Get user's subscription status
  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, userId));

  if (!profile) {
    return { hasAccess: false, message: 'Profile not found' };
  }

  const tier = profile.subscriptionTier || 'free';

  // Free users can only access Stage 1
  if (tier === 'free') {
    return { hasAccess: false, message: 'Start your free trial to access this content' };
  }

  // Check trial expiry
  if (tier === 'trial' && profile.trialEndDate) {
    const now = new Date();
    if (new Date(profile.trialEndDate) < now) {
      return { hasAccess: false, message: 'Trial expired. Subscribe to continue' };
    }
  }

  // Check subscription expiry
  if (tier === 'pro' && profile.subscriptionEndDate) {
    const now = new Date();
    if (new Date(profile.subscriptionEndDate) < now) {
      return { hasAccess: false, message: 'Subscription expired. Renew to continue' };
    }
  }

  // Trial and Pro users have access
  return { hasAccess: true };
}

export const scenarioRouter = router({
  getAvailable: protectedProcedure
    .input(
      z
        .object({
          stage: z.number().min(1).max(4).optional(),
          skill: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const stage = input?.stage ?? 1;

      // Check subscription access for Stage 2+
      const accessCheck = await checkSubscriptionAccess(ctx.user.id, stage);
      if (!accessCheck.hasAccess) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: accessCheck.message || 'Upgrade required',
        });
      }

      const lessons = await loadLessonsByStage(stage);

      // Filter by skill if provided
      if (input?.skill) {
        return lessons.filter((l) => l.meta.skill === input.skill);
      }

      // Return lessons without evaluator context
      return lessons.map(({ evaluatorContext, ...publicLesson }) => publicLesson);
    }),

  getById: protectedProcedure
    .input(z.object({ lessonId: z.string() }))
    .query(async ({ ctx, input }) => {
      const lesson = await loadLesson(input.lessonId);
      if (!lesson) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Lesson not found',
        });
      }

      // Check subscription access for Stage 2+
      const accessCheck = await checkSubscriptionAccess(ctx.user.id, lesson.meta.stage);
      if (!accessCheck.hasAccess) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: accessCheck.message || 'Upgrade required',
        });
      }

      // Remove evaluator context before sending to client
      const { evaluatorContext, ...publicLesson } = lesson;
      return publicLesson;
    }),

  // Check if user can access a specific stage (for UI purposes)
  canAccessStage: protectedProcedure
    .input(z.object({ stage: z.number().min(1).max(4) }))
    .query(async ({ ctx, input }) => {
      const accessCheck = await checkSubscriptionAccess(ctx.user.id, input.stage);
      return {
        canAccess: accessCheck.hasAccess,
        reason: accessCheck.message,
      };
    }),
});
