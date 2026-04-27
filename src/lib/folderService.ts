const FOLDERS_KEY = 'toolFolders';
const ENTRIES_KEY = 'savedEntries';

export interface Folder {
  id: string;
  name: string;
  createdAt: number;
}

export interface SavedEntry {
  id: string;
  toolId: string;
  folderId?: string;
  savedAt: number;
}

function uid(): string {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
}

// ── Folders ──────────────────────────────────────────────────────────────────

export function getFolders(): Folder[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(FOLDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeFolders(folders: Folder[]): void {
  localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
}

export function createFolder(name: string): Folder {
  const folder: Folder = { id: uid(), name: name.trim(), createdAt: Date.now() };
  writeFolders([...getFolders(), folder]);
  return folder;
}

export function renameFolder(id: string, name: string): void {
  const folders = getFolders();
  const target = folders.find(f => f.id === id);
  if (target) {
    target.name = name.trim();
    writeFolders(folders);
  }
}

export function deleteFolder(id: string): void {
  writeFolders(getFolders().filter(f => f.id !== id));
  // Detach any entries that were in this folder
  writeEntries(getSavedEntries().map(e =>
    e.folderId === id ? { ...e, folderId: undefined } : e
  ));
}

// ── Saved Entries ─────────────────────────────────────────────────────────────

export function getSavedEntries(): SavedEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ENTRIES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeEntries(entries: SavedEntry[]): void {
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
}

export function getSavedToolIds(): string[] {
  return getSavedEntries().map(e => e.toolId);
}

export function isToolSaved(toolId: string): boolean {
  return getSavedEntries().some(e => e.toolId === toolId);
}

export function saveToolToFolder(toolId: string, folderId?: string): void {
  const entries = getSavedEntries();
  const existing = entries.find(e => e.toolId === toolId);
  if (existing) {
    existing.folderId = folderId;
    writeEntries(entries);
  } else {
    writeEntries([...entries, { id: uid(), toolId, folderId, savedAt: Date.now() }]);
  }
}

export function unsaveToolFromFolder(toolId: string): void {
  writeEntries(getSavedEntries().filter(e => e.toolId !== toolId));
}
