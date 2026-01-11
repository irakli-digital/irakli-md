/**
 * Seed script to create demo users with realistic progress data.
 * Run with: npm run db:seed
 * Run with fresh data: npm run db:seed:fresh
 */

import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq, like } from 'drizzle-orm';
import {
  profiles,
  userSkills,
  attempts,
  achievements as achievementsTable,
  dailyActivity,
} from '../src/lib/db/schema';

// Initialize database connection
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}
const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

// Demo user configurations
const DEMO_USERS = [
  {
    email: 'beginner@demo.ailit.dev',
    displayName: 'Demo Beginner',
    level: 2,
    totalXp: 350,
    currentStreak: 3,
    longestStreak: 5,
    currentStage: 1,
    scenariosCompleted: 3,
    avgScore: 72,
    achievements: ['first_steps', 'on_a_roll'],
    streakDays: 3,
  },
  {
    email: 'intermediate@demo.ailit.dev',
    displayName: 'Demo Intermediate',
    level: 8,
    totalXp: 2800,
    currentStreak: 12,
    longestStreak: 15,
    currentStage: 1,
    scenariosCompleted: 10,
    avgScore: 78,
    achievements: ['first_steps', 'getting_started', 'on_a_roll', 'week_warrior', 'perfectionist', 'natural_talent', 'rising_star', 'dedicated_learner'],
    streakDays: 12,
  },
  {
    email: 'advanced@demo.ailit.dev',
    displayName: 'Demo Advanced',
    level: 15,
    totalXp: 8500,
    currentStreak: 28,
    longestStreak: 35,
    currentStage: 1,
    scenariosCompleted: 15,
    avgScore: 85,
    achievements: ['first_steps', 'getting_started', 'dedicated_learner', 'on_a_roll', 'week_warrior', 'fortnight_force', 'perfectionist', 'consistent_quality', 'natural_talent', 'prodigy', 'clarity_expert', 'context_master', 'constraint_champion', 'prompt_engineer', 'rising_star'],
    streakDays: 28,
  },
  {
    email: 'power@demo.ailit.dev',
    displayName: 'Demo Power User',
    level: 22,
    totalXp: 18000,
    currentStreak: 45,
    longestStreak: 60,
    currentStage: 1,
    scenariosCompleted: 15,
    avgScore: 92,
    achievements: ['first_steps', 'getting_started', 'dedicated_learner', 'prompt_master', 'on_a_roll', 'week_warrior', 'fortnight_force', 'monthly_master', 'perfectionist', 'consistent_quality', 'excellence', 'natural_talent', 'prodigy', 'clarity_expert', 'context_master', 'constraint_champion', 'logic_lord', 'output_architect', 'prompt_engineer', 'rising_star', 'seasoned_practitioner', 'self_reliant', 'independent_thinker', 'speed_demon', 'expert'],
    streakDays: 45,
  },
  {
    email: 'inactive@demo.ailit.dev',
    displayName: 'Demo Inactive',
    level: 3,
    totalXp: 450,
    currentStreak: 0,
    longestStreak: 8,
    currentStage: 1,
    scenariosCompleted: 4,
    avgScore: 70,
    achievements: ['first_steps', 'on_a_roll', 'getting_started'],
    streakDays: 0,
    lastActiveDaysAgo: 14,
  },
];

// Stage 1 skills and lessons
const STAGE_1_SKILLS = ['clarity', 'context', 'constraints', 'reasoning', 'output-shaping'];
const LESSONS_PER_SKILL = 3;

// Sample prompt texts for attempts
const SAMPLE_PROMPTS = [
  "Please help me draft an email to my manager about the quarterly report. I need it to be professional and include the key metrics from last quarter.",
  "I need you to analyze this data and provide insights. Focus on trends and actionable recommendations.",
  "Write a summary of this article, highlighting the main points and key takeaways in bullet form.",
  "Help me create a project proposal that outlines the scope, timeline, and required resources.",
  "Review this code and suggest improvements for readability and performance.",
];

