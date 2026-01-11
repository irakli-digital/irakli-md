import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { db } from '@/lib/db';
import { reflections, attempts, lessons } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { anthropic } from '@/lib/anthropic/client';
import { REFLECTION_ANALYZER_PROMPT, buildReflectionUserPrompt } from '@/lib/prompts/reflection';

export interface ReflectionInsights {
  understandingLevel: 'strong' | 'moderate' | 'weak';
  misconceptions: string[];
  correctInsights: string[];
  reinforcementNeeded: string[];
  nextRecommendation: string;
  encouragement: string;
}

async function analyzeReflection(
  scenarioTitle: string,
  score: number,
  passed: boolean,
  reflectionText: string
): Promise<ReflectionInsights> {
  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1000,
    messages: [
      {
        role: 'user',
        content: buildReflectionUserPrompt(scenarioTitle, score, passed, reflectionText),
      },
    ],
    system: REFLECTION_ANALYZER_PROMPT,
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type');
  }

  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No JSON found in response');
  }

  return JSON.parse(jsonMatch[0]) as ReflectionInsights;
}

export const reflectionsRouter = router({
  // Submit a reflection for an attempt
  submit: protectedProcedure
    .input(
      z.object({
        attemptId: z.string().uuid(),
        reflectionText: z.string().min(10).max(2000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      // Get the attempt and verify ownership
      const [attempt] = await db
        .select({
          id: attempts.id,
          userId: attempts.userId,
          lessonId: attempts.lessonId,
          score: attempts.score,
        })
        .from(attempts)
        .where(eq(attempts.id, input.attemptId));

      if (!attempt || attempt.userId !== userId) {
        throw new Error('Attempt not found');
      }

      // Check if reflection already exists
      const [existing] = await db
        .select()
        .from(reflections)
        .where(eq(reflections.attemptId, input.attemptId));

      if (existing) {
        throw new Error('Reflection already submitted for this attempt');
      }

      // Get lesson info
      const [lesson] = await db
        .select({ title: lessons.title })
        .from(lessons)
        .where(eq(lessons.id, attempt.lessonId));

      // Analyze reflection with AI
      const insights = await analyzeReflection(
        lesson?.title || 'Unknown Scenario',
        attempt.score || 0,
        (attempt.score || 0) >= 70,
        input.reflectionText
      );

      // Save reflection
      const [reflection] = await db
        .insert(reflections)
        .values({
          userId,
          attemptId: input.attemptId,
          reflectionText: input.reflectionText,
          extractedInsights: insights,
        })
        .returning();

      return {
        id: reflection.id,
        insights,
      };
    }),

  // Get reflection for an attempt
  getByAttempt: protectedProcedure
    .input(z.object({ attemptId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      const [reflection] = await db
        .select()
        .from(reflections)
        .where(
          and(
            eq(reflections.attemptId, input.attemptId),
            eq(reflections.userId, userId)
          )
        );

      if (!reflection) {
        return null;
      }

      return {
        id: reflection.id,
        text: reflection.reflectionText,
        insights: reflection.extractedInsights as ReflectionInsights | null,
        createdAt: reflection.createdAt,
      };
    }),

  // Get recent reflections for user
  getRecent: protectedProcedure
    .input(z.object({ limit: z.number().default(5) }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      const recentReflections = await db
        .select({
          id: reflections.id,
          text: reflections.reflectionText,
          insights: reflections.extractedInsights,
          createdAt: reflections.createdAt,
          lessonId: attempts.lessonId,
          score: attempts.score,
        })
        .from(reflections)
        .innerJoin(attempts, eq(reflections.attemptId, attempts.id))
        .where(eq(reflections.userId, userId))
        .orderBy(desc(reflections.createdAt))
        .limit(input.limit);

      return recentReflections.map((r) => ({
        id: r.id,
        text: r.text,
        insights: r.insights as ReflectionInsights | null,
        createdAt: r.createdAt,
        lessonId: r.lessonId,
        score: r.score,
      }));
    }),

  // Get learning insights summary (aggregated from all reflections)
  getInsightsSummary: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    const allReflections = await db
      .select({
        insights: reflections.extractedInsights,
      })
      .from(reflections)
      .where(eq(reflections.userId, userId));

    if (allReflections.length === 0) {
      return {
        totalReflections: 0,
        understandingBreakdown: { strong: 0, moderate: 0, weak: 0 },
        commonMisconceptions: [],
        areasToImprove: [],
      };
    }

    // Aggregate insights
    const understandingBreakdown = { strong: 0, moderate: 0, weak: 0 };
    const misconceptionsCount: Record<string, number> = {};
    const reinforcementCount: Record<string, number> = {};

    for (const r of allReflections) {
      const insights = r.insights as ReflectionInsights | null;
      if (!insights) continue;

      understandingBreakdown[insights.understandingLevel]++;

      for (const m of insights.misconceptions) {
        misconceptionsCount[m] = (misconceptionsCount[m] || 0) + 1;
      }

      for (const area of insights.reinforcementNeeded) {
        reinforcementCount[area] = (reinforcementCount[area] || 0) + 1;
      }
    }

    // Get top misconceptions and areas to improve
    const commonMisconceptions = Object.entries(misconceptionsCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([text, count]) => ({ text, count }));

    const areasToImprove = Object.entries(reinforcementCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([text, count]) => ({ text, count }));

    return {
      totalReflections: allReflections.length,
      understandingBreakdown,
      commonMisconceptions,
      areasToImprove,
    };
  }),
});
