# Admin Dashboard Implementation

## Overview

Build a terminal-themed admin dashboard for managing lessons and user subscriptions, consistent with the platform's design system.

---

## Environment Configuration

Add to `.env`:

```bash
# Admin Credentials
ADMIN_EMAIL=admin
ADMIN_PASSWORD=12345
```

---

## Part 1: Database Schema Changes

### 1.1 Add Role Field to Profiles

Modify `src/lib/db/schema.ts` - add to profiles table:

```typescript
// Add after subscriptionEndDate
role: text('role').default('user'), // 'user' | 'admin' | 'moderator'
```

### 1.2 Generate & Run Migration

```bash
npm run db:generate
npm run db:migrate
```

### 1.3 SQL Migration (Alternative)

```sql
ALTER TABLE profiles ADD COLUMN role TEXT DEFAULT 'user';
```

---

## Part 2: Admin Authentication

### 2.1 Update Auth Configuration

Modify `src/lib/auth/index.ts`:

```typescript
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { db, profiles } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string(),
  password: z.string().min(1),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        // Check for admin login
        if (
          email === process.env.ADMIN_EMAIL &&
          password === process.env.ADMIN_PASSWORD
        ) {
          // Find or create admin user
          let adminUser = await db.query.profiles.findFirst({
            where: eq(profiles.email, 'admin@ailit.dev'),
          });

          if (!adminUser) {
            const [newAdmin] = await db
              .insert(profiles)
              .values({
                email: 'admin@ailit.dev',
                displayName: 'Admin',
                role: 'admin',
              })
              .returning();
            adminUser = newAdmin;
          } else if (adminUser.role !== 'admin') {
            // Ensure role is admin
            await db
              .update(profiles)
              .set({ role: 'admin' })
              .where(eq(profiles.id, adminUser.id));
          }

          return {
            id: adminUser.id,
            email: adminUser.email,
            name: adminUser.displayName || 'Admin',
            role: 'admin',
          };
        }

        // Regular user login (email-based for MVP)
        let user = await db.query.profiles.findFirst({
          where: eq(profiles.email, email),
        });

        if (!user) {
          // Auto-create user for MVP
          const [newUser] = await db
            .insert(profiles)
            .values({ email })
            .returning();
          user = newUser;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.displayName,
          role: user.role || 'user',
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || 'user';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
});
```

### 2.2 Update Session Types

Modify `src/types/next-auth.d.ts`:

```typescript
import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    role?: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role?: string;
  }
}
```

---

## Part 3: Admin tRPC Procedures

### 3.1 Add Admin Procedure

Modify `src/server/trpc.ts` - add after `protectedProcedure`:

```typescript
import { db, profiles } from '@/lib/db';
import { eq } from 'drizzle-orm';

export const adminProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  // Check user role in database
  const [profile] = await db
    .select({ role: profiles.role })
    .from(profiles)
    .where(eq(profiles.id, ctx.session.user.id));

  if (profile?.role !== 'admin') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Admin access required',
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.session.user,
      isAdmin: true,
    },
  });
});
```

### 3.2 Create Admin Routers

Create `src/server/routers/admin/index.ts`:

```typescript
import { router } from '../../trpc';
import { adminLessonsRouter } from './lessons';
import { adminUsersRouter } from './users';
import { adminAnalyticsRouter } from './analytics';

export const adminRouter = router({
  lessons: adminLessonsRouter,
  users: adminUsersRouter,
  analytics: adminAnalyticsRouter,
});
```

### 3.3 Admin Lessons Router

Create `src/server/routers/admin/lessons.ts`:

```typescript
import { z } from 'zod';
import { router, adminProcedure } from '../../trpc';
import { db, lessons } from '@/lib/db';
import { eq, and, ilike, desc, asc, sql } from 'drizzle-orm';

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
  exampleInput: z.string().optional(),
  difficulty: z.number().min(1).max(5).optional(),
  estimatedMinutes: z.number().min(1).max(60).optional(),
  tags: z.array(z.string()).optional(),
  rubric: z.array(rubricItemSchema).optional(),
  passingScore: z.number().min(50).max(100).optional(),
  idealResponse: z.string().optional(),
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
        sortBy: z.enum(['id', 'stage', 'skill', 'difficulty', 'updatedAt']).default('id'),
        sortOrder: z.enum(['asc', 'desc']).default('asc'),
      })
    )
    .query(async ({ input }) => {
      const { stage, skill, isPublished, search, page, limit, sortBy, sortOrder } = input;
      const offset = (page - 1) * limit;

      const conditions = [];
      if (stage !== undefined) conditions.push(eq(lessons.stage, stage));
      if (skill) conditions.push(eq(lessons.skill, skill));
      if (isPublished !== undefined) conditions.push(eq(lessons.isPublished, isPublished));
      if (search) conditions.push(ilike(lessons.title, `%${search}%`));

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const [data, countResult] = await Promise.all([
        db
          .select()
          .from(lessons)
          .where(where)
          .orderBy(sortOrder === 'asc' ? asc(lessons[sortBy]) : desc(lessons[sortBy]))
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
      const [lesson] = await db.select().from(lessons).where(eq(lessons.id, input.id));
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
      const [lesson] = await db.select().from(lessons).where(eq(lessons.id, input.id));
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
```

