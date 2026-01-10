# AI Literacy Platform - Implementation Plan

## Pre-flight Checklist

### Environment Fix
Your `.env` has an issue - remove the `psql` prefix:
```bash
# WRONG:
DATABASE_URL=psql 'postgresql://...'

# CORRECT:
DATABASE_URL=postgresql://neondb_owner:npg_Xy5maP9HlfqC@ep-holy-resonance-agdg3783-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

---

## Phase 1: Project Foundation (Steps 1-8)

### Step 1: Initialize Next.js Project
```bash
cd "/Users/iraklichkheidze/Desktop/AI Projects/Digitalhub"
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```
Choose: Yes to all defaults

### Step 2: Install Core Dependencies
```bash
# Database (Neon + Drizzle)
npm install @neondatabase/serverless drizzle-orm
npm install -D drizzle-kit

# Auth
npm install next-auth@beta @auth/drizzle-adapter

# API Layer
npm install @trpc/server@next @trpc/client@next @trpc/react-query@next @trpc/next@next
npm install @tanstack/react-query superjson

# Validation
npm install zod

# AI
npm install @anthropic-ai/sdk

# UI Utilities
npm install clsx tailwind-merge lucide-react
npm install framer-motion
```

### Step 3: Initialize shadcn/ui
```bash
npx shadcn@latest init
```
Choose:
- Style: Default
- Base color: Slate
- CSS variables: Yes

```bash
# Install essential components
npx shadcn@latest add button card input textarea badge progress dialog
npx shadcn@latest add avatar dropdown-menu toast tabs accordion sheet
```

### Step 4: Create Project Structure
```bash
# Create all directories
mkdir -p src/lib/db
mkdir -p src/lib/prompts
mkdir -p src/lib/lessons
mkdir -p src/lib/auth
mkdir -p src/lib/anthropic
mkdir -p src/server/routers
mkdir -p src/components/scenario
mkdir -p src/components/exercise
mkdir -p src/components/feedback
mkdir -p src/components/gamification
mkdir -p src/components/progression
mkdir -p src/components/layout
mkdir -p src/types
mkdir -p src/hooks
mkdir -p content/lessons/stage-1/clarity
mkdir -p content/lessons/stage-1/constraints
mkdir -p content/lessons/stage-1/context
mkdir -p content/lessons/stage-1/reasoning
mkdir -p content/lessons/stage-1/output-shaping
mkdir -p content/skills
mkdir -p drizzle/migrations
mkdir -p scripts
```

### Step 5: Configure Environment Variables
Update `.env` file:
```env
# Database (Neon.tech)
DATABASE_URL=postgresql://neondb_owner:npg_Xy5maP9HlfqC@ep-holy-resonance-agdg3783-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require

# Auth (NextAuth.js)
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
NEXTAUTH_URL=http://localhost:3000

# Anthropic
ANTHROPIC_API_KEY=sk-ant-your-key-here

# Flitt.com (add later)
# FLITT_SECRET_KEY=
# FLITT_WEBHOOK_SECRET=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Generate secret: `openssl rand -base64 32`