// Sample feedback for attempts
const generateFeedback = (score: number) => ({
  totalScore: score,
  rubricScores: [
    { criterionId: 'clarity', score: Math.round(score * 0.95 + Math.random() * 10), weight: 30 },
    { criterionId: 'context', score: Math.round(score * 0.9 + Math.random() * 15), weight: 30 },
    { criterionId: 'actionability', score: Math.round(score * 1.05 - Math.random() * 10), weight: 25 },
    { criterionId: 'professionalism', score: Math.round(score * 1.0 + Math.random() * 5), weight: 15 },
  ],
  overallFeedback: {
    strengths: ['Clear structure', 'Good context provided'],
    weaknesses: score < 80 ? ['Could be more specific', 'Missing some constraints'] : [],
    primaryIssue: score < 70 ? 'Prompt could benefit from more specific requirements' : null,
    suggestion: 'Consider adding explicit output format requirements',
  },
  encouragement: score >= 90 ? 'Excellent work!' : score >= 70 ? 'Good job, keep practicing!' : 'Keep at it, you\'re improving!',
});

async function clearDemoData() {
  console.log('🧹 Clearing existing demo data...\n');

  // Find demo user IDs
  const demoProfiles = await db
    .select({ id: profiles.id })
    .from(profiles)
    .where(like(profiles.email, '%@demo.ailit.dev'));

  if (demoProfiles.length === 0) {
    console.log('   No existing demo data found.\n');
    return;
  }

  const demoIds = demoProfiles.map((p) => p.id);
  console.log(`   Found ${demoIds.length} demo users to remove.\n`);

  // Delete related data (cascades should handle this, but being explicit)
  for (const id of demoIds) {
    await db.delete(dailyActivity).where(eq(dailyActivity.userId, id));
    await db.delete(achievementsTable).where(eq(achievementsTable.userId, id));
    await db.delete(attempts).where(eq(attempts.userId, id));
    await db.delete(userSkills).where(eq(userSkills.userId, id));
    await db.delete(profiles).where(eq(profiles.id, id));
  }

  console.log('   ✓ Demo data cleared.\n');
}

