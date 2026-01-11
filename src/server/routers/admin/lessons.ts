import { z } from 'zod';
import { router, adminProcedure } from '../../trpc';
import { db, lessons } from '@/lib/db';
import { eq, and, ilike, desc, asc, sql } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

const rubricItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  weight: z.number(),
  description: z.string(),
  scoringGuide: z.object({
    excellent: z.string(),
    good: z.string(),
    adequate: z.string(),
    poor: z.string(),
  }),
});

const lessonUpdateSchema = z.object({
  title: z.string().min(5).max(100).optional(),
  context: z.string().min(20).optional(),
  goal: z.string().min(10).optional(),
  constraints: z.array(z.string()).optional(),
  hints: z.array(z.string()).optional(),
  exampleInput: z.string().optional().nullable(),
  difficulty: z.number().min(1).max(5).optional(),
  estimatedMinutes: z.number().min(1).max(60).optional(),
  tags: z.array(z.string()).optional(),
  rubric: z.array(rubricItemSchema).optional(),
  passingScore: z.number().min(50).max(100).optional(),
  idealResponse: z.string().optional().nullable(),
  commonMistakes: z.array(z.string()).optional(),
  keyElements: z.array(z.string()).optional(),
  antiPatterns: z.array(z.string()).optional(),
  isPublished: z.boolean().optional(),
});

export const adminLessonsRouter = router({
  // List all lessons with pagination and filtering
  list: adminProcedure
    .input(
      z.object({
        stage: z.number().min(1).max(4).optional(),
        skill: z.string().optional(),
        isPublished: z.boolean().optional(),
        search: z.string().optional(),
        page: z.number().default(1),
        limit: z.number().default(20),
        sortBy: z
          .enum(['id', 'stage', 'skill', 'difficulty', 'updatedAt'])
          .default('id'),
        sortOrder: z.enum(['asc', 'desc']).default('asc'),
      })
    )
    .query(async ({ input }) => {
      const { stage, skill, isPublished, search, page, limit, sortBy, sortOrder } =
        input;
      const offset = (page - 1) * limit;

      const conditions = [];
      if (stage !== undefined) conditions.push(eq(lessons.stage, stage));
      if (skill) conditions.push(eq(lessons.skill, skill));
      if (isPublished !== undefined)
        conditions.push(eq(lessons.isPublished, isPublished));
      if (search) conditions.push(ilike(lessons.title, `%${search}%`));

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const [data, countResult] = await Promise.all([
        db
          .select()
          .from(lessons)
          .where(where)
          .orderBy(
            sortOrder === 'asc' ? asc(lessons[sortBy]) : desc(lessons[sortBy])
          )
          .limit(limit)
          .offset(offset),
        db
          .select({ count: sql<number>`count(*)` })
          .from(lessons)
          .where(where),
      ]);

      return {
        lessons: data,
        total: Number(countResult[0].count),
        page,
        totalPages: Math.ceil(Number(countResult[0].count) / limit),
      };
    }),

  // Get single lesson by ID
  getById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const [lesson] = await db
        .select()
        .from(lessons)
        .where(eq(lessons.id, input.id));
      if (!lesson) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Lesson not found' });
      }
      return lesson;
    }),

  // Update lesson
  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        data: lessonUpdateSchema,
      })
    )
    .mutation(async ({ input }) => {
      const { id, data } = input;

      // Validate rubric weights sum to 100
      if (data.rubric) {
        const totalWeight = data.rubric.reduce((sum, item) => sum + item.weight, 0);
        if (totalWeight !== 100) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `Rubric weights must sum to 100 (currently ${totalWeight})`,
          });
        }
      }

      const [updated] = await db
        .update(lessons)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(lessons.id, id))
        .returning();

      return updated;
    }),

  // Toggle publish status
  togglePublish: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const [lesson] = await db
        .select()
        .from(lessons)
        .where(eq(lessons.id, input.id));
      if (!lesson) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      const [updated] = await db
        .update(lessons)
        .set({ isPublished: !lesson.isPublished, updatedAt: new Date() })
        .where(eq(lessons.id, input.id))
        .returning();

      return updated;
    }),

  // Get unique skills list
  getSkills: adminProcedure.query(async () => {
    const result = await db
      .selectDistinct({ skill: lessons.skill, stage: lessons.stage })
      .from(lessons)
      .orderBy(lessons.stage, lessons.skill);
    return result;
  }),
});