### Step 6: Create Database Schema
Create `src/lib/db/schema.ts`:
```typescript
import { pgTable, uuid, text, integer, boolean, timestamp, date, decimal, jsonb } from 'drizzle-orm/pg-core';

// Users table
export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  displayName: text('display_name'),
  avatarUrl: text('avatar_url'),

  // Progression
  currentStage: integer('current_stage').default(1),
  totalXp: integer('total_xp').default(0),
  level: integer('level').default(1),

  // Streak
  currentStreak: integer('current_streak').default(0),
  longestStreak: integer('longest_streak').default(0),
  lastPracticeDate: date('last_practice_date'),
  streakFreezeCount: integer('streak_freeze_count').default(0),

  // Subscription
  subscriptionTier: text('subscription_tier').default('free'),
  subscriptionExpiresAt: timestamp('subscription_expires_at'),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// User skills progress
export const userSkills = pgTable('user_skills', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }),
  skillId: text('skill_id').notNull(),

  scenariosCompleted: integer('scenarios_completed').default(0),
  scenariosAvailable: integer('scenarios_available').notNull(),
  bestScore: integer('best_score').default(0),
  averageScore: decimal('average_score', { precision: 5, scale: 2 }),
  totalAttempts: integer('total_attempts').default(0),

  masteryLevel: integer('mastery_level').default(0),
  isUnlocked: boolean('is_unlocked').default(false),
  unlockedAt: timestamp('unlocked_at'),
  completedAt: timestamp('completed_at'),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Scenario attempts
export const attempts = pgTable('attempts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }),
  lessonId: text('lesson_id').notNull(),

  promptText: text('prompt_text').notNull(),
  submittedAt: timestamp('submitted_at').defaultNow(),

  score: integer('score'),
  feedback: jsonb('feedback'),
  rubricScores: jsonb('rubric_scores'),
  evaluationModel: text('evaluation_model'),
  evaluationLatencyMs: integer('evaluation_latency_ms'),

  attemptNumber: integer('attempt_number').notNull(),
  timeSpentSeconds: integer('time_spent_seconds'),
  hintsUsed: integer('hints_used').default(0),

  createdAt: timestamp('created_at').defaultNow(),
});

// Reflections
export const reflections = pgTable('reflections', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }),
  attemptId: uuid('attempt_id').references(() => attempts.id, { onDelete: 'cascade' }),

  reflectionText: text('reflection_text').notNull(),
  extractedInsights: jsonb('extracted_insights'),

  createdAt: timestamp('created_at').defaultNow(),
});

// Achievements
export const achievements = pgTable('achievements', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }),

  achievementType: text('achievement_type').notNull(),
  achievementData: jsonb('achievement_data'),

  unlockedAt: timestamp('unlocked_at').defaultNow(),
});

// Daily activity for streaks
export const dailyActivity = pgTable('daily_activity', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }),
  activityDate: date('activity_date').notNull(),

  scenariosCompleted: integer('scenarios_completed').default(0),
  xpEarned: integer('xp_earned').default(0),
  timeSpentSeconds: integer('time_spent_seconds').default(0),
});

// Certifications
export const certifications = pgTable('certifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }),

  certificationType: text('certification_type').notNull(),
  score: integer('score').notNull(),

  issuedAt: timestamp('issued_at').defaultNow(),
  verificationCode: text('verification_code').unique(),
});

// Type exports
export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
export type Attempt = typeof attempts.$inferSelect;
export type NewAttempt = typeof attempts.$inferInsert;
```

### Step 7: Create Database Client
Create `src/lib/db/index.ts`:
```typescript
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });

export * from './schema';
```

### Step 8: Configure Drizzle
Create `drizzle.config.ts` in project root:
```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/lib/db/schema.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

Add to `package.json` scripts:
```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  }
}
```

Run migration:
```bash
npm run db:push
```

---

## Phase 2: Authentication (Steps 9-12)

### Step 9: Create Auth Configuration
Create `src/lib/auth/index.ts`:
```typescript
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { db, profiles } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        // For MVP: simple email-based auth (add proper password hashing later)
        const { email } = parsed.data;

        let user = await db.query.profiles.findFirst({
          where: eq(profiles.email, email),
        });

        if (!user) {
          // Auto-create user for MVP
          const [newUser] = await db.insert(profiles)
            .values({ email })
            .returning();
          user = newUser;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.displayName,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
});
```

### Step 10: Create Auth API Route
Create `src/app/api/auth/[...nextauth]/route.ts`:
```typescript
import { handlers } from '@/lib/auth';

export const { GET, POST } = handlers;
```

### Step 11: Create Auth Types
Create `src/types/next-auth.d.ts`:
```typescript
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user'];
  }
}
```

### Step 12: Create Login Page
Create `src/app/(auth)/login/page.tsx`:
```typescript
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.ok) {
      router.push('/');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to AI Literacy</CardTitle>
          <CardDescription>Sign in to start practicing</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

Create `src/app/(auth)/layout.tsx`:
```typescript
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

---

## Phase 3: tRPC Setup (Steps 13-17)

### Step 13: Create tRPC Server
Create `src/server/trpc.ts`:
```typescript
import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { auth } from '@/lib/auth';

export const createTRPCContext = async () => {
  const session = await auth();
  return { session };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: { ...ctx, user: ctx.session.user },
  });
});
```

### Step 14: Create Routers
Create `src/server/routers/scenario.ts`:
```typescript
import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { loadLesson, loadLessonsByStage } from '@/lib/lessons/loader';

export const scenarioRouter = router({
  getAvailable: protectedProcedure
    .input(z.object({
      stage: z.number().min(1).max(4).optional(),
      skill: z.string().optional(),
    }).optional())
    .query(async ({ input }) => {
      const stage = input?.stage ?? 1;
      return loadLessonsByStage(stage);
    }),

  getById: protectedProcedure
    .input(z.object({ lessonId: z.string() }))
    .query(async ({ input }) => {
      const lesson = await loadLesson(input.lessonId);
      if (!lesson) {
        throw new Error('Lesson not found');
      }
      // Remove evaluator context before sending to client
      const { evaluatorContext, ...publicLesson } = lesson;
      return publicLesson;
    }),
});
```

Create `src/server/routers/attempt.ts`:
```typescript
import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { db, attempts, profiles } from '@/lib/db';
import { eq, and, count } from 'drizzle-orm';
import { evaluatePrompt } from '@/lib/anthropic/evaluator';
import { loadLesson } from '@/lib/lessons/loader';

