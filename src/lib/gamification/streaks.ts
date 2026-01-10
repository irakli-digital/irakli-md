export function calculateStreak(activityDates: (Date | string)[]): {
  currentStreak: number;
  longestStreak: number;
  isActiveToday: boolean;
} {
  if (activityDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0, isActiveToday: false };
  }

  // Sort dates descending (most recent first)
  const sortedDates = [...activityDates]
    .map(d => typeof d === 'string' ? new Date(d) : new Date(d))
    .sort((a, b) => b.getTime() - a.getTime());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Check if active today
  const mostRecentDate = new Date(sortedDates[0]);
  mostRecentDate.setHours(0, 0, 0, 0);
  const isActiveToday = mostRecentDate.getTime() === today.getTime();

  // Calculate current streak
  let currentStreak = 0;
  let checkDate = isActiveToday ? today : yesterday;

  for (const date of sortedDates) {
    const activityDate = new Date(date);
    activityDate.setHours(0, 0, 0, 0);

    if (activityDate.getTime() === checkDate.getTime()) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (activityDate.getTime() < checkDate.getTime()) {
      break;
    }
  }

  // If not active today and not yesterday, streak is broken
  if (!isActiveToday) {
    const wasActiveYesterday = sortedDates.some(date => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === yesterday.getTime();
    });
    if (!wasActiveYesterday) {
      currentStreak = 0;
    }
  }

  // Calculate longest streak
  let longestStreak = 0;
  let tempStreak = 1;

  // Sort ascending for longest streak calculation
  const ascDates = [...sortedDates].reverse();

  for (let i = 1; i < ascDates.length; i++) {
    const prevDate = new Date(ascDates[i - 1]);
    const currDate = new Date(ascDates[i]);
    prevDate.setHours(0, 0, 0, 0);
    currDate.setHours(0, 0, 0, 0);

    const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      tempStreak++;
    } else if (diffDays > 1) {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

  return { currentStreak, longestStreak, isActiveToday };
}

export function getStreakMessage(streak: number): string {
  if (streak === 0) return "Start your streak today!";
  if (streak === 1) return "Great start! Keep it going!";
  if (streak < 7) return `${streak} day streak! Building momentum!`;
  if (streak < 14) return `${streak} days! You're on fire!`;
  if (streak < 30) return `${streak} days! Incredible dedication!`;
  if (streak < 100) return `${streak} days! You're unstoppable!`;
  return `${streak} days! Legendary commitment!`;
}

export function getStreakEmoji(streak: number, isActiveToday: boolean): string {
  if (!isActiveToday && streak > 0) return "⚠️"; // At risk
  if (streak === 0) return "💤";
  if (streak < 7) return "🔥";
  if (streak < 30) return "🔥🔥";
  if (streak < 100) return "🔥🔥🔥";
  return "👑";
}
