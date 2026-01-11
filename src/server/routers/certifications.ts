import { z } from 'zod';
import { router, protectedProcedure, publicProcedure } from '../trpc';
import { db } from '@/lib/db';
import { certifications, profiles, attempts, lessons } from '@/lib/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import crypto from 'crypto';

// Stage certification requirements
const STAGE_REQUIREMENTS = {
  1: { minLessons: 12, minAvgScore: 70, name: 'Prompt Engineer L1' },
  2: { minLessons: 12, minAvgScore: 70, name: 'AI Systems Designer L2' },
  3: { minLessons: 12, minAvgScore: 70, name: 'AI Automation Specialist L3' },
  4: { minLessons: 12, minAvgScore: 70, name: 'AI Product Builder L4' },
};

function generateVerificationCode(): string {
  return crypto.randomBytes(8).toString('hex').toUpperCase();
}

export const certificationsRouter = router({
  // Get user's certifications
  list: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    const certs = await db
      .select()
      .from(certifications)
      .where(eq(certifications.userId, userId));

    return certs.map((cert) => ({
      id: cert.id,
      type: cert.certificationType,
      name: STAGE_REQUIREMENTS[parseInt(cert.certificationType.replace('stage_', '')) as keyof typeof STAGE_REQUIREMENTS]?.name || cert.certificationType,
      score: cert.score,
      issuedAt: cert.issuedAt,
      verificationCode: cert.verificationCode,
    }));
  }),

  // Check eligibility for a stage certification
  checkEligibility: protectedProcedure
    .input(z.object({ stage: z.number().min(1).max(4) }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const { stage } = input;
      const requirements = STAGE_REQUIREMENTS[stage as keyof typeof STAGE_REQUIREMENTS];

      // Check if already certified
      const [existing] = await db
        .select()
        .from(certifications)
        .where(
          and(
            eq(certifications.userId, userId),
            eq(certifications.certificationType, `stage_${stage}`)
          )
        );

      if (existing) {
        return {
          eligible: false,
          alreadyCertified: true,
          certificationId: existing.id,
          verificationCode: existing.verificationCode,
        };
      }

      // Count passed lessons in this stage
      const passedLessons = await db
        .select({
          lessonId: attempts.lessonId,
          bestScore: sql<number>`MAX(${attempts.score})`,
        })
        .from(attempts)
        .innerJoin(lessons, eq(attempts.lessonId, lessons.id))
        .where(
          and(
            eq(attempts.userId, userId),
            eq(lessons.stage, stage),
            sql`${attempts.score} >= 70`
          )
        )
        .groupBy(attempts.lessonId);

      const passedCount = passedLessons.length;
      const avgScore = passedLessons.length > 0
        ? passedLessons.reduce((sum, l) => sum + l.bestScore, 0) / passedLessons.length
        : 0;

      return {
        eligible: passedCount >= requirements.minLessons && avgScore >= requirements.minAvgScore,
        alreadyCertified: false,
        progress: {
          lessonsCompleted: passedCount,
          lessonsRequired: requirements.minLessons,
          averageScore: Math.round(avgScore),
          requiredScore: requirements.minAvgScore,
        },
      };
    }),

  // Issue a certification
  issue: protectedProcedure
    .input(z.object({ stage: z.number().min(1).max(4) }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const { stage } = input;
      const requirements = STAGE_REQUIREMENTS[stage as keyof typeof STAGE_REQUIREMENTS];

      // Verify eligibility
      const passedLessons = await db
        .select({
          lessonId: attempts.lessonId,
          bestScore: sql<number>`MAX(${attempts.score})`,
        })
        .from(attempts)
        .innerJoin(lessons, eq(attempts.lessonId, lessons.id))
        .where(
          and(
            eq(attempts.userId, userId),
            eq(lessons.stage, stage),
            sql`${attempts.score} >= 70`
          )
        )
        .groupBy(attempts.lessonId);

      const passedCount = passedLessons.length;
      const avgScore = passedLessons.length > 0
        ? passedLessons.reduce((sum, l) => sum + l.bestScore, 0) / passedLessons.length
        : 0;

      if (passedCount < requirements.minLessons || avgScore < requirements.minAvgScore) {
        throw new Error('Not eligible for certification');
      }

      // Check if already certified
      const [existing] = await db
        .select()
        .from(certifications)
        .where(
          and(
            eq(certifications.userId, userId),
            eq(certifications.certificationType, `stage_${stage}`)
          )
        );

      if (existing) {
        throw new Error('Already certified for this stage');
      }

      // Issue certification
      const verificationCode = generateVerificationCode();
      const [cert] = await db
        .insert(certifications)
        .values({
          userId,
          certificationType: `stage_${stage}`,
          score: Math.round(avgScore),
          verificationCode,
        })
        .returning();

      // Unlock next stage if applicable
      if (stage < 4) {
        await db
          .update(profiles)
          .set({
            currentStage: stage + 1,
            updatedAt: new Date(),
          })
          .where(eq(profiles.id, userId));
      }

      return {
        id: cert.id,
        name: requirements.name,
        score: cert.score,
        verificationCode: cert.verificationCode,
        issuedAt: cert.issuedAt,
      };
    }),

  // Verify a certification (public endpoint)
  verify: publicProcedure
    .input(z.object({ code: z.string() }))
    .query(async ({ input }) => {
      const [cert] = await db
        .select({
          id: certifications.id,
          type: certifications.certificationType,
          score: certifications.score,
          issuedAt: certifications.issuedAt,
          userEmail: profiles.email,
          userName: profiles.displayName,
        })
        .from(certifications)
        .innerJoin(profiles, eq(certifications.userId, profiles.id))
        .where(eq(certifications.verificationCode, input.code.toUpperCase()));

      if (!cert) {
        return { valid: false };
      }

      const stage = parseInt(cert.type.replace('stage_', ''));
      const certName = STAGE_REQUIREMENTS[stage as keyof typeof STAGE_REQUIREMENTS]?.name || cert.type;

      return {
        valid: true,
        certification: {
          name: certName,
          score: cert.score,
          issuedAt: cert.issuedAt,
          holderName: cert.userName || cert.userEmail?.split('@')[0],
        },
      };
    }),
});
