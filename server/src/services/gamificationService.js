/**
 * Gamification Service
 * Handles XP, Level calculations, Streaks with Freeze Recovery, Achievements, and Daily Quests
 */

export const LEVEL_TIERS = [
  { level: 1, name: 'Novice Explorer', minXP: 0, maxXP: 299 },
  { level: 2, name: 'Apprentice Quester', minXP: 300, maxXP: 699 },
  { level: 3, name: 'Adept Architect', minXP: 700, maxXP: 1199 },
  { level: 4, name: 'Specialist Vanguard', minXP: 1200, maxXP: 1799 },
  { level: 5, name: 'Master Developer', minXP: 1800, maxXP: 2499 },
  { level: 6, name: 'Grandmaster Sage', minXP: 2500, maxXP: 999999 },
];

export function calculateLevel(xp) {
  for (let i = LEVEL_TIERS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_TIERS[i].minXP) {
      const tier = LEVEL_TIERS[i];
      const nextTier = LEVEL_TIERS[i + 1] || null;
      const progressInTier = nextTier 
        ? Math.min(100, Math.round(((xp - tier.minXP) / (nextTier.minXP - tier.minXP)) * 100))
        : 100;
      return {
        level: tier.level,
        title: tier.name,
        currentXP: xp,
        minXP: tier.minXP,
        nextLevelXP: nextTier ? nextTier.minXP : tier.maxXP,
        progressPercent: progressInTier,
      };
    }
  }
  return { level: 1, title: 'Novice Explorer', currentXP: xp, minXP: 0, nextLevelXP: 300, progressPercent: 0 };
}

export function updateStreak(progressRecord) {
  const today = new Date().toISOString().split('T')[0];
  const lastActive = progressRecord.lastActiveDate;

  if (lastActive === today) {
    return { streakDays: progressRecord.streakDays, streakFrozen: progressRecord.streakFrozen };
  }

  const todayDate = new Date(today);
  const lastDate = lastActive ? new Date(lastActive) : null;
  
  let newStreak = progressRecord.streakDays || 1;
  let freezeUsed = false;

  if (lastDate) {
    const diffTime = Math.abs(todayDate - lastDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      newStreak += 1;
    } else if (diffDays === 2 && progressRecord.streakFrozen) {
      // Streak saved by forgiving freeze mechanism!
      freezeUsed = true;
      progressRecord.streakFrozen = false;
      console.log('[Gamification] Streak preserved by streak freeze protection!');
    } else if (diffDays > 1) {
      newStreak = 1; // Reset if broke streak without active freeze
    }
  } else {
    newStreak = 1;
  }

  progressRecord.streakDays = newStreak;
  progressRecord.lastActiveDate = today;

  return { streakDays: newStreak, freezeUsed };
}

export const ALL_ACHIEVEMENTS = [
  { id: 'first_quest', title: 'First Quest Cleared', description: 'Complete your first learning node', icon: 'zap' },
  { id: 'quiz_master', title: 'Quiz Virtuoso', description: 'Pass an assessment with a perfect score', icon: 'award' },
  { id: 'streak_3', title: 'Momentum Builder', description: 'Maintain a 3-day learning streak', icon: 'flame' },
  { id: 'streak_7', title: 'Streak Titan', description: 'Maintain a 7-day learning streak', icon: 'shield' },
  { id: 'capstone_hero', title: 'Legendary Finisher', description: 'Submit and pass a Capstone Project', icon: 'crown' },
  { id: 'bookworm', title: 'Knowledge Collector', description: 'Bookmark 3 or more curated resources', icon: 'bookmark' },
];

export function checkNewAchievements(progressRecord, eventType, eventData = {}) {
  const existingIds = new Set((progressRecord.achievements || []).map(a => a.id));
  const newUnlocked = [];

  // 1. First quest
  if (!existingIds.has('first_quest') && progressRecord.completedNodeIds?.length >= 1) {
    const ach = ALL_ACHIEVEMENTS.find(a => a.id === 'first_quest');
    newUnlocked.push({ ...ach, unlockedAt: new Date() });
  }

  // 2. Quiz virtuoso (100% score)
  if (!existingIds.has('quiz_master') && eventType === 'assessment' && eventData.score === eventData.total) {
    const ach = ALL_ACHIEVEMENTS.find(a => a.id === 'quiz_master');
    newUnlocked.push({ ...ach, unlockedAt: new Date() });
  }

  // 3. Streak achievements
  if (!existingIds.has('streak_3') && progressRecord.streakDays >= 3) {
    const ach = ALL_ACHIEVEMENTS.find(a => a.id === 'streak_3');
    newUnlocked.push({ ...ach, unlockedAt: new Date() });
  }
  if (!existingIds.has('streak_7') && progressRecord.streakDays >= 7) {
    const ach = ALL_ACHIEVEMENTS.find(a => a.id === 'streak_7');
    newUnlocked.push({ ...ach, unlockedAt: new Date() });
  }

  // 4. Bookmarks
  if (!existingIds.has('bookworm') && progressRecord.bookmarkedResourceIds?.length >= 3) {
    const ach = ALL_ACHIEVEMENTS.find(a => a.id === 'bookworm');
    newUnlocked.push({ ...ach, unlockedAt: new Date() });
  }

  // 5. Capstone
  if (!existingIds.has('capstone_hero') && eventType === 'capstone_completed') {
    const ach = ALL_ACHIEVEMENTS.find(a => a.id === 'capstone_hero');
    newUnlocked.push({ ...ach, unlockedAt: new Date() });
  }

  return newUnlocked;
}

export function getDefaultDailyQuests() {
  return [
    { id: 'daily-1', title: 'Complete 1 Quest or Stage Node', xp: 75, completed: false },
    { id: 'daily-2', title: 'Pass an Assessment with 80%+ score', xp: 50, completed: false },
    { id: 'daily-3', title: 'Review 1 documentation or video resource', xp: 35, completed: false },
  ];
}