### 3.4 Admin Users Router

Create `src/server/routers/admin/users.ts`:

```typescript
import { z } from 'zod';
import { router, adminProcedure } from '../../trpc';
import { db, profiles, userSkills, attempts, achievements, dailyActivity } from '@/lib/db';
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
        sortBy: z.enum(['email', 'totalXp', 'level', 'createdAt']).default('createdAt'),
        sortOrder: z.enum(['asc', 'desc']).default('desc'),
      })
    )
    .query(async ({ input }) => {
      const { search, subscriptionTier, role, page, limit, sortBy, sortOrder } = input;
      const offset = (page - 1) * limit;

      const conditions = [];
      if (subscriptionTier) conditions.push(eq(profiles.subscriptionTier, subscriptionTier));
      if (role) conditions.push(eq(profiles.role, role));
      if (search) {
        conditions.push(
          or(ilike(profiles.email, `%${search}%`), ilike(profiles.displayName, `%${search}%`))
        );
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const [data, countResult] = await Promise.all([
        db
          .select()
          .from(profiles)
          .where(where)
          .orderBy(sortOrder === 'asc' ? asc(profiles[sortBy]) : desc(profiles[sortBy]))
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
      const [user] = await db.select().from(profiles).where(eq(profiles.id, input.id));
      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
      }

      // Get additional stats
      const [skills, attemptsCount, achievementsCount] = await Promise.all([
        db.select().from(userSkills).where(eq(userSkills.userId, input.id)),
        db.select({ count: count() }).from(attempts).where(eq(attempts.userId, input.id)),
        db.select({ count: count() }).from(achievements).where(eq(achievements.userId, input.id)),
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
```

### 3.5 Admin Analytics Router

Create `src/server/routers/admin/analytics.ts`:

```typescript
import { z } from 'zod';
import { router, adminProcedure } from '../../trpc';
import { db, profiles, attempts, lessons, dailyActivity } from '@/lib/db';
import { eq, sql, gte, count, avg } from 'drizzle-orm';

export const adminAnalyticsRouter = router({
  // Dashboard overview stats
  overview: adminProcedure.query(async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      activeToday,
      subscriptionStats,
      totalLessons,
      attemptsTodayResult,
    ] = await Promise.all([
      db.select({ count: count() }).from(profiles),
      db
        .select({ count: count() })
        .from(dailyActivity)
        .where(eq(dailyActivity.activityDate, today.toISOString().split('T')[0])),
      db
        .select({
          tier: profiles.subscriptionTier,
          count: count(),
        })
        .from(profiles)
        .groupBy(profiles.subscriptionTier),
      db.select({ count: count() }).from(lessons),
      db
        .select({ count: count() })
        .from(attempts)
        .where(gte(attempts.createdAt, today)),
    ]);

    return {
      totalUsers: totalUsers[0].count,
      activeToday: activeToday[0].count,
      subscriptions: subscriptionStats.reduce(
        (acc, { tier, count }) => ({ ...acc, [tier || 'free']: count }),
        {} as Record<string, number>
      ),
      totalLessons: totalLessons[0].count,
      attemptsToday: attemptsTodayResult[0].count,
    };
  }),

  // Lesson performance stats
  lessonStats: adminProcedure
    .input(z.object({ lessonId: z.string().optional() }))
    .query(async ({ input }) => {
      const baseQuery = input.lessonId
        ? eq(attempts.lessonId, input.lessonId)
        : undefined;

      const stats = await db
        .select({
          lessonId: attempts.lessonId,
          totalAttempts: count(),
          avgScore: avg(attempts.score),
          passCount: sql<number>`count(case when ${attempts.score} >= 70 then 1 end)`,
        })
        .from(attempts)
        .where(baseQuery)
        .groupBy(attempts.lessonId);

      return stats.map((s) => ({
        ...s,
        passRate: s.totalAttempts > 0 ? (s.passCount / s.totalAttempts) * 100 : 0,
      }));
    }),

  // Activity trends
  activityTrends: adminProcedure
    .input(z.object({ days: z.number().default(30) }))
    .query(async ({ input }) => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - input.days);

      const trends = await db
        .select({
          date: dailyActivity.activityDate,
          activeUsers: count(),
          scenariosCompleted: sql<number>`sum(${dailyActivity.scenariosCompleted})`,
          xpEarned: sql<number>`sum(${dailyActivity.xpEarned})`,
        })
        .from(dailyActivity)
        .where(gte(dailyActivity.activityDate, startDate.toISOString().split('T')[0]))
        .groupBy(dailyActivity.activityDate)
        .orderBy(dailyActivity.activityDate);

      return trends;
    }),
});
```

