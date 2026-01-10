// Achievement definitions and checking logic

export interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  category: 'milestone' | 'streak' | 'skill' | 'quality' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  criteria: AchievementCriteria;
}

export type AchievementCriteria =
  | { type: 'scenarios_completed'; count: number }
  | { type: 'streak_days'; count: number }
  | { type: 'skill_mastered'; skillId?: string }
  | { type: 'perfect_score'; count: number }
  | { type: 'stage_completed'; stage: number }
  | { type: 'first_attempt_passes'; count: number }
  | { type: 'total_xp'; amount: number }
  | { type: 'level_reached'; level: number }
  | { type: 'no_hints'; count: number }
  | { type: 'speed_demon'; seconds: number; count: number };

// All achievement definitions
export const ACHIEVEMENTS: AchievementDefinition[] = [
  // Milestone achievements
  {
    id: 'first_prompt',
    name: 'First Steps',
    description: 'Complete your first scenario',
    icon: '🚀',
    xpReward: 25,
    category: 'milestone',
    rarity: 'common',
    criteria: { type: 'scenarios_completed', count: 1 },
  },
  {
    id: 'getting_started',
    name: 'Getting Started',
    description: 'Complete 5 scenarios',
    icon: '📝',
    xpReward: 50,
    category: 'milestone',
    rarity: 'common',
    criteria: { type: 'scenarios_completed', count: 5 },
  },
  {
    id: 'dedicated_learner',
    name: 'Dedicated Learner',
    description: 'Complete 15 scenarios',
    icon: '📚',
    xpReward: 100,
    category: 'milestone',
    rarity: 'rare',
    criteria: { type: 'scenarios_completed', count: 15 },
  },
  {
    id: 'prompt_master',
    name: 'Prompt Master',
    description: 'Complete 50 scenarios',
    icon: '🏆',
    xpReward: 250,
    category: 'milestone',
    rarity: 'epic',
    criteria: { type: 'scenarios_completed', count: 50 },
  },
  {
    id: 'centurion',
    name: 'Centurion',
    description: 'Complete 100 scenarios',
    icon: '💯',
    xpReward: 500,
    category: 'milestone',
    rarity: 'legendary',
    criteria: { type: 'scenarios_completed', count: 100 },
  },

  // Streak achievements
  {
    id: 'streak_3',
    name: 'On a Roll',
    description: 'Maintain a 3-day streak',
    icon: '🔥',
    xpReward: 30,
    category: 'streak',
    rarity: 'common',
    criteria: { type: 'streak_days', count: 3 },
  },
  {
    id: 'streak_7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '⚡',
    xpReward: 75,
    category: 'streak',
    rarity: 'rare',
    criteria: { type: 'streak_days', count: 7 },
  },
  {
    id: 'streak_14',
    name: 'Fortnight Force',
    description: 'Maintain a 14-day streak',
    icon: '💪',
    xpReward: 150,
    category: 'streak',
    rarity: 'rare',
    criteria: { type: 'streak_days', count: 14 },
  },
  {
    id: 'streak_30',
    name: 'Monthly Master',
    description: 'Maintain a 30-day streak',
    icon: '🌟',
    xpReward: 300,
    category: 'streak',
    rarity: 'epic',
    criteria: { type: 'streak_days', count: 30 },
  },
  {
    id: 'streak_100',
    name: 'Unstoppable',
    description: 'Maintain a 100-day streak',
    icon: '👑',
    xpReward: 1000,
    category: 'streak',
    rarity: 'legendary',
    criteria: { type: 'streak_days', count: 100 },
  },

  // Quality achievements
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Score 90+ on a scenario',
    icon: '✨',
    xpReward: 25,
    category: 'quality',
    rarity: 'common',
    criteria: { type: 'perfect_score', count: 1 },
  },
  {
    id: 'consistent_quality',
    name: 'Consistent Quality',
    description: 'Score 90+ on 10 scenarios',
    icon: '💎',
    xpReward: 150,
    category: 'quality',
    rarity: 'rare',
    criteria: { type: 'perfect_score', count: 10 },
  },
  {
    id: 'excellence',
    name: 'Excellence',
    description: 'Score 90+ on 25 scenarios',
    icon: '🌠',
    xpReward: 400,
    category: 'quality',
    rarity: 'epic',
    criteria: { type: 'perfect_score', count: 25 },
  },
  {
    id: 'natural_talent',
    name: 'Natural Talent',
    description: 'Pass 5 scenarios on first attempt',
    icon: '🎯',
    xpReward: 75,
    category: 'quality',
    rarity: 'rare',
    criteria: { type: 'first_attempt_passes', count: 5 },
  },
  {
    id: 'prodigy',
    name: 'Prodigy',
    description: 'Pass 20 scenarios on first attempt',
    icon: '🧠',
    xpReward: 250,
    category: 'quality',
    rarity: 'epic',
    criteria: { type: 'first_attempt_passes', count: 20 },
  },

  // Skill achievements
  {
    id: 'skill_master_clarity',
    name: 'Clarity Expert',
    description: 'Master the Clarity skill',
    icon: '🔍',
    xpReward: 100,
    category: 'skill',
    rarity: 'rare',
    criteria: { type: 'skill_mastered', skillId: 'clarity' },
  },
  {
    id: 'skill_master_context',
    name: 'Context Master',
    description: 'Master the Context skill',
    icon: '🎭',
    xpReward: 100,
    category: 'skill',
    rarity: 'rare',
    criteria: { type: 'skill_mastered', skillId: 'context' },
  },
  {
    id: 'skill_master_constraints',
    name: 'Constraint Champion',
    description: 'Master the Constraints skill',
    icon: '📏',
    xpReward: 100,
    category: 'skill',
    rarity: 'rare',
    criteria: { type: 'skill_mastered', skillId: 'constraints' },
  },
  {
    id: 'skill_master_reasoning',
    name: 'Logic Lord',
    description: 'Master the Reasoning skill',
    icon: '🧩',
    xpReward: 100,
    category: 'skill',
    rarity: 'rare',
    criteria: { type: 'skill_mastered', skillId: 'reasoning' },
  },
  {
    id: 'skill_master_output',
    name: 'Output Architect',
    description: 'Master the Output Shaping skill',
    icon: '🏗️',
    xpReward: 100,
    category: 'skill',
    rarity: 'rare',
    criteria: { type: 'skill_mastered', skillId: 'output-shaping' },
  },

  // Stage achievements
  {
    id: 'stage_1_complete',
    name: 'Prompt Engineer',
    description: 'Complete Stage 1: Prompting',
    icon: '🎓',
    xpReward: 500,
    category: 'milestone',
    rarity: 'epic',
    criteria: { type: 'stage_completed', stage: 1 },
  },
  {
    id: 'stage_2_complete',
    name: 'Systems Designer',
    description: 'Complete Stage 2: Structuring',
    icon: '🏛️',
    xpReward: 750,
    category: 'milestone',
    rarity: 'epic',
    criteria: { type: 'stage_completed', stage: 2 },
  },
  {
    id: 'stage_3_complete',
    name: 'Automation Specialist',
    description: 'Complete Stage 3: Automation',
    icon: '⚙️',
    xpReward: 1000,
    category: 'milestone',
    rarity: 'legendary',
    criteria: { type: 'stage_completed', stage: 3 },
  },
  {
    id: 'stage_4_complete',
    name: 'Product Builder',
    description: 'Complete Stage 4: Vibe Coding',
    icon: '🚀',
    xpReward: 1500,
    category: 'milestone',
    rarity: 'legendary',
    criteria: { type: 'stage_completed', stage: 4 },
  },

  // Level achievements
  {
    id: 'level_5',
    name: 'Rising Star',
    description: 'Reach level 5',
    icon: '⭐',
    xpReward: 50,
    category: 'milestone',
    rarity: 'common',
    criteria: { type: 'level_reached', level: 5 },
  },
  {
    id: 'level_10',
    name: 'Seasoned Practitioner',
    description: 'Reach level 10',
    icon: '🌙',
    xpReward: 100,
    category: 'milestone',
    rarity: 'rare',
    criteria: { type: 'level_reached', level: 10 },
  },
  {
    id: 'level_20',
    name: 'Expert',
    description: 'Reach level 20',
    icon: '☀️',
    xpReward: 250,
    category: 'milestone',
    rarity: 'epic',
    criteria: { type: 'level_reached', level: 20 },
  },
  {
    id: 'level_30',
    name: 'Grandmaster',
    description: 'Reach level 30',
    icon: '🏅',
    xpReward: 500,
    category: 'milestone',
    rarity: 'legendary',
    criteria: { type: 'level_reached', level: 30 },
  },

  // Special achievements
  {
    id: 'no_hints_5',
    name: 'Self Reliant',
    description: 'Complete 5 scenarios without using hints',
    icon: '🦅',
    xpReward: 75,
    category: 'special',
    rarity: 'rare',
    criteria: { type: 'no_hints', count: 5 },
  },
  {
    id: 'no_hints_20',
    name: 'Independent Thinker',
    description: 'Complete 20 scenarios without using hints',
    icon: '🦁',
    xpReward: 200,
    category: 'special',
    rarity: 'epic',
    criteria: { type: 'no_hints', count: 20 },
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Complete 5 scenarios in under 2 minutes each',
    icon: '⚡',
    xpReward: 100,
    category: 'special',
    rarity: 'rare',
    criteria: { type: 'speed_demon', seconds: 120, count: 5 },
  },
];