export const attemptRouter = router({
  submit: protectedProcedure
    .input(z.object({
      lessonId: z.string(),
      promptText: z.string().min(10).max(5000),
      timeSpentSeconds: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const startTime = Date.now();

      // Load lesson
      const lesson = await loadLesson(input.lessonId);
      if (!lesson) {
        throw new Error('Lesson not found');
      }

      // Get attempt number
      const previousAttempts = await db
        .select({ count: count() })
        .from(attempts)
        .where(
          and(
            eq(attempts.userId, ctx.user.id),
            eq(attempts.lessonId, input.lessonId)
          )
        );

      const attemptNumber = (previousAttempts[0]?.count ?? 0) + 1;

      // Evaluate with Claude
      const evaluation = await evaluatePrompt(lesson, input.promptText);
      const latency = Date.now() - startTime;

      // Save attempt
      const [attempt] = await db.insert(attempts).values({
        userId: ctx.user.id,
        lessonId: input.lessonId,
        promptText: input.promptText,
        score: evaluation.totalScore,
        feedback: evaluation,
        rubricScores: evaluation.rubricScores,
        evaluationModel: 'claude-3-5-sonnet',
        evaluationLatencyMs: latency,
        attemptNumber,
        timeSpentSeconds: input.timeSpentSeconds,
      }).returning();

      // Award XP if passed
      if (evaluation.totalScore >= lesson.evaluation.passingScore) {
        const xpEarned = calculateXP(evaluation.totalScore, attemptNumber);
        await db.update(profiles)
          .set({
            totalXp: profiles.totalXp + xpEarned
          })
          .where(eq(profiles.id, ctx.user.id));
      }

      return {
        attemptId: attempt.id,
        ...evaluation,
        passed: evaluation.totalScore >= lesson.evaluation.passingScore,
      };
    }),

  getHistory: protectedProcedure
    .input(z.object({ lessonId: z.string() }))
    .query(async ({ ctx, input }) => {
      return db.query.attempts.findMany({
        where: and(
          eq(attempts.userId, ctx.user.id),
          eq(attempts.lessonId, input.lessonId)
        ),
        orderBy: (attempts, { desc }) => [desc(attempts.createdAt)],
      });
    }),
});

function calculateXP(score: number, attemptNumber: number): number {
  const baseXP = 100;
  const scoreMultiplier = score / 100;
  const attemptPenalty = Math.max(0.5, 1 - (attemptNumber - 1) * 0.1);
  return Math.round(baseXP * scoreMultiplier * attemptPenalty);
}
```

Create `src/server/routers/_app.ts`:
```typescript
import { router } from '../trpc';
import { scenarioRouter } from './scenario';
import { attemptRouter } from './attempt';

export const appRouter = router({
  scenario: scenarioRouter,
  attempt: attemptRouter,
});

export type AppRouter = typeof appRouter;
```

### Step 15: Create tRPC API Handler
Create `src/app/api/trpc/[trpc]/route.ts`:
```typescript
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/server/routers/_app';
import { createTRPCContext } from '@/server/trpc';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: createTRPCContext,
  });

export { handler as GET, handler as POST };
```

### Step 16: Create tRPC Client
Create `src/lib/trpc/client.ts`:
```typescript
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@/server/routers/_app';

export const trpc = createTRPCReact<AppRouter>();
```

### Step 17: Create tRPC Provider
Create `src/components/providers/trpc-provider.tsx`:
```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { useState } from 'react';
import superjson from 'superjson';
import { trpc } from '@/lib/trpc/client';

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: '/api/trpc',
          transformer: superjson,
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
```

---

## Phase 4: AI Evaluation (Steps 18-20)

### Step 18: Create Anthropic Client
Create `src/lib/anthropic/client.ts`:
```typescript
import Anthropic from '@anthropic-ai/sdk';

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});
```

### Step 19: Create Evaluator Prompt
Create `src/lib/prompts/evaluator.ts`:
```typescript
import type { Lesson } from '@/types/lesson';