### 3.6 Register Admin Router

Modify `src/server/routers/_app.ts`:

```typescript
import { router } from '../trpc';
// ... existing imports
import { adminRouter } from './admin';

export const appRouter = router({
  // ... existing routers
  admin: adminRouter,
});
```

---

## Part 4: Admin Pages

### 4.1 Admin Layout

Create `src/app/(admin)/admin/layout.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  BarChart3,
  ChevronLeft,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

const adminNavLinks = [
  { href: '/admin', label: 'dashboard', icon: LayoutDashboard },
  { href: '/admin/lessons', label: 'lessons', icon: BookOpen },
  { href: '/admin/users', label: 'users', icon: Users },
  { href: '/admin/analytics', label: 'analytics', icon: BarChart3 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    // Check if user is admin
    if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/');
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
        <div className="text-[#737373] font-mono animate-pulse">
          authenticating admin access...
        </div>
      </div>
    );
  }

  if (!session || session.user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex">
      {/* Sidebar - Desktop */}
      <aside
        className={cn(
          'hidden md:flex flex-col border-r border-[#333] bg-[#1A1A1A] transition-all duration-300',
          sidebarOpen ? 'w-56' : 'w-16'
        )}
      >
        {/* Sidebar Header */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-[#333]">
          {sidebarOpen && (
            <Link href="/admin" className="text-[#D97706] font-mono font-bold">
              ADMIN
            </Link>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 text-[#737373] hover:text-[#E5E5E5] hover:bg-[#252525] rounded transition-colors"
          >
            <ChevronLeft
              className={cn('h-4 w-4 transition-transform', !sidebarOpen && 'rotate-180')}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1">
          {adminNavLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded font-mono text-sm transition-colors',
                  isActive
                    ? 'bg-[#D97706]/10 text-[#D97706]'
                    : 'text-[#737373] hover:text-[#E5E5E5] hover:bg-[#252525]'
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {sidebarOpen && <span>{link.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-2 border-t border-[#333]">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 text-[#737373] hover:text-[#E5E5E5] hover:bg-[#252525] rounded font-mono text-sm transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            {sidebarOpen && <span>back to app</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 flex items-center justify-between px-4 border-b border-[#333] bg-[#1A1A1A]/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-[#737373] hover:text-[#E5E5E5] transition-colors"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <span className="text-[#D97706] font-mono font-bold md:hidden">ADMIN</span>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <span className="text-[#737373] font-mono hidden sm:inline">
              {session.user?.email}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="flex items-center gap-2 text-[#737373] hover:text-[#EF4444] transition-colors font-mono text-xs"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">logout</span>
            </button>
          </div>
        </header>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-b border-[#333] bg-[#1A1A1A] px-4 py-2">
            {adminNavLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded font-mono text-sm transition-colors',
                    isActive
                      ? 'bg-[#D97706]/10 text-[#D97706]'
                      : 'text-[#737373] hover:text-[#E5E5E5] hover:bg-[#252525]'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
```

### 4.2 Dashboard Page

Create `src/app/(admin)/admin/page.tsx`:

