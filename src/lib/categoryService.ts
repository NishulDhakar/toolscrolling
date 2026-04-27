const KEY = 'customCategories';

export const DEFAULT_CATEGORIES = ['Development', 'Design', 'Productivity', 'AI', 'Other'];

function getCustomOnly(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getCategories(): string[] {
  const custom = getCustomOnly();
  return [...DEFAULT_CATEGORIES, ...custom.filter(c => !DEFAULT_CATEGORIES.includes(c))];
}

export function addCategory(name: string): boolean {
  const trimmed = name.trim();
  if (!trimmed) return false;
  const current = getCategories();
  if (current.some(c => c.toLowerCase() === trimmed.toLowerCase())) return false;
  localStorage.setItem(KEY, JSON.stringify([...getCustomOnly(), trimmed]));
  return true;
}

export function deleteCategory(name: string): boolean {
  if (DEFAULT_CATEGORIES.includes(name)) return false;
  localStorage.setItem(KEY, JSON.stringify(getCustomOnly().filter(c => c !== name)));
  return true;
}