export const EVALUATOR_SYSTEM_PROMPT = `
You are a strict but encouraging AI literacy evaluator. Your job is to assess user prompts against specific criteria and provide actionable feedback.

## Your Role
- Evaluate the user's prompt against the provided rubric
- Be honest about weaknesses while acknowledging strengths
- Provide specific, actionable feedback
- Show what improvement looks like

## Response Format
You must respond with valid JSON matching this exact structure:

{
  "totalScore": <number 0-100>,
  "rubricScores": [
    {
      "criterionId": "<string>",
      "criterionName": "<string>",
      "score": <number 0-100>,
      "weight": <number>,
      "weightedScore": <number>,
      "feedback": "<specific feedback for this criterion>"
    }
  ],
  "overallFeedback": {
    "strengths": ["<what they did well>"],
    "weaknesses": ["<what needs improvement>"],
    "primaryIssue": "<the single most important thing to fix>",
    "suggestion": "<specific actionable suggestion>"
  },
  "improvedExample": "<a better version of their prompt, or null if score >= 90>",
  "encouragement": "<brief encouraging message based on score level>"
}

## Scoring Guidelines
- 90-100: Excellent - ready for production use
- 70-89: Good - minor improvements needed
- 50-69: Adequate - shows understanding but has gaps
- Below 50: Needs work - missing fundamental elements

## Important Rules
- Never give 100% unless truly perfect
- Always find at least one thing to improve if score < 95
- Be specific - "too vague" is not helpful, "missing word count specification" is
- Match feedback tone to score: gentler for low scores, more precise for high scores
`;

export function buildEvaluatorUserPrompt(
  lesson: Lesson,
  userPrompt: string
): string {
  const { scenario, evaluation, evaluatorContext } = lesson;

  return `
## Scenario
Title: ${scenario.title}
Context: ${scenario.context}
Goal: ${scenario.goal}
Constraints:
${scenario.constraints.map(c => `- ${c}`).join('\n')}

## Rubric
${evaluation.rubric.map(r => `
### ${r.name} (${r.weight} points)
${r.description}
Scoring guide:
- Excellent (90-100%): ${r.scoringGuide.excellent}
- Good (70-89%): ${r.scoringGuide.good}
- Adequate (50-69%): ${r.scoringGuide.adequate}
- Poor (<50%): ${r.scoringGuide.poor}
`).join('\n')}

## Evaluation Context
Key elements to look for:
${evaluatorContext.keyElements.map(e => `- ${e}`).join('\n')}

Common mistakes to watch for:
${evaluatorContext.commonMistakes.map(m => `- ${m}`).join('\n')}

Anti-patterns that should lower score:
${evaluatorContext.antiPatterns.map(a => `- ${a}`).join('\n')}

Ideal response for reference (do not share with user):
${evaluatorContext.idealResponse}

## User's Prompt to Evaluate
"""
${userPrompt}
"""

Evaluate this prompt and respond with the JSON evaluation.
`;
}
```

### Step 20: Create Evaluation Function
Create `src/lib/anthropic/evaluator.ts`:
```typescript
import { anthropic } from './client';
import { EVALUATOR_SYSTEM_PROMPT, buildEvaluatorUserPrompt } from '@/lib/prompts/evaluator';
import type { Lesson } from '@/types/lesson';

export interface EvaluationResult {
  totalScore: number;
  rubricScores: {
    criterionId: string;
    criterionName: string;
    score: number;
    weight: number;
    weightedScore: number;
    feedback: string;
  }[];
  overallFeedback: {
    strengths: string[];
    weaknesses: string[];
    primaryIssue: string;
    suggestion: string;
  };
  improvedExample: string | null;
  encouragement: string;
}

export async function evaluatePrompt(
  lesson: Lesson,
  userPrompt: string
): Promise<EvaluationResult> {
  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: buildEvaluatorUserPrompt(lesson, userPrompt),
      },
    ],
    system: EVALUATOR_SYSTEM_PROMPT,
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type');
  }

  // Parse JSON response
  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No JSON found in response');
  }

  return JSON.parse(jsonMatch[0]) as EvaluationResult;
}
```

---

## Phase 5: Lesson System (Steps 21-23)

### Step 21: Create Lesson Types
Create `src/types/lesson.ts`:
```typescript
export interface Lesson {
  id: string;
  version: number;

  meta: {
    stage: 1 | 2 | 3 | 4;
    skill: string;
    difficulty: 1 | 2 | 3 | 4 | 5;
    estimatedMinutes: number;
    prerequisites: string[];
    tags: string[];
  };

  scenario: {
    title: string;
    context: string;
    goal: string;
    constraints: string[];
    exampleInput?: string;
    hints: string[];
  };

  evaluation: {
    rubric: RubricItem[];
    passingScore: number;
    maxAttempts?: number;
    timeLimit?: number;
  };

  evaluatorContext: {
    idealResponse?: string;
    commonMistakes: string[];
    keyElements: string[];
    antiPatterns: string[];
  };
}

