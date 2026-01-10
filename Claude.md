# AI Literacy Platform

A practice-first AI literacy platform that teaches users to work with AI through doing, not watching. Built for solo development with Claude Code.

## Core Concept

**System prompts are infrastructure. Lessons are data.**

Users complete scenarios and receive AI-powered feedback. No videos, no static content, no teachers.

## The 4-Stage Framework

| Stage | Name | Goal | Certification |
|-------|------|------|---------------|
| 1 | Prompting | Get correct reasoning and output shape from AI | Prompt Engineer L1 |
| 2 | Structuring | Turn AI output into machine-usable structure (JSON, schemas) | AI Systems Designer L2 |
| 3 | Automation | Wire AI into workflows (n8n-style orchestration) | AI Automation Specialist L3 |
| 4 | Vibe Coding | Ship real products with AI assistance | AI Product Builder L4 |

## Tech Stack

```
Frontend:  Next.js 14 (App Router) + TypeScript + Tailwind
Components: shadcn/ui (copy-paste, we own them)
API:       tRPC (type-safe)
Database:  Neon.tech (Serverless PostgreSQL)
Auth:      NextAuth.js (or Auth.js)
AI:        Anthropic Claude API (evaluation, hints)
Payments:  Flitt.com (subscriptions)
Hosting:   Vercel
```

## Project Structure

```
ai-literacy/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── (auth)/               # Login, signup (grouped)
│   │   ├── (dashboard)/          # Main app (grouped)
│   │   │   ├── scenarios/[id]/   # Exercise page
│   │   │   ├── progress/         # Skill tree
│   │   │   └── ...
│   │   └── api/trpc/             # tRPC handler
│   │
│   ├── components/
│   │   ├── ui/                   # shadcn/ui base components
│   │   ├── terminal/             # TerminalWindow, CommandInput, StatusBar
│   │   ├── scenario/             # ScenarioCard, ScenarioList
│   │   ├── exercise/             # PromptInput, ExerciseContainer
│   │   ├── feedback/             # FeedbackPanel, ScoreBreakdown
│   │   ├── gamification/         # StreakBadge, XPDisplay, LevelProgress
│   │   └── progression/          # SkillTree, StageCard
│   │
│   ├── server/routers/           # tRPC routers
│   ├── lib/
│   │   ├── prompts/              # System prompts (evaluator, hints)
│   │   ├── db/                   # Neon PostgreSQL clients
│   │   └── lessons/              # Lesson loader, validator
│   └── types/                    # TypeScript types
│
├── content/
│   └── lessons/                  # Lesson JSON files
│       ├── stage-1/
│       │   ├── clarity/
│       │   ├── constraints/
│       │   └── ...
│       ├── stage-2/
│       ├── stage-3/
│       └── stage-4/
│
└── drizzle/migrations/           # Database migrations (Drizzle ORM)
```

## Key Conventions

### Lessons are JSON, not code

Lessons live in `/content/lessons/` as JSON files. To add a lesson:
1. Create JSON file following the schema
2. Drop in correct folder: `content/lessons/stage-{n}/{skill}/`
3. Deploy — it appears automatically

Lesson ID format: `S{stage}-{SKILL}-{number}` (e.g., `S1-CLARITY-001`)

### Components

- Always use shadcn/ui from `/src/components/ui/` as base
- Custom components extend shadcn, don't replace
- Run `npx shadcn@latest add [component]` to add new base components

### API

- All API calls through tRPC (`/src/server/routers/`)
- Protected routes use `protectedProcedure`
- Validate input with Zod schemas

### Database

- Using Neon.tech serverless PostgreSQL with Drizzle ORM
- Types auto-generated from Drizzle schema
- Row-level security handled at application layer via auth middleware
- Use database client from `/src/lib/db/`

### AI Evaluation

- Single evaluator prompt handles all lessons (in `/src/lib/prompts/evaluator.ts`)
- Lesson JSON provides rubric and context
- Evaluator returns structured JSON feedback

## Lesson JSON Schema

```typescript
interface Lesson {
  id: string                     // "S1-CLARITY-001"
  version: number
  meta: {
    stage: 1 | 2 | 3 | 4
    skill: string
    difficulty: 1 | 2 | 3 | 4 | 5
    estimatedMinutes: number
    prerequisites: string[]
    tags: string[]
  }
  scenario: {
    title: string
    context: string              // Role + situation
    goal: string
    constraints: string[]
    hints: string[]              // Progressive hints
  }
  evaluation: {
    rubric: {
      id: string
      name: string
      weight: number             // Must sum to 100
      description: string
      scoringGuide: { excellent, good, adequate, poor: string }
    }[]
    passingScore: number         // Usually 70
  }
  evaluatorContext: {
    idealResponse: string
    commonMistakes: string[]
    keyElements: string[]
    antiPatterns: string[]
  }
}
```