async function seedUser(userConfig: typeof DEMO_USERS[0]) {
  console.log(`\n👤 Creating user: ${userConfig.displayName}`);

  // Calculate last practice date
  const today = new Date();
  const lastPracticeDate = new Date(today);
  if (userConfig.lastActiveDaysAgo) {
    lastPracticeDate.setDate(today.getDate() - userConfig.lastActiveDaysAgo);
  } else if (userConfig.currentStreak === 0) {
    lastPracticeDate.setDate(today.getDate() - 14);
  }

  // 1. Create profile
  const [profile] = await db
    .insert(profiles)
    .values({
      email: userConfig.email,
      displayName: userConfig.displayName,
      currentStage: userConfig.currentStage,
      totalXp: userConfig.totalXp,
      level: userConfig.level,
      currentStreak: userConfig.currentStreak,
      longestStreak: userConfig.longestStreak,
      lastPracticeDate: lastPracticeDate.toISOString().split('T')[0],
      subscriptionTier: 'trial',
      trialStartDate: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      trialEndDate: new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000), // 4 days left
    })
    .returning();

  console.log(`   ✓ Profile created (Level ${userConfig.level}, ${userConfig.totalXp} XP)`);

  // 2. Create skill progress
  let lessonsCreated = 0;
  for (const skill of STAGE_1_SKILLS) {
    const skillLessonsCompleted = Math.min(
      LESSONS_PER_SKILL,
      Math.ceil(userConfig.scenariosCompleted / STAGE_1_SKILLS.length)
    );

    await db.insert(userSkills).values({
      userId: profile.id,
      skillId: skill,
      scenariosCompleted: skillLessonsCompleted,
      scenariosAvailable: LESSONS_PER_SKILL,
      bestScore: userConfig.avgScore + Math.floor(Math.random() * 10),
      averageScore: userConfig.avgScore.toString(),
      totalAttempts: skillLessonsCompleted + Math.floor(Math.random() * 3),
      masteryLevel: skillLessonsCompleted === LESSONS_PER_SKILL ? 5 : Math.min(skillLessonsCompleted, 3),
      isUnlocked: true,
      unlockedAt: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
      completedAt: skillLessonsCompleted === LESSONS_PER_SKILL ? new Date() : null,
    });

    lessonsCreated += skillLessonsCompleted;
  }
  console.log(`   ✓ Skill progress created (${lessonsCreated} scenarios completed)`);

  // 3. Create attempts
  let attemptsCreated = 0;
  for (let i = 0; i < userConfig.scenariosCompleted; i++) {
    const skillIndex = i % STAGE_1_SKILLS.length;
    const lessonNum = Math.floor(i / STAGE_1_SKILLS.length) + 1;
    const skill = STAGE_1_SKILLS[skillIndex];
    const lessonId = `S1-${skill.toUpperCase().replace('-', '_')}-00${lessonNum}`;

    // Create 1-3 attempts per lesson
    const numAttempts = Math.floor(Math.random() * 3) + 1;
    for (let attemptNum = 1; attemptNum <= numAttempts; attemptNum++) {
      const isPassingAttempt = attemptNum === numAttempts;
      const baseScore = isPassingAttempt ? userConfig.avgScore : userConfig.avgScore - 15;
      const score = Math.max(50, Math.min(100, baseScore + Math.floor(Math.random() * 20) - 10));

      const attemptDate = new Date(today);
      attemptDate.setDate(today.getDate() - (userConfig.scenariosCompleted - i) * 2);

      await db.insert(attempts).values({
        userId: profile.id,
        lessonId,
        promptText: SAMPLE_PROMPTS[Math.floor(Math.random() * SAMPLE_PROMPTS.length)],
        submittedAt: attemptDate,
        score,
        feedback: generateFeedback(score),
        rubricScores: generateFeedback(score).rubricScores,
        evaluationModel: 'claude-3-5-sonnet-20241022',
        evaluationLatencyMs: 1500 + Math.floor(Math.random() * 1000),
        attemptNumber: attemptNum,
        timeSpentSeconds: 120 + Math.floor(Math.random() * 180),
        hintsUsed: Math.random() > 0.7 ? 1 : 0,
      });

      attemptsCreated++;
    }
  }
  console.log(`   ✓ ${attemptsCreated} attempts created`);

  // 4. Create achievements
  for (const achievementType of userConfig.achievements) {
    await db.insert(achievementsTable).values({
      userId: profile.id,
      achievementType,
      achievementData: { category: 'general', rarity: 'common' },
      unlockedAt: new Date(today.getTime() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
    });
  }
  console.log(`   ✓ ${userConfig.achievements.length} achievements unlocked`);

  // 5. Create daily activity for streak
  if (userConfig.streakDays > 0) {
    for (let dayOffset = 0; dayOffset < userConfig.streakDays; dayOffset++) {
      const activityDate = new Date(today);
      activityDate.setDate(today.getDate() - dayOffset);

      await db.insert(dailyActivity).values({
        userId: profile.id,
        activityDate: activityDate.toISOString().split('T')[0],
        scenariosCompleted: Math.floor(Math.random() * 3) + 1,
        xpEarned: 100 + Math.floor(Math.random() * 200),
        timeSpentSeconds: 300 + Math.floor(Math.random() * 600),
      });
    }
    console.log(`   ✓ ${userConfig.streakDays} days of activity created`);
  }
}

async function main() {
  const isFresh = process.argv.includes('--fresh');

  console.log('🌱 AI Literacy Platform - Database Seeder\n');
  console.log('==========================================\n');

  if (isFresh) {
    await clearDemoData();
  }

  console.log('📥 Creating demo users...');

  for (const userConfig of DEMO_USERS) {
    try {
      await seedUser(userConfig);
    } catch (error) {
      console.error(`   ✗ Error creating ${userConfig.displayName}:`, error);
    }
  }

  console.log('\n==========================================');
  console.log('✅ Seeding complete!\n');
  console.log('Demo accounts created:');
  for (const user of DEMO_USERS) {
    console.log(`   • ${user.email} (Level ${user.level}, ${user.totalXp} XP)`);
  }
  console.log('\nNote: Demo users have trial subscriptions active.');
  console.log('You can log in as any demo user via NextAuth credentials.');
}

main().catch(console.error);
