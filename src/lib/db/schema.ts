import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  date,
  decimal,
  jsonb,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

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
  subscriptionTier: text('subscription_tier').default('free'), // 'free' | 'trial' | 'pro'
  subscriptionStatus: text('subscription_status').default('active'), // 'active' | 'trial' | 'expired' | 'cancelled'
  subscriptionPlan: text('subscription_plan'), // 'monthly' | 'annual' | null
  subscriptionStartDate: timestamp('subscription_start_date'),
  subscriptionEndDate: timestamp('subscription_end_date'),
  trialStartDate: timestamp('trial_start_date'),
  trialEndDate: timestamp('trial_end_date'),
  rectoken: text('rectoken'), // Flitt rectoken for recurring charges
  rectokenLifetime: text('rectoken_lifetime'),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// User skills progress
export const userSkills = pgTable(
  'user_skills',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }),
    skillId: text('skill_id').notNull(),

    scenariosCompleted: integer('scenarios_completed').default(0),
    scenariosAvailable: integer('scenarios_available').notNull().default(0),
    bestScore: integer('best_score').default(0),
    averageScore: decimal('average_score', { precision: 5, scale: 2 }),
    totalAttempts: integer('total_attempts').default(0),

    masteryLevel: integer('mastery_level').default(0),
    isUnlocked: boolean('is_unlocked').default(false),
    unlockedAt: timestamp('unlocked_at'),
    completedAt: timestamp('completed_at'),

    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => [uniqueIndex('user_skill_idx').on(table.userId, table.skillId)]
);

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
export const achievements = pgTable(
  'achievements',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }),

    achievementType: text('achievement_type').notNull(),
    achievementData: jsonb('achievement_data'),

    unlockedAt: timestamp('unlocked_at').defaultNow(),
  },
  (table) => [uniqueIndex('user_achievement_idx').on(table.userId, table.achievementType)]
);

// Daily activity for streaks
export const dailyActivity = pgTable(
  'daily_activity',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }),
    activityDate: date('activity_date').notNull(),

    scenariosCompleted: integer('scenarios_completed').default(0),
    xpEarned: integer('xp_earned').default(0),
    timeSpentSeconds: integer('time_spent_seconds').default(0),
  },
  (table) => [uniqueIndex('user_date_idx').on(table.userId, table.activityDate)]
);

// Certifications
export const certifications = pgTable(
  'certifications',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }),

    certificationType: text('certification_type').notNull(),
    score: integer('score').notNull(),

    issuedAt: timestamp('issued_at').defaultNow(),
    verificationCode: text('verification_code').unique(),
  },
  (table) => [uniqueIndex('user_cert_idx').on(table.userId, table.certificationType)]
);

// Payment orders
export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: text('order_id').notNull().unique(), // 'order-{uuid}'
  userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }),

  orderType: text('order_type').notNull(), // 'trial' | 'subscription' | 'renewal'
  packageType: text('package_type').notNull(), // 'monthly' | 'annual'
  amount: integer('amount').notNull(), // in tetri (GEL cents) - 0 for trial
  currency: text('currency').default('GEL'),

  status: text('status').default('pending'), // 'pending' | 'completed' | 'failed'
  flittPaymentId: text('flitt_payment_id'),
  transactionId: text('transaction_id'),
  isRecurring: boolean('is_recurring').default(false),
  retryCount: integer('retry_count').default(0),
  failureReason: text('failure_reason'),

  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Type exports
export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
export type Attempt = typeof attempts.$inferSelect;
export type NewAttempt = typeof attempts.$inferInsert;
export type UserSkill = typeof userSkills.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
export type Certification = typeof certifications.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
