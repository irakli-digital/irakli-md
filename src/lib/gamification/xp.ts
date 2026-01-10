import skillTreeData from '@/../content/skills/skill-tree.json';

const { xpRewards, levelThresholds } = skillTreeData;

export type XPEventType = keyof typeof xpRewards;

export function getXPForEvent(event: XPEventType): number {
  return xpRewards[event];
}

export function calculateLevel(totalXP: number): number {
  let level = 1;
  for (let i = 0; i < levelThresholds.length; i++) {
    if (totalXP >= levelThresholds[i]) {
      level = i + 1;
    } else {
      break;
    }
  }
  return level;
}

export function getXPForCurrentLevel(totalXP: number): { current: number; required: number; progress: number } {
  const level = calculateLevel(totalXP);
  const currentThreshold = levelThresholds[level - 1] || 0;
  const nextThreshold = levelThresholds[level] || levelThresholds[levelThresholds.length - 1];

  const current = totalXP - currentThreshold;
  const required = nextThreshold - currentThreshold;
  const progress = Math.min((current / required) * 100, 100);

  return { current, required, progress };
}

export function getLevelTitle(level: number): string {
  if (level <= 5) return 'Novice';
  if (level <= 10) return 'Apprentice';
  if (level <= 15) return 'Practitioner';
  if (level <= 20) return 'Expert';
  if (level <= 25) return 'Master';
  return 'Grandmaster';
}

export function calculateXPGain(params: {
  passed: boolean;
  score: number;
  attemptNumber: number;
  hintsUsed: number;
}): { total: number; breakdown: { reason: string; xp: number }[] } {
  const breakdown: { reason: string; xp: number }[] = [];

  if (params.passed) {
    // Base XP for completing
    breakdown.push({ reason: 'Scenario completed', xp: xpRewards.scenarioComplete });

    // Bonus for perfect score
    if (params.score >= 90) {
      breakdown.push({ reason: 'Excellent score bonus', xp: xpRewards.perfectScore });
    }

    // Bonus for first attempt pass
    if (params.attemptNumber === 1) {
      breakdown.push({ reason: 'First attempt bonus', xp: xpRewards.firstAttemptPass });
    }

    // Penalty for hints (reduce bonus, not base XP)
    if (params.hintsUsed > 0 && breakdown.length > 1) {
      const hintPenalty = Math.min(params.hintsUsed * 10, 50);
      breakdown.push({ reason: `Hints used (${params.hintsUsed})`, xp: -hintPenalty });
    }
  } else {
    // Small XP for attempting
    breakdown.push({ reason: 'Attempt XP', xp: 10 });
  }

  const total = Math.max(breakdown.reduce((sum, item) => sum + item.xp, 0), 0);
  return { total, breakdown };
}

export function checkLevelUp(previousXP: number, newXP: number): { leveledUp: boolean; newLevel: number; previousLevel: number } {
  const previousLevel = calculateLevel(previousXP);
  const newLevel = calculateLevel(newXP);

  return {
    leveledUp: newLevel > previousLevel,
    newLevel,
    previousLevel,
  };
}
