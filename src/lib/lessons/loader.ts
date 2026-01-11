import { db } from '@/lib/db';
import { lessons } from '@/lib/db/schema';
import { eq, and, asc } from 'drizzle-orm';
import type { Lesson, RubricItem } from '@/types/lesson';
import type { DbLesson } from '@/lib/db/schema';

/**
 * Transform database row to Lesson interface
 */
function transformDbToLesson(row: DbLesson): Lesson {
  return {
    id: row.id,
    version: row.version,
    meta: {
      stage: row.stage as 1 | 2 | 3 | 4,
      skill: row.skill,
      difficulty: row.difficulty as 1 | 2 | 3 | 4 | 5,
      estimatedMinutes: row.estimatedMinutes,
      prerequisites: (row.prerequisites as string[]) || [],
      tags: (row.tags as string[]) || [],
    },
    scenario: {
      title: row.title,
      context: row.context,
      goal: row.goal,
      constraints: row.constraints as string[],
      exampleInput: row.exampleInput || undefined,
      hints: row.hints as string[],
    },
    evaluation: {
      rubric: row.rubric as RubricItem[],
      passingScore: row.passingScore,
    },
    evaluatorContext: {
      idealResponse: row.idealResponse || '',
      commonMistakes: (row.commonMistakes as string[]) || [],
      keyElements: (row.keyElements as string[]) || [],
      antiPatterns: (row.antiPatterns as string[]) || [],
    },
  };
}

/**
 * Load a single lesson by ID
 */
export async function loadLesson(lessonId: string): Promise<Lesson | null> {
  const [row] = await db
    .select()
    .from(lessons)
    .where(and(eq(lessons.id, lessonId), eq(lessons.isPublished, true)));

  if (!row) return null;
  return transformDbToLesson(row);
}

/**
 * Load all lessons for a specific stage
 */
export async function loadLessonsByStage(stage: number): Promise<Lesson[]> {
  const rows = await db
    .select()
    .from(lessons)
    .where(and(eq(lessons.stage, stage), eq(lessons.isPublished, true)))
    .orderBy(asc(lessons.skill), asc(lessons.difficulty));

  return rows.map(transformDbToLesson);
}

/**
 * Load all published lessons across all stages
 */
export async function loadAllLessons(): Promise<Lesson[]> {
  const rows = await db
    .select()
    .from(lessons)
    .where(eq(lessons.isPublished, true))
    .orderBy(asc(lessons.stage), asc(lessons.skill), asc(lessons.difficulty));

  return rows.map(transformDbToLesson);
}

/**
 * Get lesson count by stage (for progress tracking)
 */
export async function getLessonCountByStage(stage: number): Promise<number> {
  const rows = await db
    .select()
    .from(lessons)
    .where(and(eq(lessons.stage, stage), eq(lessons.isPublished, true)));

  return rows.length;
}

/**
 * Get lessons by skill for a specific stage
 */
export async function loadLessonsBySkill(stage: number, skill: string): Promise<Lesson[]> {
  const rows = await db
    .select()
    .from(lessons)
    .where(
      and(
        eq(lessons.stage, stage),
        eq(lessons.skill, skill),
        eq(lessons.isPublished, true)
      )
    )
    .orderBy(asc(lessons.difficulty));

  return rows.map(transformDbToLesson);
}