export interface RubricItem {
  id: string;
  name: string;
  weight: number;
  description: string;
  scoringGuide: {
    excellent: string;
    good: string;
    adequate: string;
    poor: string;
  };
}
```

### Step 22: Create Lesson Loader
Create `src/lib/lessons/loader.ts`:
```typescript
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
      const files = fs.readdirSync(skillDir).filter(f => f.endsWith('.json'));

      for (const file of files) {
        const content = fs.readFileSync(path.join(skillDir, file), 'utf-8');
        lessons.push(JSON.parse(content) as Lesson);
      }
    }
  } catch {
    // Directory doesn't exist yet
  }

  return lessons;
}
```

### Step 23: Create First Lesson
Create `content/lessons/stage-1/clarity/S1-CLARITY-001.json`:
```json
{
  "id": "S1-CLARITY-001",
  "version": 1,

  "meta": {
    "stage": 1,
    "skill": "clarity",
    "difficulty": 1,
    "estimatedMinutes": 5,
    "prerequisites": [],
    "tags": ["beginner", "writing", "email"]
  },

  "scenario": {
    "title": "The Vague Summary Request",
    "context": "You're a marketing manager. Your CEO asked for a summary of last quarter's campaign performance to share with the board.",
    "goal": "Write a prompt that gets AI to produce a clear, usable executive summary.",
    "constraints": [
      "The summary must be under 200 words",
      "It should include 3-5 bullet points of key metrics",
      "Tone should be professional but not dry"
    ],
    "exampleInput": "Q3 data: 50K visitors (+23%), 2.1K signups (+45%), $125K revenue (+12%), best channel was LinkedIn ads, worst was display. NPS improved from 34 to 41.",
    "hints": [
      "Did you specify who the audience is?",
      "Did you mention the word count limit?",
      "Did you ask for specific formatting (bullets, sections)?"
    ]
  },

  "evaluation": {
    "rubric": [
      {
        "id": "clarity",
        "name": "Clarity",
        "weight": 30,
        "description": "How clear and unambiguous is the prompt?",
        "scoringGuide": {
          "excellent": "Crystal clear intent, no room for misinterpretation",
          "good": "Clear overall, minor ambiguities",
          "adequate": "Understandable but vague in places",
          "poor": "Confusing or contradictory instructions"
        }
      },
      {
        "id": "constraints",
        "name": "Constraints",
        "weight": 25,
        "description": "Are output requirements specified?",
        "scoringGuide": {
          "excellent": "All constraints clearly stated (length, format, tone)",
          "good": "Most constraints mentioned",
          "adequate": "Some constraints, missing key ones",
          "poor": "No constraints specified"
        }
      },
      {
        "id": "context",
        "name": "Context",
        "weight": 25,
        "description": "Is sufficient context provided?",
        "scoringGuide": {
          "excellent": "Full context including audience, purpose, and background",
          "good": "Good context, minor gaps",
          "adequate": "Basic context provided",
          "poor": "Missing critical context"
        }
      },
      {
        "id": "output_format",
        "name": "Output Format",
        "weight": 20,
        "description": "Is the desired format specified?",
        "scoringGuide": {
          "excellent": "Explicit format instructions (bullets, sections, etc.)",
          "good": "Format mentioned but not detailed",
          "adequate": "Implied format expectations",
          "poor": "No format guidance"
        }
      }
    ],
    "passingScore": 70,
    "maxAttempts": null
  },

  "evaluatorContext": {
    "idealResponse": "Write an executive summary of Q3 marketing performance for our board of directors. Include: 1) A 1-2 sentence overview of overall performance, 2) 3-5 bullet points with key metrics and % changes, 3) One sentence on top performer, 4) One sentence on area for improvement. Keep it under 200 words. Tone: professional, confident, data-driven. Here's the raw data: [data]",
    "commonMistakes": [
      "Not specifying the audience (board)",
      "Forgetting the word limit",
      "Not asking for specific metrics to highlight",
      "Missing format instructions"
    ],
    "keyElements": [
      "Audience specification",
      "Word/length limit",
      "Format requirements",
      "Tone guidance"
    ],
    "antiPatterns": [
      "Just saying 'summarize this'",
      "Asking for 'a good summary'",
      "No mention of bullet points or structure"
    ]
  }
}
```

---

## Phase 6: Core UI Components (Steps 24-30)

**Design Reference:** See `Documents/DESIGN_SYSTEM.md` for complete visual specifications.

### Step 24: Update Tailwind Config (Terminal Theme)
Update `tailwind.config.ts`:
```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Terminal backgrounds (Claude Code style)
        terminal: {
          bg: '#1A1A1A',
          card: '#252525',
          input: '#2D2D2D',
          elevated: '#333333',
        },
        // Text
        term: {
          primary: '#E5E5E5',
          secondary: '#A3A3A3',
          muted: '#737373',
        },
        // Anthropic accent (orange)
        accent: {
          DEFAULT: '#D97706',
          hover: '#F59E0B',
          muted: '#92400E',
        },
        // Stage colors
        stage: {
          1: '#3B82F6',
          2: '#8B5CF6',
          3: '#F59E0B',
          4: '#10B981',
        },
        // Semantic
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', 'monospace'],
      },
      animation: {
        'cursor-blink': 'blink 1s step-end infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
```

### Step 24b: Add JetBrains Mono Font
Update `src/app/layout.tsx`:
```typescript
import { JetBrains_Mono } from 'next/font/google';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

// In the body:
<body className={`${jetbrainsMono.variable} font-mono bg-terminal-bg text-term-primary`}>
```

### Step 24c: Update Global CSS
Add to `src/app/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Force dark mode */
html {
  color-scheme: dark;
}

body {
  @apply bg-terminal-bg text-term-primary font-mono;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  @apply bg-terminal-bg;
}
::-webkit-scrollbar-thumb {
  @apply bg-terminal-elevated rounded;
}

/* Selection */
::selection {
  @apply bg-accent/30;
}
```

### Step 25: Create ScenarioCard Component
Create `src/components/scenario/scenario-card.tsx`:
```typescript
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2, Lock } from 'lucide-react';
import type { Lesson } from '@/types/lesson';
import { cn } from '@/lib/utils';