```tsx
'use client';

import { trpc } from '@/lib/trpc/client';
import { Users, BookOpen, BarChart3, Zap } from 'lucide-react';

export default function AdminDashboard() {
  const { data: stats, isLoading } = trpc.admin.analytics.overview.useQuery();

  if (isLoading) {
    return (
      <div className="text-[#737373] font-mono animate-pulse">loading dashboard...</div>
    );
  }

  const statCards = [
    {
      label: 'total users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: '#3B82F6',
    },
    {
      label: 'active today',
      value: stats?.activeToday || 0,
      icon: Zap,
      color: '#22C55E',
    },
    {
      label: 'total lessons',
      value: stats?.totalLessons || 0,
      icon: BookOpen,
      color: '#8B5CF6',
    },
    {
      label: 'attempts today',
      value: stats?.attemptsToday || 0,
      icon: BarChart3,
      color: '#F59E0B',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-mono text-[#E5E5E5]">dashboard</h1>
        <p className="text-sm text-[#737373] font-mono mt-1">
          overview of platform stats
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-[#252525] border border-[#333] rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-[#737373] font-mono text-sm">{stat.label}</span>
                <Icon className="h-4 w-4" style={{ color: stat.color }} />
              </div>
              <div className="mt-2 text-2xl font-mono text-[#E5E5E5]">
                {stat.value.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Subscription Breakdown */}
      <div className="bg-[#252525] border border-[#333] rounded-lg p-4">
        <h2 className="text-[#E5E5E5] font-mono text-sm mb-4">subscriptions</h2>
        <div className="grid grid-cols-3 gap-4">
          {['free', 'trial', 'pro'].map((tier) => (
            <div key={tier} className="text-center">
              <div className="text-[#737373] font-mono text-xs uppercase">{tier}</div>
              <div className="text-xl font-mono text-[#E5E5E5] mt-1">
                {stats?.subscriptions[tier] || 0}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

### 4.3 Lessons List Page

Create `src/app/(admin)/admin/lessons/page.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { trpc } from '@/lib/trpc/client';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Search, ChevronLeft, ChevronRight, Eye, EyeOff, Edit } from 'lucide-react';