## Database Tables

```
profiles        - User data, XP, level, streak, subscription
user_skills     - Progress per skill (scenarios completed, mastery)
attempts        - Individual scenario attempts with scores
reflections     - Post-exercise reflections
achievements    - Unlocked badges
daily_activity  - For streak tracking
certifications  - Earned certificates
```

## Core User Flow

```
1. User sees scenario (context, goal, constraints)
2. User writes prompt in PromptInput
3. Submit → API calls Claude with evaluator prompt + lesson rubric
4. Claude returns JSON: { totalScore, rubricScores, feedback, improvedExample }
5. FeedbackPanel displays results
6. User can retry or continue
7. After passing, reflection prompt appears
8. XP awarded, progress updated, achievements checked
```

## Commands

```bash
npm run dev                    # Start dev server (localhost:3000)
npm run build                  # Production build
npm run lint                   # Run linter

npm run db:generate           # Generate Drizzle migrations
npm run db:migrate            # Run migrations on Neon
npm run db:studio             # Open Drizzle Studio

npm run validate-lessons      # Validate all lesson JSONs (custom script)
```

## Environment Variables

```
DATABASE_URL                   # Neon PostgreSQL connection string
NEXTAUTH_SECRET               # NextAuth.js secret
NEXTAUTH_URL                  # App URL for auth callbacks
ANTHROPIC_API_KEY
FLITT_SECRET_KEY              # Flitt.com API key
FLITT_WEBHOOK_SECRET          # Flitt webhook verification
NEXT_PUBLIC_APP_URL
```

## Design System

**Terminal-Native Aesthetic** — Dark theme inspired by Claude Code CLI.

See `Documents/DESIGN_SYSTEM.md` for full specifications.

### Key Design Tokens

```
# Backgrounds (dark terminal)
terminal-bg:      #1A1A1A     - Main background
terminal-card:    #252525     - Cards, surfaces
terminal-input:   #2D2D2D     - Input fields

# Text
term-primary:     #E5E5E5     - Primary text
term-secondary:   #A3A3A3     - Secondary text
term-muted:       #737373     - Muted/disabled

# Accent (Anthropic orange)
accent:           #D97706     - Primary accent
accent-hover:     #F59E0B     - Hover state

# Stage colors
stage-1: #3B82F6 (blue)       - Prompting
stage-2: #8B5CF6 (purple)     - Structuring
stage-3: #F59E0B (amber)      - Automation
stage-4: #10B981 (emerald)    - Vibe Coding

# Semantic
success: #22C55E              - Passed, connected
error:   #EF4444              - Failed, errors
```

### Typography

- **Font:** JetBrains Mono (monospace everywhere)
- **Body:** 14px
- **ASCII art for branding**
- **Command-line style inputs:** `> prompt here_`

## Implementation Priority

**Phase 1 (Days 1-4): Foundation**
- Project setup, auth, database
- One working scenario end-to-end
- Core components: ScenarioCard, PromptInput, FeedbackPanel

**Phase 2 (Days 5-7): Progression**
- Skill tree, XP, levels
- Stage 1 content (15 scenarios)

**Phase 3 (Days 8-10): Gamification**
- Streaks, achievements, leaderboard

**Phase 4 (Days 11-12): Monetization**
- Flitt.com integration, paywall, limits

**Phase 5 (Days 13-14): Polish & Launch**
- Testing, error handling, deploy

## Quick Reference

| Task | Location |
|------|----------|
| Add shadcn component | `npx shadcn@latest add [name]` |
| Add lesson | `/content/lessons/stage-{n}/{skill}/` |
| Add API endpoint | `/src/server/routers/` |
| Add page | `/src/app/(dashboard)/` |
| Edit evaluator prompt | `/src/lib/prompts/evaluator.ts` |
| Edit DB schema | `/src/lib/db/schema.ts` + run `npm run db:generate` |

## Notes for Claude Code

- When creating components, check `/src/components/ui/` for existing shadcn components to extend
- **Use terminal aesthetic** — monospace fonts, dark backgrounds, `> ` command prompts
- Reference `Documents/DESIGN_SYSTEM.md` for visual specifications
- Lesson content is DATA — generate JSON, not React components
- All lesson evaluation uses the same system prompt with different rubric data
- Keep the evaluator prompt stable; lesson JSON provides the variation
- User progress is tracked per-skill, not per-lesson
- Streaks are based on `daily_activity` table, calculated on login