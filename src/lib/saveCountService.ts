const KEY = 'toolSaveCounts';

type Counts = Record<string, number>;

function read(): Counts {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function write(counts: Counts): void {
  localStorage.setItem(KEY, JSON.stringify(counts));
}

export function getSaveCount(toolId: string): number {
  return read()[toolId] ?? 0;
}

export function incrementSaveCount(toolId: string): void {
  const counts = read();
  counts[toolId] = (counts[toolId] ?? 0) + 1;
  write(counts);
}

export function decrementSaveCount(toolId: string): void {
  const counts = read();
  counts[toolId] = Math.max((counts[toolId] ?? 0) - 1, 0);
  write(counts);
}