export default function AdminLessonsPage() {
  const [search, setSearch] = useState('');
  const [stage, setStage] = useState<number | undefined>();
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch } = trpc.admin.lessons.list.useQuery({
    search: search || undefined,
    stage,
    page,
    limit: 20,
  });

  const togglePublish = trpc.admin.lessons.togglePublish.useMutation({
    onSuccess: () => refetch(),
  });

  const stageColors: Record<number, string> = {
    1: '#3B82F6',
    2: '#8B5CF6',
    3: '#F59E0B',
    4: '#10B981',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-mono text-[#E5E5E5]">lessons</h1>
        <p className="text-sm text-[#737373] font-mono mt-1">
          manage lesson content
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#737373]" />
          <input
            type="text"
            placeholder="search lessons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#252525] border border-[#333] rounded px-10 py-2 text-sm font-mono text-[#E5E5E5] placeholder:text-[#737373] focus:border-[#D97706] outline-none"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setStage(undefined)}
            className={cn(
              'px-3 py-2 rounded font-mono text-xs transition-colors',
              stage === undefined
                ? 'bg-[#D97706]/20 text-[#D97706]'
                : 'text-[#737373] hover:text-[#E5E5E5] bg-[#252525]'
            )}
          >
            all
          </button>
          {[1, 2, 3, 4].map((s) => (
            <button
              key={s}
              onClick={() => setStage(s)}
              className={cn(
                'px-3 py-2 rounded font-mono text-xs transition-colors',
                stage === s
                  ? 'text-[#E5E5E5]'
                  : 'text-[#737373] hover:text-[#E5E5E5] bg-[#252525]'
              )}
              style={{ backgroundColor: stage === s ? stageColors[s] + '33' : undefined }}
            >
              stage {s}
            </button>
          ))}
        </div>
      </div>

      {/* Lessons Table */}
      <div className="bg-[#252525] border border-[#333] rounded-lg overflow-hidden">
        <table className="w-full text-sm font-mono">
          <thead>
            <tr className="border-b border-[#333] text-[#737373]">
              <th className="text-left px-4 py-3">id</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">title</th>
              <th className="text-left px-4 py-3 hidden sm:table-cell">skill</th>
              <th className="text-center px-4 py-3">status</th>
              <th className="text-right px-4 py-3">actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[#737373]">
                  loading...
                </td>
              </tr>
            ) : data?.lessons.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[#737373]">
                  no lessons found
                </td>
              </tr>
            ) : (
              data?.lessons.map((lesson) => (
                <tr key={lesson.id} className="border-b border-[#333] last:border-0">
                  <td className="px-4 py-3 text-[#E5E5E5]">{lesson.id}</td>
                  <td className="px-4 py-3 text-[#A3A3A3] hidden md:table-cell truncate max-w-[200px]">
                    {lesson.title}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span
                      className="px-2 py-0.5 rounded text-xs"
                      style={{
                        backgroundColor: stageColors[lesson.stage] + '20',
                        color: stageColors[lesson.stage],
                      }}
                    >
                      {lesson.skill}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {lesson.isPublished ? (
                      <span className="text-[#22C55E]">published</span>
                    ) : (
                      <span className="text-[#737373]">draft</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => togglePublish.mutate({ id: lesson.id })}
                        className="p-1.5 text-[#737373] hover:text-[#E5E5E5] transition-colors"
                        title={lesson.isPublished ? 'Unpublish' : 'Publish'}
                      >
                        {lesson.isPublished ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                      <Link
                        href={`/admin/lessons/${lesson.id}`}
                        className="p-1.5 text-[#737373] hover:text-[#D97706] transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#333]">
            <span className="text-[#737373] text-sm">
              page {data.page} of {data.totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 text-[#737373] hover:text-[#E5E5E5] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                disabled={page === data.totalPages}
                className="p-1.5 text-[#737373] hover:text-[#E5E5E5] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

### 4.4 Lesson Editor Page

Create `src/app/(admin)/admin/lessons/[id]/page.tsx`:

```tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc/client';
import { cn } from '@/lib/utils';
import { ChevronLeft, Save, Trash2, Plus, GripVertical } from 'lucide-react';
import Link from 'next/link';

export default function LessonEditorPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'scenario' | 'evaluation' | 'context'>('scenario');
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [isDirty, setIsDirty] = useState(false);

  const { data: lesson, isLoading } = trpc.admin.lessons.getById.useQuery({ id });
  const updateMutation = trpc.admin.lessons.update.useMutation({
    onSuccess: () => {
      setIsDirty(false);
    },
  });

  useEffect(() => {
    if (lesson) {
      setFormData(lesson);
    }
  }, [lesson]);

  const handleChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleSave = () => {
    updateMutation.mutate({
      id,
      data: {
        title: formData.title as string,
        context: formData.context as string,
        goal: formData.goal as string,
        constraints: formData.constraints as string[],
        hints: formData.hints as string[],
        exampleInput: formData.exampleInput as string,
        difficulty: formData.difficulty as number,
        estimatedMinutes: formData.estimatedMinutes as number,
        tags: formData.tags as string[],
        rubric: formData.rubric as unknown[],
        passingScore: formData.passingScore as number,
        idealResponse: formData.idealResponse as string,
        commonMistakes: formData.commonMistakes as string[],
        keyElements: formData.keyElements as string[],
        antiPatterns: formData.antiPatterns as string[],
        isPublished: formData.isPublished as boolean,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="text-[#737373] font-mono animate-pulse">loading lesson...</div>
    );
  }

  if (!lesson) {
    return <div className="text-[#EF4444] font-mono">lesson not found</div>;
  }

  const tabs = [
    { id: 'scenario', label: 'scenario' },
    { id: 'evaluation', label: 'evaluation' },
    { id: 'context', label: 'evaluator context' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/lessons"
            className="p-2 text-[#737373] hover:text-[#E5E5E5] transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-mono text-[#E5E5E5]">{id}</h1>
            <p className="text-sm text-[#737373] font-mono mt-0.5">
              stage {lesson.stage} / {lesson.skill}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'px-2 py-1 rounded text-xs font-mono',
              formData.isPublished
                ? 'bg-[#22C55E]/20 text-[#22C55E]'
                : 'bg-[#737373]/20 text-[#737373]'
            )}
          >
            {formData.isPublished ? 'published' : 'draft'}
          </span>
          <button
            onClick={handleSave}
            disabled={!isDirty || updateMutation.isPending}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded font-mono text-sm transition-colors',
              isDirty
                ? 'bg-[#D97706] text-[#1A1A1A] hover:bg-[#F59E0B]'
                : 'bg-[#333] text-[#737373] cursor-not-allowed'
            )}
          >
            <Save className="h-4 w-4" />
            save
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[#333]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={cn(
              'px-4 py-2 font-mono text-sm transition-colors relative',
              activeTab === tab.id
                ? 'text-[#D97706]'
                : 'text-[#737373] hover:text-[#E5E5E5]'
            )}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D97706]" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-[#252525] border border-[#333] rounded-lg p-6">
        {activeTab === 'scenario' && (
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-[#737373] font-mono text-sm mb-2">title</label>
              <input
                type="text"
                value={(formData.title as string) || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#333] rounded px-4 py-2 text-sm font-mono text-[#E5E5E5] focus:border-[#D97706] outline-none"
              />
            </div>

            {/* Context */}
            <div>
              <label className="block text-[#737373] font-mono text-sm mb-2">context</label>
              <textarea
                value={(formData.context as string) || ''}
                onChange={(e) => handleChange('context', e.target.value)}
                rows={4}
                className="w-full bg-[#1A1A1A] border border-[#333] rounded px-4 py-2 text-sm font-mono text-[#E5E5E5] focus:border-[#D97706] outline-none resize-none"
              />
            </div>

            {/* Goal */}
            <div>
              <label className="block text-[#737373] font-mono text-sm mb-2">goal</label>
              <textarea
                value={(formData.goal as string) || ''}
                onChange={(e) => handleChange('goal', e.target.value)}
                rows={2}
                className="w-full bg-[#1A1A1A] border border-[#333] rounded px-4 py-2 text-sm font-mono text-[#E5E5E5] focus:border-[#D97706] outline-none resize-none"
              />
            </div>

            {/* Constraints */}
            <div>
              <label className="block text-[#737373] font-mono text-sm mb-2">
                constraints
              </label>
              <ArrayEditor
                items={(formData.constraints as string[]) || []}
                onChange={(items) => handleChange('constraints', items)}
                placeholder="add constraint..."
              />
            </div>

            {/* Hints */}
            <div>
              <label className="block text-[#737373] font-mono text-sm mb-2">hints</label>
              <ArrayEditor
                items={(formData.hints as string[]) || []}
                onChange={(items) => handleChange('hints', items)}
                placeholder="add hint..."
              />
            </div>

            {/* Metadata row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[#737373] font-mono text-sm mb-2">
                  difficulty
                </label>
                <select
                  value={(formData.difficulty as number) || 1}
                  onChange={(e) => handleChange('difficulty', parseInt(e.target.value))}
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded px-4 py-2 text-sm font-mono text-[#E5E5E5] focus:border-[#D97706] outline-none"
                >
                  {[1, 2, 3, 4, 5].map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[#737373] font-mono text-sm mb-2">
                  est. minutes
                </label>
                <input
                  type="number"
                  value={(formData.estimatedMinutes as number) || 5}
                  onChange={(e) =>
                    handleChange('estimatedMinutes', parseInt(e.target.value))
                  }
                  min={1}
                  max={60}
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded px-4 py-2 text-sm font-mono text-[#E5E5E5] focus:border-[#D97706] outline-none"
                />
              </div>
              <div>
                <label className="block text-[#737373] font-mono text-sm mb-2">
                  published
                </label>
                <button
                  onClick={() => handleChange('isPublished', !formData.isPublished)}
                  className={cn(
                    'w-full px-4 py-2 rounded font-mono text-sm transition-colors',
                    formData.isPublished
                      ? 'bg-[#22C55E]/20 text-[#22C55E]'
                      : 'bg-[#333] text-[#737373]'
                  )}
                >
                  {formData.isPublished ? 'yes' : 'no'}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'evaluation' && (
          <div className="space-y-6">
            <div>
              <label className="block text-[#737373] font-mono text-sm mb-2">
                passing score
              </label>
              <input
                type="number"
                value={(formData.passingScore as number) || 70}
                onChange={(e) => handleChange('passingScore', parseInt(e.target.value))}
                min={50}
                max={100}
                className="w-32 bg-[#1A1A1A] border border-[#333] rounded px-4 py-2 text-sm font-mono text-[#E5E5E5] focus:border-[#D97706] outline-none"
              />
            </div>

            <div>
              <label className="block text-[#737373] font-mono text-sm mb-2">
                rubric items (weights must sum to 100)
              </label>
              <div className="text-[#737373] font-mono text-sm">
                rubric editor - see lesson JSON for structure
              </div>
            </div>
          </div>
        )}

        {activeTab === 'context' && (
          <div className="space-y-6">
            <div>
              <label className="block text-[#737373] font-mono text-sm mb-2">
                ideal response
              </label>
              <textarea
                value={(formData.idealResponse as string) || ''}
                onChange={(e) => handleChange('idealResponse', e.target.value)}
                rows={8}
                className="w-full bg-[#1A1A1A] border border-[#333] rounded px-4 py-2 text-sm font-mono text-[#E5E5E5] focus:border-[#D97706] outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-[#737373] font-mono text-sm mb-2">
                common mistakes
              </label>
              <ArrayEditor
                items={(formData.commonMistakes as string[]) || []}
                onChange={(items) => handleChange('commonMistakes', items)}
                placeholder="add common mistake..."
              />
            </div>

            <div>
              <label className="block text-[#737373] font-mono text-sm mb-2">
                key elements
              </label>
              <ArrayEditor
                items={(formData.keyElements as string[]) || []}
                onChange={(items) => handleChange('keyElements', items)}
                placeholder="add key element..."
              />
            </div>

            <div>
              <label className="block text-[#737373] font-mono text-sm mb-2">
                anti-patterns
              </label>
              <ArrayEditor
                items={(formData.antiPatterns as string[]) || []}
                onChange={(items) => handleChange('antiPatterns', items)}
                placeholder="add anti-pattern..."
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper component for editing string arrays
function ArrayEditor({
  items,
  onChange,
  placeholder,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
}) {
  const [newItem, setNewItem] = useState('');

  const handleAdd = () => {
    if (newItem.trim()) {
      onChange([...items, newItem.trim()]);
      setNewItem('');
    }
  };

  const handleRemove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-2 bg-[#1A1A1A] border border-[#333] rounded px-3 py-2"
        >
          <GripVertical className="h-4 w-4 text-[#525252] shrink-0" />
          <span className="flex-1 text-sm font-mono text-[#E5E5E5] truncate">{item}</span>
          <button
            onClick={() => handleRemove(index)}
            className="text-[#737373] hover:text-[#EF4444] transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <div className="flex gap-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-[#1A1A1A] border border-[#333] rounded px-3 py-2 text-sm font-mono text-[#E5E5E5] placeholder:text-[#525252] focus:border-[#D97706] outline-none"
        />
        <button
          onClick={handleAdd}
          className="px-3 py-2 bg-[#333] text-[#737373] hover:text-[#E5E5E5] rounded transition-colors"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
```

### 4.5 Users Page

Create `src/app/(admin)/admin/users/page.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { trpc } from '@/lib/trpc/client';
import { cn } from '@/lib/utils';
import { Search, ChevronLeft, ChevronRight, Edit, RotateCcw } from 'lucide-react';
import Link from 'next/link';

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [tier, setTier] = useState<'free' | 'trial' | 'pro' | undefined>();
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch } = trpc.admin.users.list.useQuery({
    search: search || undefined,
    subscriptionTier: tier,
    page,
    limit: 20,
  });

  const updateSubscription = trpc.admin.users.updateSubscription.useMutation({
    onSuccess: () => refetch(),
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-mono text-[#E5E5E5]">users</h1>
        <p className="text-sm text-[#737373] font-mono mt-1">
          manage user accounts and subscriptions
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#737373]" />
          <input
            type="text"
            placeholder="search by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#252525] border border-[#333] rounded px-10 py-2 text-sm font-mono text-[#E5E5E5] placeholder:text-[#737373] focus:border-[#D97706] outline-none"
          />
        </div>
        <div className="flex gap-2">
          {[undefined, 'free', 'trial', 'pro'].map((t) => (
            <button
              key={t ?? 'all'}
              onClick={() => setTier(t as typeof tier)}
              className={cn(
                'px-3 py-2 rounded font-mono text-xs transition-colors',
                tier === t
                  ? 'bg-[#D97706]/20 text-[#D97706]'
                  : 'text-[#737373] hover:text-[#E5E5E5] bg-[#252525]'
              )}
            >
              {t ?? 'all'}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#252525] border border-[#333] rounded-lg overflow-hidden">
        <table className="w-full text-sm font-mono">
          <thead>
            <tr className="border-b border-[#333] text-[#737373]">
              <th className="text-left px-4 py-3">email</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">level</th>
              <th className="text-left px-4 py-3 hidden sm:table-cell">xp</th>
              <th className="text-center px-4 py-3">subscription</th>
              <th className="text-right px-4 py-3">actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[#737373]">
                  loading...
                </td>
              </tr>
            ) : data?.users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[#737373]">
                  no users found
                </td>
              </tr>
            ) : (
              data?.users.map((user) => (
                <tr key={user.id} className="border-b border-[#333] last:border-0">
                  <td className="px-4 py-3 text-[#E5E5E5] truncate max-w-[200px]">
                    {user.email}
                  </td>
                  <td className="px-4 py-3 text-[#A3A3A3] hidden md:table-cell">
                    {user.level}
                  </td>
                  <td className="px-4 py-3 text-[#A3A3A3] hidden sm:table-cell">
                    {user.totalXp?.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded text-xs',
                        user.subscriptionTier === 'pro'
                          ? 'bg-[#D97706]/20 text-[#D97706]'
                          : user.subscriptionTier === 'trial'
                          ? 'bg-[#3B82F6]/20 text-[#3B82F6]'
                          : 'bg-[#333] text-[#737373]'
                      )}
                    >
                      {user.subscriptionTier}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <select
                        value={user.subscriptionTier || 'free'}
                        onChange={(e) =>
                          updateSubscription.mutate({
                            userId: user.id,
                            tier: e.target.value as 'free' | 'trial' | 'pro',
                          })
                        }
                        className="bg-[#1A1A1A] border border-[#333] rounded px-2 py-1 text-xs font-mono text-[#E5E5E5]"
                      >
                        <option value="free">free</option>
                        <option value="trial">trial</option>
                        <option value="pro">pro</option>
                      </select>
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="p-1.5 text-[#737373] hover:text-[#D97706] transition-colors"
                        title="View Details"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#333]">
            <span className="text-[#737373] text-sm">
              page {data.page} of {data.totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 text-[#737373] hover:text-[#E5E5E5] disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                disabled={page === data.totalPages}
                className="p-1.5 text-[#737373] hover:text-[#E5E5E5] disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## Part 5: Files Summary

### New Files to Create

```
src/app/(admin)/admin/layout.tsx
src/app/(admin)/admin/page.tsx
src/app/(admin)/admin/lessons/page.tsx
src/app/(admin)/admin/lessons/[id]/page.tsx
src/app/(admin)/admin/users/page.tsx
src/app/(admin)/admin/users/[id]/page.tsx       # (optional, for detailed view)
src/app/(admin)/admin/analytics/page.tsx        # (optional)

src/server/routers/admin/index.ts
src/server/routers/admin/lessons.ts
src/server/routers/admin/users.ts
src/server/routers/admin/analytics.ts
```

### Files to Modify

```
.env                          # Add ADMIN_EMAIL, ADMIN_PASSWORD
src/lib/db/schema.ts          # Add role field to profiles
src/lib/auth/index.ts         # Add admin login logic
src/types/next-auth.d.ts      # Add role to session types
src/server/trpc.ts            # Add adminProcedure
src/server/routers/_app.ts    # Register admin router
```

---

## Part 6: Implementation Order

1. Add `ADMIN_EMAIL` and `ADMIN_PASSWORD` to `.env`
2. Add `role` field to profiles schema
3. Run database migration
4. Update auth config for admin login
5. Update session types
6. Create `adminProcedure` in trpc.ts
7. Create admin routers (lessons, users, analytics)
8. Register admin router in _app.ts
9. Create admin layout
10. Create admin pages (dashboard, lessons, users)
11. Test admin login and functionality

---

## Part 7: Design Tokens Reference

All admin pages use the terminal-native design system:

```css
/* Backgrounds */
bg-[#1A1A1A]    /* Main background */
bg-[#252525]    /* Cards, surfaces */
bg-[#333]       /* Elevated, hover */

/* Text */
text-[#E5E5E5]  /* Primary */
text-[#A3A3A3]  /* Secondary */
text-[#737373]  /* Muted */

/* Accent (Anthropic Orange) */
text-[#D97706]  /* Primary accent */
text-[#F59E0B]  /* Hover accent */

/* Borders */
border-[#333]   /* Default border */

/* Stage Colors */
#3B82F6 (stage 1 - blue)
#8B5CF6 (stage 2 - purple)
#F59E0B (stage 3 - amber)
#10B981 (stage 4 - emerald)

/* Semantic */
#22C55E (success)
#EF4444 (error)
```

---

## Verification

1. **Login**: Navigate to `/login`, enter `admin` / `12345`, verify redirect to `/admin`
2. **Dashboard**: Stats cards should show real data
3. **Lessons**: List all 60 lessons, filter by stage, edit and save a lesson
4. **Users**: List users, change subscription tier, verify changes persist
5. **Build**: `npm run build` passes without errors
