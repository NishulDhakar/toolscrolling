const KEY = 'userStreak';

export interface StreakData {
  current: number;
  longest: number;
  lastVisit: string;
}

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

function yesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

export function getStreak(): StreakData {
  if (typeof window === 'undefined') return { current: 0, longest: 0, lastVisit: '' };
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : { current: 0, longest: 0, lastVisit: '' };
  } catch {
    return { current: 0, longest: 0, lastVisit: '' };
  }
}

export function recordVisit(): StreakData {
  if (typeof window === 'undefined') return { current: 0, longest: 0, lastVisit: '' };

  const streak = getStreak();
  const today = todayStr();

  if (streak.lastVisit === today) return streak;

  const newCurrent = streak.lastVisit === yesterdayStr() ? streak.current + 1 : 1;
  const newLongest = Math.max(streak.longest, newCurrent);
  const updated: StreakData = { current: newCurrent, longest: newLongest, lastVisit: today };
  localStorage.setItem(KEY, JSON.stringify(updated));
  return updated;
}
