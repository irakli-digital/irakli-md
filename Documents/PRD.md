# AI Literacy Platform — Product Requirements Document

**Version:** 1.0  
**Date:** January 2026  
**Author:** Product Team  
**Status:** Ready for Development

---

## Executive Summary

Build a practice-first AI literacy platform that teaches users to work with AI through doing, not watching. The platform follows a 4-stage progression from prompting to productization, using AI-generated scenarios and AI-powered evaluation instead of human-created content.

**Core Principle:** System prompts are infrastructure. Lessons are data.

---

## Table of Contents

1. [Product Vision](#1-product-vision)
2. [The 4-Stage Framework](#2-the-4-stage-framework)
3. [Technical Architecture](#3-technical-architecture)
4. [Design System](#4-design-system)
5. [Lesson Authoring System](#5-lesson-authoring-system)
6. [Database Schema](#6-database-schema)
7. [Core System Prompts](#7-core-system-prompts)
8. [API Specification](#8-api-specification)
9. [Implementation Phases](#9-implementation-phases)
10. [File Structure](#10-file-structure)

---

## 1. Product Vision

### What We're Building

A guided AI practice environment where users complete scenarios and receive AI-powered feedback. No videos, no static content, no teachers.

### Target Users

| Segment | Description | Stage Focus |
|---------|-------------|-------------|
| Knowledge Workers | Professionals wanting AI productivity gains | Stage 1-2 |
| Ops/Analysts | Team members building workflows | Stage 2-3 |
| Technical PMs | Process owners automating teams | Stage 3 |
| Builders/Founders | People shipping AI products | Stage 3-4 |
| Enterprises | Companies training teams at scale | All stages |

### Success Metrics

- **Activation:** 80% complete first scenario within 5 minutes
- **Engagement:** 3+ scenarios per session average
- **Retention:** 40% 7-day retention
- **Conversion:** 8% free-to-paid within 14 days
- **Completion:** 60% stage completion rate

---

## 2. The 4-Stage Framework

### Stage 1: Prompting (Human → AI)

**Goal:** Get correct reasoning and output shape from AI.

**Skills taught:**
- Clarity: Writing unambiguous instructions
- Context: Providing sufficient background
- Constraints: Setting boundaries (length, format, tone)
- Reasoning: Eliciting step-by-step thinking
- Output shaping: Getting structured responses

**Completion criteria:** User can consistently get useful output on first or second attempt.

**Certification:** "Prompt Engineer – Level 1"

### Stage 2: Analysis & Structuring (AI Output → Machine-Usable)

**Goal:** Turn raw AI output into deterministic, machine-usable structure.

**Skills taught:**
- JSON extraction: Getting valid, parseable JSON
- Schema definition: Designing input/output contracts
- Output parsing: Extracting specific fields
- Step decomposition: Breaking tasks into atomic units
- Error handling: Managing unexpected formats

**Completion criteria:** User can design prompts that produce machine-parseable output reliably.

**Certification:** "AI Systems Designer – Level 2"

### Stage 3: Automation (Orchestration)

**Goal:** Wire AI into workflows that run without human intervention.

**Skills taught:**
- Triggers: Event-based workflow initiation
- Data routing: Moving data between services
- API integration: Connecting external services
- Conditional logic: Branching based on AI output
- Error handling: Retries, fallbacks, logging
- Multi-step chains: Sequential AI operations

**Completion criteria:** User can build and deploy working automations.

**Certification:** "AI Automation Specialist – Level 3"

### Stage 4: Vibe Coding (Productization)

**Goal:** Make automations into real, usable products.

**Skills taught:**
- Frontend basics: Building simple UIs with AI assistance
- Backend integration: Auth, storage, APIs
- Guardrails: Rate limits, input validation, safety
- Deployment: Shipping to production
- Iteration: Using AI to improve code

**Completion criteria:** User has deployed a live, usable AI-powered tool.

**Certification:** "AI Product Builder – Level 4"

---

## 3. Technical Architecture

### Stack

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  Next.js 14 (App Router) + TypeScript + Tailwind CSS        │
│  shadcn/ui components + Framer Motion                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                         API LAYER                            │
│  Next.js API Routes + tRPC (type-safe)                      │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   NEON.TECH     │ │   ANTHROPIC     │ │     FLITT       │
│  - PostgreSQL   │ │   CLAUDE API    │ │   - Payments    │
│  - Serverless   │ │   - Evaluation  │ │   - Subs        │
│  - Branching    │ │   - Hints       │ │                 │
│                 │ │   - Generation  │ │                 │
└─────────────────┘ └─────────────────┘ └─────────────────┘
        │
        ▼
┌─────────────────┐
│   NEXTAUTH.JS   │
│  - Auth         │
│  - Sessions     │
└─────────────────┘
```

### Why This Stack

| Choice | Reasoning |
|--------|-----------|
| Next.js 14 | App Router for layouts, Server Components for speed, API routes built-in |
| TypeScript | Type safety across frontend/backend, better Claude Code output |
| Tailwind + shadcn/ui | Consistent design system, copy-paste components, dark mode free |
| Neon.tech | Serverless PostgreSQL, generous free tier, branching for dev/prod |
| NextAuth.js | Flexible auth solution, works with any database, OAuth providers |
| Drizzle ORM | Type-safe queries, lightweight, great TypeScript integration |
| tRPC | End-to-end type safety, no API schema drift |
| Claude API | Best at evaluation/critique, consistent grading |
| Flitt.com | Payment processing for subscriptions |

### Deployment

- **Vercel** for frontend + API routes
- **Neon.tech** managed serverless PostgreSQL
- **Upstash** for rate limiting (Redis)

---

## 4. Design System

### Philosophy

**Terminal-Native Aesthetic** — The platform looks and feels like a modern CLI/terminal interface, inspired by Claude Code's visual language. This reinforces the AI-developer theme and creates a distinctive brand identity.

**Reference:** See `DESIGN_SYSTEM.md` for complete specifications.

### Core Principles

1. **Monospace everything** — JetBrains Mono font throughout
2. **Dark by default** — Charcoal backgrounds (#1A1A1A)
3. **Anthropic orange accent** — #D97706 for highlights
4. **ASCII art branding** — Terminal-style visual identity
5. **Command-line interactions** — `> prompt` style inputs

### Setup Commands

```bash
# Initialize shadcn/ui
npx shadcn@latest init

# Install core components
npx shadcn@latest add button card input textarea badge progress
npx shadcn@latest add dialog sheet tabs accordion
npx shadcn@latest add avatar dropdown-menu toast
```

### Color Tokens (tailwind.config.ts)

```typescript
// Terminal/Claude Code theme
const config = {
  theme: {
    extend: {
      colors: {
        // Terminal backgrounds
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
          1: '#3B82F6', // Blue - Prompting
          2: '#8B5CF6', // Purple - Structuring
          3: '#F59E0B', // Amber - Automation
          4: '#10B981', // Emerald - Vibe Coding
        },
        // Semantic
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
}
```

### Core Components to Build

#### 1. ScenarioCard

```typescript
// components/scenario/scenario-card.tsx
interface ScenarioCardProps {
  scenario: Scenario
  progress?: 'locked' | 'available' | 'in-progress' | 'completed'
  score?: number
  onClick: () => void
}
```

**States:**
- Locked (gray, lock icon)
- Available (stage color, glow effect)
- In Progress (pulsing border)
- Completed (checkmark, score badge)

#### 2. PromptInput

```typescript
// components/exercise/prompt-input.tsx
interface PromptInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  disabled?: boolean
  placeholder?: string
  maxLength?: number
  showCharCount?: boolean
}
```

**Features:**
- Character counter
- Submit on Cmd/Ctrl+Enter
- Disabled state during evaluation
- Auto-resize textarea

#### 3. FeedbackPanel

```typescript
// components/feedback/feedback-panel.tsx
interface FeedbackPanelProps {
  score: number
  breakdown: {
    category: string
    score: number
    maxScore: number
    feedback: string
  }[]
  improvedExample?: string
  retryGuidance?: string
  onRetry: () => void
  onNext: () => void
}
```

**Sections:**
- Overall score with animated progress ring
- Category breakdown with individual bars
- "What went wrong" expandable section
- Improved example in code block
- Retry/Next buttons

#### 4. ProgressRing

```typescript
// components/ui/progress-ring.tsx
interface ProgressRingProps {
  value: number        // 0-100
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  color?: 'auto' | 'stage-1' | 'stage-2' | 'stage-3' | 'stage-4'
}
```

**Behavior:**
- `color="auto"` uses score-based coloring
- Animated fill on mount
- Optional center label

#### 5. StreakBadge

```typescript
// components/gamification/streak-badge.tsx
interface StreakBadgeProps {
  days: number
  isActive: boolean  // Did user practice today?
}
```

**States:**
- Fire emoji with day count
- Pulsing animation if at risk (not practiced yet today)
- Gray if broken

#### 6. SkillTree

```typescript
// components/progression/skill-tree.tsx
interface SkillTreeProps {
  stages: Stage[]
  userProgress: UserProgress
  onSkillClick: (skillId: string) => void
}
```

**Features:**
- Visual node graph
- Connection lines between prerequisites
- Stage grouping with labels
- Locked/available/completed states

### Component File Structure

```
src/
├── components/
│   ├── ui/                    # shadcn/ui base components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── progress.tsx
│   │   └── ...
│   │
│   ├── scenario/              # Scenario-related
│   │   ├── scenario-card.tsx
│   │   ├── scenario-header.tsx
│   │   └── scenario-list.tsx
│   │
│   ├── exercise/              # Exercise flow
│   │   ├── prompt-input.tsx
│   │   ├── exercise-container.tsx
│   │   └── submission-status.tsx
│   │
│   ├── feedback/              # Feedback display
│   │   ├── feedback-panel.tsx
│   │   ├── score-breakdown.tsx
│   │   └── improved-example.tsx
│   │
│   ├── gamification/          # XP, streaks, badges
│   │   ├── xp-display.tsx
│   │   ├── streak-badge.tsx
│   │   ├── level-progress.tsx
│   │   └── achievement-toast.tsx
│   │
│   ├── progression/           # Skill tree, stages
│   │   ├── skill-tree.tsx
│   │   ├── stage-card.tsx
│   │   └── certification-badge.tsx
│   │
│   └── layout/                # App shell
│       ├── sidebar.tsx
│       ├── header.tsx
│       └── mobile-nav.tsx
```

---

## 5. Lesson Authoring System

### Philosophy

**Lessons are JSON data, not code.** You should be able to create a new lesson by:

1. Writing a JSON file
2. Dropping it in a folder
3. It appears in the app

No code changes, no deployments, no migrations.

### Lesson Schema

```typescript
// types/lesson.ts
interface Lesson {
  id: string                    // Unique identifier: "S1-CLARITY-001"
  version: number               // Schema version for migrations
  
  // Metadata
  meta: {
    stage: 1 | 2 | 3 | 4
    skill: string               // "clarity" | "constraints" | "json_extraction" etc.
    difficulty: 1 | 2 | 3 | 4 | 5
    estimatedMinutes: number
    prerequisites: string[]     // Lesson IDs that must be completed first
    tags: string[]              // For filtering/search
  }
  
  // The scenario users see
  scenario: {
    title: string
    context: string             // Role + situation
    goal: string                // What user needs to achieve
    constraints: string[]       // Specific requirements
    exampleInput?: string       // Sample data they might work with
    hints: string[]             // Progressive hints (revealed on request)
  }
  
  // Evaluation configuration
  evaluation: {
    rubric: RubricItem[]
    passingScore: number        // Usually 70
    maxAttempts?: number        // null = unlimited
    timeLimit?: number          // Seconds, null = no limit
  }
  
  // For the evaluator
  evaluatorContext: {
    idealResponse?: string      // What a great answer looks like
    commonMistakes: string[]    // Things to watch for
    keyElements: string[]       // Must-have components
    antiPatterns: string[]      // Things that should lower score
  }
}

interface RubricItem {
  id: string
  name: string                  // "Clarity", "Constraints", etc.
  weight: number                // Points (should sum to 100)
  description: string           // What this measures
  scoringGuide: {
    excellent: string           // 90-100% of weight
    good: string                // 70-89%
    adequate: string            // 50-69%
    poor: string                // Below 50%
  }
}
```

### Example Lesson JSON

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

### Lesson Storage Options

#### Option A: File-based (Recommended for MVP)

```
content/
├── lessons/
│   ├── stage-1/
│   │   ├── clarity/
│   │   │   ├── S1-CLARITY-001.json
│   │   │   ├── S1-CLARITY-002.json
│   │   │   └── S1-CLARITY-003.json
│   │   ├── constraints/
│   │   └── context/
│   ├── stage-2/
│   ├── stage-3/
│   └── stage-4/
│
├── skills/
│   └── skills.json            # Skill definitions and tree structure
│
└── rubrics/
    └── default-rubrics.json   # Reusable rubric templates
```

**Pros:**
- Version controlled in Git
- Easy to review changes
- No database needed for content
- Works with Claude Code directly

**Cons:**
- Need to redeploy to add lessons
- No real-time updates

#### Option B: Database-driven (Scale phase)

Store lessons in Neon PostgreSQL with an admin UI:

```sql
CREATE TABLE lessons (
  id TEXT PRIMARY KEY,
  version INT NOT NULL DEFAULT 1,
  stage INT NOT NULL,
  skill TEXT NOT NULL,
  content JSONB NOT NULL,  -- The full lesson JSON
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_lessons_stage ON lessons(stage);
CREATE INDEX idx_lessons_skill ON lessons(skill);
CREATE INDEX idx_lessons_published ON lessons(is_published);
```

**Pros:**
- Real-time updates
- Admin UI for non-technical editors
- Analytics on lesson performance

**Cons:**
- More complex
- Need to build admin UI

### Lesson Generation Workflow

For rapid content creation, use AI to generate lesson drafts:

```typescript
// scripts/generate-lesson.ts
const LESSON_GENERATOR_PROMPT = `
You are an AI literacy curriculum designer. Generate a practice scenario.

Stage: {stage}
Skill: {skill}
Difficulty: {difficulty}
Topic hint: {topic}

Output a complete lesson JSON matching this schema:
{schema}

Requirements:
- Scenario should be realistic and workplace-relevant
- Include 3 progressive hints
- Rubric weights must sum to 100
- Include at least 3 common mistakes
- Ideal response should be detailed

Output only valid JSON, no explanation.
`;
```

**Workflow:**
1. Run generation script with parameters
2. AI outputs lesson JSON
3. Human reviews and adjusts
4. Save to content folder
5. Commit and deploy

---

## 6. Database Schema

### Core Tables

```sql
-- Users (linked to NextAuth accounts)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  
  -- Progression
  current_stage INT DEFAULT 1,
  total_xp INT DEFAULT 0,
  level INT DEFAULT 1,
  
  -- Streak tracking
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_practice_date DATE,
  streak_freeze_count INT DEFAULT 0,
  
  -- Subscription
  subscription_tier TEXT DEFAULT 'free',  -- 'free', 'pro', 'team'
  subscription_expires_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skill progress per user
CREATE TABLE user_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id TEXT NOT NULL,           -- "clarity", "constraints", etc.
  
  -- Progress tracking
  scenarios_completed INT DEFAULT 0,
  scenarios_available INT NOT NULL,
  best_score INT DEFAULT 0,
  average_score DECIMAL(5,2),
  total_attempts INT DEFAULT 0,
  
  -- Mastery
  mastery_level INT DEFAULT 0,      -- 0-5 stars
  is_unlocked BOOLEAN DEFAULT false,
  unlocked_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, skill_id)
);

-- Individual scenario attempts
CREATE TABLE attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,          -- Reference to lesson JSON
  
  -- Submission
  prompt_text TEXT NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Evaluation
  score INT,                        -- 0-100
  feedback JSONB,                   -- Full feedback object
  rubric_scores JSONB,              -- Individual rubric scores
  evaluation_model TEXT,            -- Which AI model evaluated
  evaluation_latency_ms INT,
  
  -- Attempt metadata
  attempt_number INT NOT NULL,
  time_spent_seconds INT,
  hints_used INT DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_attempts_user ON attempts(user_id);
CREATE INDEX idx_attempts_lesson ON attempts(lesson_id);
CREATE INDEX idx_attempts_user_lesson ON attempts(user_id, lesson_id);

-- Reflections (post-exercise)
CREATE TABLE reflections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  attempt_id UUID REFERENCES attempts(id) ON DELETE CASCADE,
  
  reflection_text TEXT NOT NULL,
  extracted_insights JSONB,         -- AI-extracted learning signals
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Achievements/badges
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  achievement_type TEXT NOT NULL,   -- "first_scenario", "perfect_score", etc.
  achievement_data JSONB,           -- Type-specific data
  
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, achievement_type)
);

-- Daily activity for streaks
CREATE TABLE daily_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL,
  
  scenarios_completed INT DEFAULT 0,
  xp_earned INT DEFAULT 0,
  time_spent_seconds INT DEFAULT 0,
  
  UNIQUE(user_id, activity_date)
);

-- Certifications
CREATE TABLE certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  certification_type TEXT NOT NULL,  -- "stage_1", "stage_2", etc.
  score INT NOT NULL,                -- Assessment score
  
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  verification_code TEXT UNIQUE,     -- For public verification
  
  UNIQUE(user_id, certification_type)
);
```

### Row Level Security

Row-level security is handled at the application layer via NextAuth.js middleware and tRPC context. All queries filter by the authenticated user's ID from the session.

```typescript
// Example: tRPC protected procedure ensures user_id filtering
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: { ...ctx, user: ctx.session.user },
  });
});
```

---

## 7. Core System Prompts

### Prompt 1: Learner Evaluator (Main Engine)

```typescript
// lib/prompts/evaluator.ts
export const EVALUATOR_SYSTEM_PROMPT = `
You are a strict but encouraging AI literacy evaluator. Your job is to assess user prompts against specific criteria and provide actionable feedback.

## Your Role
- Evaluate the user's prompt against the provided rubric
- Be honest about weaknesses while acknowledging strengths
- Provide specific, actionable feedback
- Show what improvement looks like

## Evaluation Process
1. Read the scenario context and goal carefully
2. Analyze the user's prompt against each rubric criterion
3. Score each criterion as a percentage (0-100) of its weight
4. Calculate total score
5. Identify the most impactful improvements
6. Generate an improved example if score < 90

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
- Consider the difficulty level when calibrating expectations
`;

export function buildEvaluatorUserPrompt(
  scenario: Lesson['scenario'],
  rubric: Lesson['evaluation']['rubric'],
  evaluatorContext: Lesson['evaluatorContext'],
  userPrompt: string
): string {
  return `
## Scenario
Title: ${scenario.title}
Context: ${scenario.context}
Goal: ${scenario.goal}
Constraints:
${scenario.constraints.map(c => `- ${c}`).join('\n')}

## Rubric
${rubric.map(r => `
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

### Prompt 2: Hint Generator

```typescript
// lib/prompts/hints.ts
export const HINT_GENERATOR_SYSTEM_PROMPT = `
You are a teaching assistant for an AI literacy course. When a user is stuck, you provide helpful hints that guide them toward the answer without giving it away.

## Your Approach
- Give partial information, not complete solutions
- Ask leading questions that prompt thinking
- Reference the rubric criteria they're struggling with
- Be encouraging and supportive

## Response Format
{
  "hint": "<your hint text>",
  "focusArea": "<which rubric criterion this addresses>",
  "difficultyAdjustment": "<easier hint if they've asked multiple times>"
}

## Rules
- Never give the complete answer
- Never show the ideal response
- Maximum 2-3 sentences per hint
- Each subsequent hint can be slightly more direct
`;
```

### Prompt 3: Reflection Analyzer

```typescript
// lib/prompts/reflection.ts
export const REFLECTION_ANALYZER_PROMPT = `
You are a learning coach analyzing student reflections to extract learning signals.

## Your Task
Analyze the user's reflection after completing an exercise to understand:
1. What misconceptions they might have
2. What they've genuinely learned
3. What areas need reinforcement

## Response Format
{
  "understandingLevel": "strong" | "moderate" | "weak",
  "misconceptions": ["<any incorrect beliefs detected>"],
  "correctInsights": ["<valid learnings>"],
  "reinforcementNeeded": ["<skills/concepts to revisit>"],
  "nextRecommendation": "<suggested next lesson or practice>"
}
`;
```

### Prompt 4: Scenario Generator (Admin/Background)

```typescript
// lib/prompts/generator.ts
export const SCENARIO_GENERATOR_PROMPT = `
You are an AI literacy curriculum designer. Generate practice scenarios for the specified stage and skill.

## Requirements
- Scenarios must be realistic workplace situations
- Include clear success criteria
- Provide enough context for meaningful practice
- Difficulty should match the specified level

## Output Format
Output a complete lesson JSON matching the provided schema. Include:
- Realistic scenario with role and situation
- Clear goal and constraints
- 3 progressive hints (vague to specific)
- Complete rubric with scoring guides
- Evaluator context with ideal response and common mistakes

Generate only valid JSON, no additional text.
`;
```

---

## 8. API Specification

### tRPC Router Structure

```typescript
// server/routers/_app.ts
import { router } from '../trpc';
import { authRouter } from './auth';
import { scenarioRouter } from './scenario';
import { attemptRouter } from './attempt';
import { progressRouter } from './progress';
import { gamificationRouter } from './gamification';

export const appRouter = router({
  auth: authRouter,
  scenario: scenarioRouter,
  attempt: attemptRouter,
  progress: progressRouter,
  gamification: gamificationRouter,
});

export type AppRouter = typeof appRouter;
```

### Key Endpoints

#### Scenarios

```typescript
// server/routers/scenario.ts
export const scenarioRouter = router({
  // Get available scenarios for user's current stage
  getAvailable: protectedProcedure
    .input(z.object({
      stage: z.number().min(1).max(4).optional(),
      skill: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      // Returns scenarios user can access based on progress
    }),

  // Get single scenario by ID
  getById: protectedProcedure
    .input(z.object({ lessonId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Returns full scenario (without evaluator context)
    }),

  // Get user's history with a scenario
  getHistory: protectedProcedure
    .input(z.object({ lessonId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Returns user's previous attempts
    }),
});
```

#### Attempts

```typescript
// server/routers/attempt.ts
export const attemptRouter = router({
  // Submit a prompt for evaluation
  submit: protectedProcedure
    .input(z.object({
      lessonId: z.string(),
      promptText: z.string().min(10).max(5000),
      timeSpentSeconds: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // 1. Load lesson
      // 2. Call Claude API for evaluation
      // 3. Save attempt
      // 4. Update user progress
      // 5. Check for achievements
      // 6. Return feedback
    }),

  // Get hint
  getHint: protectedProcedure
    .input(z.object({
      lessonId: z.string(),
      hintNumber: z.number().min(1).max(3),
    }))
    .mutation(async ({ ctx, input }) => {
      // Returns next hint, increments hints_used
    }),

  // Submit reflection
  submitReflection: protectedProcedure
    .input(z.object({
      attemptId: z.string(),
      reflectionText: z.string().min(10).max(1000),
    }))
    .mutation(async ({ ctx, input }) => {
      // Save reflection, analyze with AI
    }),
});
```

#### Progress

```typescript
// server/routers/progress.ts
export const progressRouter = router({
  // Get user's overall progress
  getOverview: protectedProcedure
    .query(async ({ ctx }) => {
      // Returns stages, skills, completion percentages
    }),

  // Get skill tree data
  getSkillTree: protectedProcedure
    .query(async ({ ctx }) => {
      // Returns skill tree with user's progress overlaid
    }),

  // Get certification status
  getCertifications: protectedProcedure
    .query(async ({ ctx }) => {
      // Returns earned and available certifications
    }),

  // Start certification assessment
  startAssessment: protectedProcedure
    .input(z.object({ stage: z.number().min(1).max(4) }))
    .mutation(async ({ ctx, input }) => {
      // Returns assessment scenarios
    }),
});
```

#### Gamification

```typescript
// server/routers/gamification.ts
export const gamificationRouter = router({
  // Get streak status
  getStreak: protectedProcedure
    .query(async ({ ctx }) => {
      // Returns current streak, longest streak, streak freeze status
    }),

  // Use streak freeze
  useStreakFreeze: protectedProcedure
    .mutation(async ({ ctx }) => {
      // Consumes a streak freeze
    }),

  // Get achievements
  getAchievements: protectedProcedure
    .query(async ({ ctx }) => {
      // Returns earned and available achievements
    }),

  // Get leaderboard
  getLeaderboard: protectedProcedure
    .input(z.object({
      type: z.enum(['weekly', 'allTime']),
      limit: z.number().default(10),
    }))
    .query(async ({ ctx, input }) => {
      // Returns leaderboard with user's position
    }),
});
```

---

## 9. Implementation Phases

### Phase 1: Foundation (Days 1-4)

**Goal:** Deployable skeleton with auth and one working scenario.

#### Day 1: Project Setup
```bash
# Initialize Next.js with TypeScript
npx create-next-app@latest ai-literacy --typescript --tailwind --app --src-dir

# Install core dependencies
npm install @neondatabase/serverless drizzle-orm
npm install -D drizzle-kit
npm install next-auth @auth/drizzle-adapter
npm install @trpc/server @trpc/client @trpc/react-query @trpc/next
npm install @tanstack/react-query zod
npm install @anthropic-ai/sdk

# Initialize shadcn/ui
npx shadcn@latest init
npx shadcn@latest add button card input textarea badge progress dialog
```

#### Day 2: Auth & Database
- [ ] Set up Neon.tech project and get connection string
- [ ] Configure Drizzle ORM with schema
- [ ] Create database tables (profiles, attempts)
- [ ] Configure NextAuth.js with credentials/OAuth
- [ ] Build login/signup pages

#### Day 3: Core Exercise Flow
- [ ] Create first lesson JSON
- [ ] Build ScenarioCard component
- [ ] Build PromptInput component
- [ ] Build FeedbackPanel component
- [ ] Wire up basic exercise page

#### Day 4: Evaluation Integration
- [ ] Set up Claude API client
- [ ] Implement evaluator prompt
- [ ] Build attempt submission endpoint
- [ ] Connect frontend to backend
- [ ] Test full flow end-to-end

**Deliverable:** User can sign up, complete one scenario, see feedback.

### Phase 2: Progression System (Days 5-7)

**Goal:** XP, levels, skill tracking, multiple scenarios.

#### Day 5: Skill Tree
- [ ] Define skill tree structure (JSON)
- [ ] Build SkillTree component
- [ ] Implement skill unlocking logic
- [ ] Add user_skills table operations

#### Day 6: XP & Levels
- [ ] Define XP rewards per action
- [ ] Build XPDisplay component
- [ ] Build LevelProgress component
- [ ] Implement level-up logic
- [ ] Add level-up toast/celebration

#### Day 7: Stage 1 Content
- [ ] Create 15 Stage 1 scenarios (3 per skill)
- [ ] Test all scenarios
- [ ] Build scenario list page
- [ ] Add filtering by skill

**Deliverable:** Complete Stage 1 experience with progression.

### Phase 3: Gamification (Days 8-10)

**Goal:** Streaks, achievements, leaderboard.

#### Day 8: Streak System
- [ ] Build daily_activity tracking
- [ ] Implement streak calculation
- [ ] Build StreakBadge component
- [ ] Add streak freeze feature
- [ ] Build streak recovery UI

#### Day 9: Achievements
- [ ] Define achievement types
- [ ] Build achievement checking logic
- [ ] Build AchievementToast component
- [ ] Build achievements page
- [ ] Add "first scenario", "perfect score", etc.

#### Day 10: Leaderboard
- [ ] Build leaderboard query
- [ ] Build Leaderboard component
- [ ] Add weekly/all-time toggle
- [ ] Show user's position
- [ ] Add anonymization for others

**Deliverable:** Full gamification loop.

### Phase 4: Monetization (Days 11-12)

**Goal:** Paywall, Flitt.com integration, subscription management.

#### Day 11: Flitt Setup
- [ ] Create Flitt.com account and products
- [ ] Install Flitt SDK / configure API
- [ ] Build checkout flow
- [ ] Set up webhooks for subscription events
- [ ] Implement subscription status checks

#### Day 12: Paywall & Limits
- [ ] Build PaywallModal component
- [ ] Implement daily scenario limits (free tier)
- [ ] Gate advanced features
- [ ] Build subscription management page
- [ ] Test upgrade/downgrade flows

**Deliverable:** Working payment flow with free/paid tiers.

### Phase 5: Polish & Launch (Days 13-14)

**Goal:** Production-ready MVP.

#### Day 13: Testing & Bugs
- [ ] Full user flow testing
- [ ] Edge case handling
- [ ] Error states and messages
- [ ] Loading states
- [ ] Mobile responsiveness check

#### Day 14: Launch Prep
- [ ] Set up Vercel production
- [ ] Configure environment variables
- [ ] Set up error monitoring (Sentry)
- [ ] Create landing page
- [ ] Write onboarding copy
- [ ] Deploy and test production

**Deliverable:** Live MVP at production URL.

---

## 10. File Structure

```
ai-literacy/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Auth routes (grouped)
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── signup/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (dashboard)/              # Main app (grouped)
│   │   │   ├── page.tsx              # Dashboard home
│   │   │   ├── scenarios/
│   │   │   │   ├── page.tsx          # Scenario list
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx      # Exercise page
│   │   │   ├── progress/
│   │   │   │   └── page.tsx          # Skill tree view
│   │   │   ├── achievements/
│   │   │   │   └── page.tsx
│   │   │   ├── leaderboard/
│   │   │   │   └── page.tsx
│   │   │   ├── settings/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx            # Dashboard layout with sidebar
│   │   │
│   │   ├── api/
│   │   │   └── trpc/
│   │   │       └── [trpc]/
│   │   │           └── route.ts      # tRPC handler
│   │   │
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Landing page
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── ui/                       # shadcn/ui components
│   │   ├── scenario/
│   │   ├── exercise/
│   │   ├── feedback/
│   │   ├── gamification/
│   │   ├── progression/
│   │   └── layout/
│   │
│   ├── server/
│   │   ├── routers/                  # tRPC routers
│   │   │   ├── _app.ts
│   │   │   ├── auth.ts
│   │   │   ├── scenario.ts
│   │   │   ├── attempt.ts
│   │   │   ├── progress.ts
│   │   │   └── gamification.ts
│   │   ├── trpc.ts                   # tRPC setup
│   │   └── context.ts                # Request context
│   │
│   ├── lib/
│   │   ├── db/
│   │   │   ├── index.ts              # Drizzle client
│   │   │   ├── schema.ts             # Database schema
│   │   │   └── queries.ts            # Common queries
│   │   ├── anthropic/
│   │   │   └── client.ts             # Claude API client
│   │   ├── prompts/
│   │   │   ├── evaluator.ts
│   │   │   ├── hints.ts
│   │   │   └── reflection.ts
│   │   ├── lessons/
│   │   │   ├── loader.ts             # Load lessons from files
│   │   │   └── validator.ts          # Validate lesson JSON
│   │   ├── gamification/
│   │   │   ├── xp.ts                 # XP calculations
│   │   │   ├── streaks.ts            # Streak logic
│   │   │   └── achievements.ts       # Achievement checks
│   │   └── utils/
│   │       └── index.ts
│   │
│   ├── types/
│   │   ├── lesson.ts                 # Lesson schema types
│   │   ├── database.ts               # Supabase types
│   │   └── api.ts                    # API types
│   │
│   └── hooks/
│       ├── use-auth.ts
│       ├── use-streak.ts
│       └── use-progress.ts
│
├── content/
│   ├── lessons/
│   │   ├── stage-1/
│   │   │   ├── clarity/
│   │   │   │   ├── S1-CLARITY-001.json
│   │   │   │   ├── S1-CLARITY-002.json
│   │   │   │   └── S1-CLARITY-003.json
│   │   │   ├── constraints/
│   │   │   ├── context/
│   │   │   ├── reasoning/
│   │   │   └── output-shaping/
│   │   ├── stage-2/
│   │   ├── stage-3/
│   │   └── stage-4/
│   │
│   ├── skills/
│   │   └── skill-tree.json           # Skill definitions
│   │
│   └── achievements/
│       └── achievements.json          # Achievement definitions
│
├── scripts/
│   ├── generate-lesson.ts            # AI lesson generation
│   ├── validate-lessons.ts           # Validate all lesson JSONs
│   └── seed-db.ts                    # Database seeding
│
├── drizzle/
│   └── migrations/                   # Drizzle migrations
│       └── 0000_initial.sql
│
├── public/
│   └── images/
│
├── .env.local                        # Local environment variables
├── .env.example                      # Example env file
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── README.md
```

---

## Appendix A: Environment Variables

```bash
# .env.local

# Database (Neon.tech)
DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require

# Auth (NextAuth.js)
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Anthropic
ANTHROPIC_API_KEY=sk-ant-xxx

# Flitt.com
FLITT_SECRET_KEY=flitt_sk_xxx
FLITT_WEBHOOK_SECRET=whsec_xxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Appendix B: Claude Code Instructions

When working with Claude Code on this project, use these conventions:

### Starting a Session

```
I'm building an AI literacy platform. The PRD is in the project root.
Key files:
- /content/lessons/ - Lesson JSON files
- /src/lib/prompts/ - System prompts
- /src/server/routers/ - API endpoints
- /src/components/ - React components

Current task: [describe what you're working on]
```

### Component Generation

```
Create a new component: FeedbackPanel
Location: /src/components/feedback/feedback-panel.tsx
Requirements:
- Uses shadcn/ui Card as base
- Shows score with ProgressRing
- Lists rubric breakdown
- Has retry/next buttons
- Follows existing component patterns
```

### API Endpoint Generation

```
Create tRPC endpoint: attempt.submit
Location: /src/server/routers/attempt.ts
Requirements:
- Protected route (requires auth)
- Validates input with zod
- Calls Claude API for evaluation
- Saves attempt to database
- Returns structured feedback
```

### Lesson Generation

```
Generate a new lesson:
Stage: 1
Skill: constraints
Difficulty: 2
Topic: Getting AI to write code comments

Output location: /content/lessons/stage-1/constraints/S1-CONSTRAINTS-002.json
Follow the lesson schema in /src/types/lesson.ts
```

---

## Appendix C: Quick Reference Commands

```bash
# Development
npm run dev                    # Start dev server
npm run build                  # Build for production
npm run lint                   # Run linter

# Database (Drizzle + Neon)
npm run db:generate           # Generate migrations from schema changes
npm run db:migrate            # Apply migrations to Neon
npm run db:push               # Push schema directly (dev only)
npm run db:studio             # Open Drizzle Studio GUI

# Content
npm run validate-lessons      # Validate all lesson JSONs
npm run generate-lesson       # Interactive lesson generator

# Deployment
vercel                        # Deploy to Vercel
```

---

*End of PRD*