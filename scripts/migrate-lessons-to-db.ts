/**
 * Migration script to import lesson JSON files into the database.
 * Run with: npx tsx scripts/migrate-lessons-to-db.ts
 */

import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { lessons } from '../src/lib/db/schema';
import type { Lesson } from '../src/types/lesson';

// Initialize database connection
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}
const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

const CONTENT_DIR = path.join(process.cwd(), 'content', 'lessons');

interface LessonFile {
  path: string;
  data: Lesson;
}

/**
 * Recursively find all JSON files in a directory
 */
function findJsonFiles(dir: string): string[] {
  const files: string[] = [];

  if (!fs.existsSync(dir)) {
    console.log(`Directory not found: ${dir}`);
    return files;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findJsonFiles(fullPath));
    } else if (entry.name.endsWith('.json')) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Load and parse a lesson JSON file
 */
function loadLessonFile(filePath: string): LessonFile | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content) as Lesson;
    return { path: filePath, data };
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error);
    return null;
  }
}

/**
 * Transform a Lesson object to database row format
 */
function lessonToDbRow(lesson: Lesson) {
  return {
    id: lesson.id,
    version: lesson.version,
    stage: lesson.meta.stage,
    skill: lesson.meta.skill,
    difficulty: lesson.meta.difficulty,
    estimatedMinutes: lesson.meta.estimatedMinutes,
    prerequisites: lesson.meta.prerequisites,
    tags: lesson.meta.tags,

    title: lesson.scenario.title,
    context: lesson.scenario.context,
    goal: lesson.scenario.goal,
    constraints: lesson.scenario.constraints,
    exampleInput: lesson.scenario.exampleInput || null,
    hints: lesson.scenario.hints,

    rubric: lesson.evaluation.rubric,
    passingScore: lesson.evaluation.passingScore,

    idealResponse: lesson.evaluatorContext.idealResponse || null,
    commonMistakes: lesson.evaluatorContext.commonMistakes,
    keyElements: lesson.evaluatorContext.keyElements,
    antiPatterns: lesson.evaluatorContext.antiPatterns,

    isPublished: true,
  };
}

async function main() {
  console.log('🔍 Searching for lesson files...\n');

  const jsonFiles = findJsonFiles(CONTENT_DIR);
  console.log(`Found ${jsonFiles.length} JSON files\n`);

  if (jsonFiles.length === 0) {
    console.log('No lesson files found. Exiting.');
    return;
  }

  // Load all lesson files
  const lessonFiles: LessonFile[] = [];
  for (const filePath of jsonFiles) {
    const lesson = loadLessonFile(filePath);
    if (lesson) {
      lessonFiles.push(lesson);
    }
  }

  console.log(`✅ Loaded ${lessonFiles.length} lessons successfully\n`);

  // Group by stage for reporting
  const byStage: Record<number, LessonFile[]> = {};
  for (const lf of lessonFiles) {
    const stage = lf.data.meta.stage;
    if (!byStage[stage]) byStage[stage] = [];
    byStage[stage].push(lf);
  }

  console.log('📊 Lessons by stage:');
  for (const [stage, files] of Object.entries(byStage)) {
    console.log(`   Stage ${stage}: ${files.length} lessons`);
  }
  console.log('');

  // Insert into database
  console.log('📥 Inserting lessons into database...\n');

  let inserted = 0;
  let skipped = 0;

  for (const lf of lessonFiles) {
    try {
      const row = lessonToDbRow(lf.data);

      // Upsert - insert or update on conflict
      await db.insert(lessons)
        .values(row)
        .onConflictDoUpdate({
          target: lessons.id,
          set: {
            ...row,
            updatedAt: new Date(),
          },
        });

      console.log(`   ✓ ${lf.data.id} - ${lf.data.scenario.title}`);
      inserted++;
    } catch (error) {
      console.error(`   ✗ ${lf.data.id} - Error:`, error);
      skipped++;
    }
  }

  console.log('\n📈 Migration complete!');
  console.log(`   Inserted/Updated: ${inserted}`);
  console.log(`   Skipped (errors): ${skipped}`);
}

main().catch(console.error);
