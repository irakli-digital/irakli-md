import fs from 'fs';
import path from 'path';
import type { Lesson } from '@/types/lesson';

const LESSONS_DIR = path.join(process.cwd(), 'content/lessons');

export async function loadLesson(lessonId: string): Promise<Lesson | null> {
  // Parse lesson ID: S1-CLARITY-001 -> stage-1/clarity/S1-CLARITY-001.json
  const match = lessonId.match(/^S(\d)-([A-Z_]+)-(\d+)$/);
  if (!match) return null;

  const [, stage, skill] = match;
  const filePath = path.join(
    LESSONS_DIR,
    `stage-${stage}`,
    skill.toLowerCase().replace('_', '-'),
    `${lessonId}.json`
  );

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as Lesson;
  } catch {
    return null;
  }
}

export async function loadLessonsByStage(stage: number): Promise<Lesson[]> {
  const stageDir = path.join(LESSONS_DIR, `stage-${stage}`);
  const lessons: Lesson[] = [];

  try {
    const skills = fs.readdirSync(stageDir);

    for (const skill of skills) {
      const skillDir = path.join(stageDir, skill);
      if (!fs.statSync(skillDir).isDirectory()) continue;

      const files = fs.readdirSync(skillDir).filter((f) => f.endsWith('.json'));

      for (const file of files) {
        try {
          const content = fs.readFileSync(path.join(skillDir, file), 'utf-8');
          lessons.push(JSON.parse(content) as Lesson);
        } catch {
          // Skip invalid files
        }
      }
    }
  } catch {
    // Directory doesn't exist yet
  }

  return lessons.sort((a, b) => {
    // Sort by stage, then skill, then difficulty
    if (a.meta.stage !== b.meta.stage) return a.meta.stage - b.meta.stage;
    if (a.meta.skill !== b.meta.skill) return a.meta.skill.localeCompare(b.meta.skill);
    return a.meta.difficulty - b.meta.difficulty;
  });
}

export async function loadAllLessons(): Promise<Lesson[]> {
  const allLessons: Lesson[] = [];

  for (let stage = 1; stage <= 4; stage++) {
    const stageLessons = await loadLessonsByStage(stage);
    allLessons.push(...stageLessons);
  }

  return allLessons;
}