// Get achievement by ID
export function getAchievement(id: string): AchievementDefinition | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}

// Get all achievements by category
export function getAchievementsByCategory(category: AchievementDefinition['category']): AchievementDefinition[] {
  return ACHIEVEMENTS.filter((a) => a.category === category);
}

// User stats needed for achievement checking
export interface UserAchievementStats {
  totalScenariosCompleted: number;
  currentStreak: number;
  longestStreak: number;
  perfectScores: number; // 90+
  firstAttemptPasses: number;
  noHintCompletions: number;
  speedCompletions: number; // Under 2 min
  level: number;
  totalXp: number;
  masteredSkills: string[];
  completedStages: number[];
  unlockedAchievements: string[];
}

// Check which achievements should be unlocked
export function checkNewAchievements(stats: UserAchievementStats): AchievementDefinition[] {
  const newAchievements: AchievementDefinition[] = [];

  for (const achievement of ACHIEVEMENTS) {
    // Skip already unlocked
    if (stats.unlockedAchievements.includes(achievement.id)) {
      continue;
    }

    if (isAchievementEarned(achievement, stats)) {
      newAchievements.push(achievement);
    }
  }

  return newAchievements;
}

// Check if a specific achievement is earned
function isAchievementEarned(achievement: AchievementDefinition, stats: UserAchievementStats): boolean {
  const { criteria } = achievement;

  switch (criteria.type) {
    case 'scenarios_completed':
      return stats.totalScenariosCompleted >= criteria.count;

    case 'streak_days':
      return stats.currentStreak >= criteria.count || stats.longestStreak >= criteria.count;

    case 'perfect_score':
      return stats.perfectScores >= criteria.count;

    case 'first_attempt_passes':
      return stats.firstAttemptPasses >= criteria.count;

    case 'skill_mastered':
      if (criteria.skillId) {
        return stats.masteredSkills.includes(criteria.skillId);
      }
      return stats.masteredSkills.length > 0;

    case 'stage_completed':
      return stats.completedStages.includes(criteria.stage);

    case 'level_reached':
      return stats.level >= criteria.level;

    case 'total_xp':
      return stats.totalXp >= criteria.amount;

    case 'no_hints':
      return stats.noHintCompletions >= criteria.count;

    case 'speed_demon':
      return stats.speedCompletions >= criteria.count;

    default:
      return false;
  }
}

// Get rarity color
export function getRarityColor(rarity: AchievementDefinition['rarity']): string {
  switch (rarity) {
    case 'common':
      return '#9CA3AF'; // gray
    case 'rare':
      return '#3B82F6'; // blue
    case 'epic':
      return '#8B5CF6'; // purple
    case 'legendary':
      return '#F59E0B'; // amber/gold
  }
}

// Get category label
export function getCategoryLabel(category: AchievementDefinition['category']): string {
  switch (category) {
    case 'milestone':
      return 'Milestones';
    case 'streak':
      return 'Streaks';
    case 'skill':
      return 'Skill Mastery';
    case 'quality':
      return 'Quality';
    case 'special':
      return 'Special';
  }
}