interface ScenarioCardProps {
  lesson: Lesson;
  status?: 'locked' | 'available' | 'in-progress' | 'completed';
  bestScore?: number;
  onClick?: () => void;
}

export function ScenarioCard({ lesson, status = 'available', bestScore, onClick }: ScenarioCardProps) {
  const stageColors = {
    1: 'border-stage-1 bg-stage-1/5',
    2: 'border-stage-2 bg-stage-2/5',
    3: 'border-stage-3 bg-stage-3/5',
    4: 'border-stage-4 bg-stage-4/5',
  };

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-lg',
        stageColors[lesson.meta.stage],
        status === 'locked' && 'opacity-50 cursor-not-allowed',
        status === 'completed' && 'border-score-high'
      )}
      onClick={status !== 'locked' ? onClick : undefined}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Badge variant="outline">Stage {lesson.meta.stage}</Badge>
          {status === 'locked' && <Lock className="h-4 w-4 text-muted-foreground" />}
          {status === 'completed' && <CheckCircle2 className="h-4 w-4 text-score-high" />}
        </div>
        <CardTitle className="text-lg">{lesson.scenario.title}</CardTitle>
        <CardDescription>{lesson.meta.skill}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {lesson.scenario.context}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{lesson.meta.estimatedMinutes} min</span>
          </div>
          {bestScore !== undefined && (
            <Badge variant={bestScore >= 80 ? 'default' : 'secondary'}>
              Best: {bestScore}%
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

### Step 26: Create PromptInput Component
Create `src/components/exercise/prompt-input.tsx`:
```typescript
'use client';

import { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
}

export function PromptInput({
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholder = 'Write your prompt here...',
  maxLength = 5000,
}: PromptInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 400)}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!disabled && value.trim().length >= 10) {
        onSubmit();
      }
    }
  };

  return (
    <div className="space-y-2">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="min-h-[150px] resize-none"
        maxLength={maxLength}
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {value.length}/{maxLength} characters
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            Cmd/Ctrl + Enter to submit
          </span>
          <Button
            onClick={onSubmit}
            disabled={disabled || value.trim().length < 10}
            size="sm"
          >
            <Send className="h-4 w-4 mr-2" />
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
```

### Step 27: Create FeedbackPanel Component
Create `src/components/feedback/feedback-panel.tsx`:
```typescript
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, RotateCcw, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { EvaluationResult } from '@/lib/anthropic/evaluator';

interface FeedbackPanelProps {
  evaluation: EvaluationResult;
  passed: boolean;
  passingScore: number;
  onRetry: () => void;
  onNext?: () => void;
}

export function FeedbackPanel({
  evaluation,
  passed,
  passingScore,
  onRetry,
  onNext
}: FeedbackPanelProps) {
  const scoreColor = evaluation.totalScore >= 80
    ? 'text-score-high'
    : evaluation.totalScore >= 50
      ? 'text-score-medium'
      : 'text-score-low';

  return (
    <Card className={cn(
      'border-2',
      passed ? 'border-score-high' : 'border-score-low'
    )}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {passed ? (
              <CheckCircle2 className="h-6 w-6 text-score-high" />
            ) : (
              <XCircle className="h-6 w-6 text-score-low" />
            )}
            <CardTitle>{passed ? 'Great job!' : 'Keep practicing'}</CardTitle>
          </div>
          <div className={cn('text-4xl font-bold', scoreColor)}>
            {evaluation.totalScore}%
          </div>
        </div>
        <p className="text-muted-foreground">{evaluation.encouragement}</p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Rubric Breakdown */}
        <div className="space-y-3">
          <h4 className="font-semibold">Score Breakdown</h4>
          {evaluation.rubricScores.map((item) => (
            <div key={item.criterionId} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{item.criterionName}</span>
                <span className="font-medium">{item.score}%</span>
              </div>
              <Progress value={item.score} className="h-2" />
              <p className="text-xs text-muted-foreground">{item.feedback}</p>
            </div>
          ))}
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-score-high mb-2">Strengths</h4>
            <ul className="text-sm space-y-1">
              {evaluation.overallFeedback.strengths.map((s, i) => (
                <li key={i} className="text-muted-foreground">• {s}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-score-low mb-2">To Improve</h4>
            <ul className="text-sm space-y-1">
              {evaluation.overallFeedback.weaknesses.map((w, i) => (
                <li key={i} className="text-muted-foreground">• {w}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Primary Issue */}
        <div className="p-3 bg-muted rounded-lg">
          <h4 className="font-semibold mb-1">Key Improvement</h4>
          <p className="text-sm">{evaluation.overallFeedback.primaryIssue}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {evaluation.overallFeedback.suggestion}
          </p>
        </div>

        {/* Improved Example */}
        {evaluation.improvedExample && (
          <div>
            <h4 className="font-semibold mb-2">Improved Example</h4>
            <pre className="p-3 bg-muted rounded-lg text-sm whitespace-pre-wrap overflow-x-auto">
              {evaluation.improvedExample}
            </pre>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button onClick={onRetry} variant="outline" className="flex-1">
            <RotateCcw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          {passed && onNext && (
            <Button onClick={onNext} className="flex-1">
              Next Scenario
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

### Step 28: Create Exercise Container
Create `src/components/exercise/exercise-container.tsx`:
```typescript
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lightbulb, Clock } from 'lucide-react';
import { PromptInput } from './prompt-input';
import { FeedbackPanel } from '@/components/feedback/feedback-panel';
import { trpc } from '@/lib/trpc/client';
import type { Lesson } from '@/types/lesson';
import type { EvaluationResult } from '@/lib/anthropic/evaluator';

interface ExerciseContainerProps {
  lesson: Omit<Lesson, 'evaluatorContext'>;
  onComplete?: () => void;
}

export function ExerciseContainer({ lesson, onComplete }: ExerciseContainerProps) {
  const [prompt, setPrompt] = useState('');
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [result, setResult] = useState<(EvaluationResult & { passed: boolean }) | null>(null);

  const submitMutation = trpc.attempt.submit.useMutation({
    onSuccess: (data) => {
      setResult(data);
      if (data.passed && onComplete) {
        onComplete();
      }
    },
  });

  const handleSubmit = () => {
    submitMutation.mutate({
      lessonId: lesson.id,
      promptText: prompt,
    });
  };

  const handleRetry = () => {
    setResult(null);
    setPrompt('');
  };

  const revealHint = () => {
    if (hintsRevealed < lesson.scenario.hints.length) {
      setHintsRevealed(hintsRevealed + 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Scenario Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge>Stage {lesson.meta.stage} • {lesson.meta.skill}</Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{lesson.meta.estimatedMinutes} min</span>
            </div>
          </div>
          <CardTitle className="text-2xl">{lesson.scenario.title}</CardTitle>
          <CardDescription className="text-base">{lesson.scenario.context}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Your Goal</h4>
            <p>{lesson.scenario.goal}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Requirements</h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              {lesson.scenario.constraints.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>

          {lesson.scenario.exampleInput && (
            <div>
              <h4 className="font-semibold mb-2">Sample Data</h4>
              <pre className="p-3 bg-muted rounded-lg text-sm whitespace-pre-wrap">
                {lesson.scenario.exampleInput}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hints */}
      {hintsRevealed > 0 && (
        <Card className="border-yellow-500/50 bg-yellow-500/5">
          <CardContent className="pt-4">
            <div className="flex items-start gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div className="space-y-2">
                {lesson.scenario.hints.slice(0, hintsRevealed).map((hint, i) => (
                  <p key={i} className="text-sm">{hint}</p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Input or Result */}
      {!result ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Your Prompt</CardTitle>
              {hintsRevealed < lesson.scenario.hints.length && (
                <Button variant="ghost" size="sm" onClick={revealHint}>
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Get Hint ({lesson.scenario.hints.length - hintsRevealed} left)
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <PromptInput
              value={prompt}
              onChange={setPrompt}
              onSubmit={handleSubmit}
              disabled={submitMutation.isPending}
              placeholder="Write your prompt to complete the scenario..."
            />
            {submitMutation.isPending && (
              <p className="text-sm text-muted-foreground mt-2 animate-pulse">
                Evaluating your prompt...
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <FeedbackPanel
          evaluation={result}
          passed={result.passed}
          passingScore={lesson.evaluation.passingScore}
          onRetry={handleRetry}
        />
      )}
    </div>
  );
}
```

### Step 29: Create Dashboard Layout
Create `src/app/(dashboard)/layout.tsx`:
```typescript
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { TRPCProvider } from '@/components/providers/trpc-provider';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <TRPCProvider>
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-xl font-bold">AI Literacy</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {session.user?.email}
              </span>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </TRPCProvider>
  );
}
```

### Step 30: Create Scenario Pages
Create `src/app/(dashboard)/page.tsx`:
```typescript
'use client';

import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc/client';
import { ScenarioCard } from '@/components/scenario/scenario-card';

export default function DashboardPage() {
  const router = useRouter();
  const { data: scenarios, isLoading } = trpc.scenario.getAvailable.useQuery({});

  if (isLoading) {
    return <div className="text-center py-12">Loading scenarios...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Stage 1: Prompting</h2>
        <p className="text-muted-foreground">
          Learn to get correct reasoning and output shape from AI
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scenarios?.map((lesson) => (
          <ScenarioCard
            key={lesson.id}
            lesson={lesson}
            status="available"
            onClick={() => router.push(`/scenarios/${lesson.id}`)}
          />
        ))}
      </div>

      {scenarios?.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No scenarios available yet. Add lessons to content/lessons/
        </div>
      )}
    </div>
  );
}
```

Create `src/app/(dashboard)/scenarios/[id]/page.tsx`:
```typescript
'use client';

import { use } from 'react';
import { trpc } from '@/lib/trpc/client';
import { ExerciseContainer } from '@/components/exercise/exercise-container';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ScenarioPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params);
  const { data: lesson, isLoading, error } = trpc.scenario.getById.useQuery({
    lessonId: id
  });

  if (isLoading) {
    return <div className="text-center py-12">Loading scenario...</div>;
  }

  if (error || !lesson) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">Scenario not found</p>
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to scenarios
      </Link>
      <ExerciseContainer lesson={lesson} />
    </div>
  );
}
```

---

## Phase 7: Final Setup (Steps 31-33)

### Step 31: Update Root Layout
Update `src/app/layout.tsx`:
```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Literacy Platform',
  description: 'Learn to work with AI through practice',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
```

### Step 32: Create Utils
Create `src/lib/utils.ts`:
```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Step 33: Run and Test
```bash
# Push database schema
npm run db:push

# Start development server
npm run dev
```

Visit `http://localhost:3000`:
1. Sign in with any email
2. Click on the scenario card
3. Write a prompt and submit
4. See AI feedback

---

## Next Phases (After MVP Works)

### Phase 8: Progression System
- [ ] Skill tree component
- [ ] XP display and level progress
- [ ] User skills tracking
- [ ] Stage unlocking logic

### Phase 9: Gamification
- [ ] Streak tracking
- [ ] Achievement system
- [ ] Leaderboard

### Phase 10: Content
- [ ] Create remaining Stage 1 lessons (15 total)
- [ ] Lesson validation script
- [ ] Stage 2-4 structure

### Phase 11: Monetization (Flitt.com)
- [ ] Flitt integration
- [ ] Subscription plans
- [ ] Paywall component
- [ ] Free tier limits

### Phase 12: Polish
- [ ] Error handling
- [ ] Loading states
- [ ] Mobile responsive
- [ ] Dark mode

---

## Verification Checklist

After completing Phase 1-7, verify:

- [ ] `npm run dev` starts without errors
- [ ] Database tables created in Neon dashboard
- [ ] Can sign in at `/login`
- [ ] Dashboard shows scenario card
- [ ] Can click scenario and see exercise page
- [ ] Can submit prompt and receive AI feedback
- [ ] Score and feedback display correctly
- [ ] Can retry and resubmit

---

*Implementation plan generated for AI Literacy Platform MVP*
