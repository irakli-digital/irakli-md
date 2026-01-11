import { z } from 'zod';
import { router, adminProcedure } from '../../trpc';
import {
  db,
  profiles,
  userSkills,
  attempts,
  achievements,
  dailyActivity,
} from '@/lib/db';
import { eq, and, or, ilike, desc, asc, sql, count } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

export const adminUsersRouter = router({
  // List users with pagination and filtering
  list: adminProcedure
    .input(
      z.object({
        search: z.string().optional(),
        subscriptionTier: z.enum(['free', 'trial', 'pro']).optional(),
        role: z.enum(['user', 'admin', 'moderator']).optional(),
        page: z.number().default(1),
        limit: z.number().default(20),
        sortBy: z
          .enum(['email', 'totalXp', 'level', 'createdAt'])
          .default('createdAt'),
        sortOrder: z.enum(['asc', 'desc']).default('desc'),
      })
    )
    .query(async ({ input }) => {
      const { search, subscriptionTier, role, page, limit, sortBy, sortOrder } =
        input;
      const offset = (page - 1) * limit;

      const conditions = [];
      if (subscriptionTier)
        conditions.push(eq(profiles.subscriptionTier, subscriptionTier));
      if (role) conditions.push(eq(profiles.role, role));
      if (search) {
        conditions.push(
          or(
            ilike(profiles.email, `%${search}%`),
            ilike(profiles.displayName, `%${search}%`)
          )
        );
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const [data, countResult] = await Promise.all([
        db
          .select()
          .from(profiles)
          .where(where)
          .orderBy(
            sortOrder === 'asc' ? asc(profiles[sortBy]) : desc(profiles[sortBy])
          )
          .limit(limit)
          .offset(offset),
        db
          .select({ count: sql<number>`count(*)` })
          .from(profiles)
          .where(where),
      ]);

      return {
        users: data,
        total: Number(countResult[0].count),
        page,
        totalPages: Math.ceil(Number(countResult[0].count) / limit),
      };
    }),

  // Get user details with stats
  getById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const [user] = await db
        .select()
        .from(profiles)
        .where(eq(profiles.id, input.id));
      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
      }

      // Get additional stats
      const [skills, attemptsCount, achievementsCount] = await Promise.all([
        db.select().from(userSkills).where(eq(userSkills.userId, input.id)),
        db
          .select({ count: count() })
          .from(attempts)
          .where(eq(attempts.userId, input.id)),
        db
          .select({ count: count() })
          .from(achievements)
          .where(eq(achievements.userId, input.id)),
      ]);

      return {
        ...user,
        stats: {
          skillsProgress: skills,
          totalAttempts: attemptsCount[0].count,
          achievementsUnlocked: achievementsCount[0].count,
        },
      };
    }),

  // Update user subscription
  updateSubscription: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        tier: z.enum(['free', 'trial', 'pro']),
        status: z.enum(['active', 'trial', 'expired', 'cancelled']).optional(),
        endDate: z.date().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { userId, tier, status, endDate } = input;

      const [updated] = await db
        .update(profiles)
        .set({
          subscriptionTier: tier,
          subscriptionStatus: status,
          subscriptionEndDate: endDate,
          updatedAt: new Date(),
        })
        .where(eq(profiles.id, userId))
        .returning();

      return updated;
    }),

  // Update user role
  updateRole: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        role: z.enum(['user', 'admin', 'moderator']),
      })
    )
    .mutation(async ({ input }) => {
      const [updated] = await db
        .update(profiles)
        .set({ role: input.role, updatedAt: new Date() })
        .where(eq(profiles.id, input.userId))
        .returning();

      return updated;
    }),

  // Reset user progress
  resetProgress: adminProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input }) => {
      const { userId } = input;

      // Delete all user progress data
      await Promise.all([
        db.delete(attempts).where(eq(attempts.userId, userId)),
        db.delete(userSkills).where(eq(userSkills.userId, userId)),
        db.delete(achievements).where(eq(achievements.userId, userId)),
        db.delete(dailyActivity).where(eq(dailyActivity.userId, userId)),
      ]);

      // Reset profile stats
      await db
        .update(profiles)
        .set({
          totalXp: 0,
          level: 1,
          currentStage: 1,
          currentStreak: 0,
          longestStreak: 0,
          lastPracticeDate: null,
          updatedAt: new Date(),
        })
        .where(eq(profiles.id, userId));

      return { success: true };
    }),
});
