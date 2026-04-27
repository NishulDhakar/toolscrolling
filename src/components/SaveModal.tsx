'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, FolderPlus, Folder, Check, Bookmark, Trash2 } from 'lucide-react';
import {
  getFolders,
  createFolder,
  getSavedEntries,
  isToolSaved,
  saveToolToFolder,
  unsaveToolFromFolder,
  type Folder as FolderType,
} from '@/lib/folderService';

interface SaveModalProps {
  toolId: string;
  toolName: string;
  onClose: () => void;
}

export default function SaveModal({ toolId, toolName, onClose }: SaveModalProps) {
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null | undefined>(undefined);
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolder, setShowNewFolder] = useState(false);
  const saved = isToolSaved(toolId);

  const inputRef = useRef<HTMLInputElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFolders(getFolders());
    const entry = getSavedEntries().find(e => e.toolId === toolId);
    setCurrentFolderId(entry ? (entry.folderId ?? null) : undefined);
  }, [toolId]);

  useEffect(() => {
    if (showNewFolder) inputRef.current?.focus();
  }, [showNewFolder]);

  const handleSaveTo = (folderId?: string) => {
    saveToolToFolder(toolId, folderId);
    onClose();
  };

  const handleUnsave = () => {
    unsaveToolFromFolder(toolId);
    onClose();
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    const folder = createFolder(newFolderName.trim());
    setFolders(prev => [...prev, folder]);
    setNewFolderName('');
    setShowNewFolder(false);
    saveToolToFolder(toolId, folder.id);
    onClose();
  };

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={e => { if (e.target === backdropRef.current) onClose(); }}
    >
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 min-w-0">
            <Bookmark className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
            <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
              {saved ? 'Move' : 'Save'} to folder
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors shrink-0 ml-3"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tool name hint */}
        <div className="px-5 pt-3 pb-1">
          <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
            &ldquo;{toolName}&rdquo;
          </p>
        </div>

        {/* Options list */}
        <div className="px-3 pb-3 space-y-0.5 max-h-64 overflow-y-auto">
          {/* Save without folder */}
          <button
            onClick={() => handleSaveTo(undefined)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-colors
              ${currentFolderId === null
                ? 'bg-slate-100 dark:bg-slate-800 font-medium text-slate-900 dark:text-white'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
          >
            <Bookmark size={15} className="text-slate-400 shrink-0" />
            <span className="flex-1">No folder (save as-is)</span>
            {currentFolderId === null && <Check size={13} className="text-slate-600 dark:text-slate-300 shrink-0" />}
          </button>

          {/* Existing folders */}
          {folders.length > 0 && (
            <>
              <p className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Your folders
              </p>
              {folders.map(folder => (
                <button
                  key={folder.id}
                  onClick={() => handleSaveTo(folder.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-colors
                    ${currentFolderId === folder.id
                      ? 'bg-slate-100 dark:bg-slate-800 font-medium text-slate-900 dark:text-white'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                >
                  <Folder size={15} className="text-slate-400 shrink-0" />
                  <span className="flex-1 truncate">{folder.name}</span>
                  {currentFolderId === folder.id && <Check size={13} className="text-slate-600 dark:text-slate-300 shrink-0" />}
                </button>
              ))}
            </>
          )}

          {/* New folder */}
          {showNewFolder ? (
            <div className="pt-1 px-1 pb-1">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={newFolderName}
                  onChange={e => setNewFolderName(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleCreateFolder();
                    if (e.key === 'Escape') { setShowNewFolder(false); setNewFolderName(''); }
                  }}
                  placeholder="Folder name…"
                  className="flex-1 px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 dark:focus:ring-slate-600"
                />
                <button
                  onClick={handleCreateFolder}
                  disabled={!newFolderName.trim()}
                  className="px-3 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40"
                >
                  Create
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowNewFolder(true)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <FolderPlus size={15} className="shrink-0" />
              <span>New folder</span>
            </button>
          )}
        </div>

        {/* Unsave footer */}
        {saved && (
          <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={handleUnsave}
              className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors"
            >
              <Trash2 size={14} />
              Remove from saved
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
