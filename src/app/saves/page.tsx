'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getAllTools } from '@/lib/toolsService';
import { getLikeCount, toggleLikeCount } from '@/lib/likeService';
import { getSaveCount } from '@/lib/saveCountService';
import {
  getFolders,
  getSavedEntries,
  getSavedToolIds,
  createFolder,
  renameFolder,
  deleteFolder,
  type Folder,
  type SavedEntry,
} from '@/lib/folderService';
import ToolsCard from '@/components/ToolsCard';
import SaveModal from '@/components/SaveModal';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import {
  ArrowLeft, Plus, MoreHorizontal, Pencil, Trash2,
  FolderOpen, Bookmark, Download, Link2, Check,
} from 'lucide-react';

export default function SavesPage() {
  const [tools, setTools] = useState<any[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [savedEntries, setSavedEntries] = useState<SavedEntry[]>([]);
  const [savedToolIds, setSavedToolIds] = useState<string[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<'all' | null | string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [likedTools, setLikedTools] = useState<string[]>([]);
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [saveCounts, setSaveCounts] = useState<Record<string, number>>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [saveModal, setSaveModal] = useState<{ toolId: string; toolName: string } | null>(null);
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [folderMenuId, setFolderMenuId] = useState<string | null>(null);
  const [newFolderMode, setNewFolderMode] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [shareCopied, setShareCopied] = useState(false);

  const refresh = useCallback(() => {
    const allTools = getAllTools();
    setTools(allTools);
    setFolders(getFolders());
    const entries = getSavedEntries();
    setSavedEntries(entries);
    setSavedToolIds(entries.map(e => e.toolId));
    const lc: Record<string, number> = {};
    const sc: Record<string, number> = {};
    allTools.forEach(t => { lc[t.id] = getLikeCount(t.id); sc[t.id] = getSaveCount(t.id); });
    setLikeCounts(lc);
    setSaveCounts(sc);
  }, []);

  useEffect(() => {
    refresh();
    const savedLikes = localStorage.getItem('likedTools');
    if (savedLikes) setLikedTools(JSON.parse(savedLikes));
    setIsLoaded(true);
  }, [refresh]);

  useEffect(() => {
    if (isLoaded) localStorage.setItem('likedTools', JSON.stringify(likedTools));
  }, [likedTools, isLoaded]);

  const toggleLike = (id: string) => {
    const isCurrentlyLiked = likedTools.includes(id);
    const newCount = toggleLikeCount(id, isCurrentlyLiked);
    setLikeCounts(prev => ({ ...prev, [id]: newCount }));
    setLikedTools(prev => isCurrentlyLiked ? prev.filter(t => t !== id) : [...prev, id]);
  };

  const handleSave = (id: string) => {
    const tool = tools.find(t => t.id === id);
    setSaveModal({ toolId: id, toolName: tool?.title ?? '' });
  };

  const handleModalClose = () => { refresh(); setSaveModal(null); };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    createFolder(newFolderName.trim());
    setNewFolderName(''); setNewFolderMode(false); refresh();
  };

  const handleRenameFolder = (id: string) => {
    if (editingName.trim()) renameFolder(id, editingName.trim());
    setEditingFolderId(null); setEditingName(''); refresh();
  };

  const handleDeleteFolder = (id: string) => {
    deleteFolder(id);
    if (selectedFolderId === id) setSelectedFolderId('all');
    refresh();
  };

  const handleExport = () => {
    const allTools = getAllTools();
    const toolMap = Object.fromEntries(allTools.map(t => [t.id, t]));
    const folderMap = Object.fromEntries(getFolders().map(f => [f.id, f]));
    const entries = getSavedEntries();

    const grouped: Record<string, string[]> = { Unsorted: [] };
    getFolders().forEach(f => { grouped[f.name] = []; });

    entries.forEach(e => {
      const t = toolMap[e.toolId];
      if (!t) return;
      const line = `- [${t.title}](${t.link})${t.pricing ? ` — ${t.pricing}` : ''}`;
      const folderName = e.folderId ? folderMap[e.folderId]?.name : null;
      if (folderName) grouped[folderName] = [...(grouped[folderName] ?? []), line];
      else grouped['Unsorted'].push(line);
    });

    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const lines = [`# My Saved Tools\n_Exported from ToolScrolling on ${date}_\n`];
    Object.entries(grouped).forEach(([name, items]) => {
      if (items.length === 0) return;
      lines.push(`\n## ${name}\n${items.join('\n')}`);
    });

    const blob = new Blob([lines.join('\n')], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'saved-tools.md';
    a.click(); URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    const payload = {
      folders: getFolders().map(f => ({ id: f.id, name: f.name })),
      entries: getSavedEntries().map(e => ({ toolId: e.toolId, folderId: e.folderId })),
    };
    const encoded = btoa(JSON.stringify(payload));
    const url = `${window.location.origin}/shared?data=${encoded}`;
    navigator.clipboard.writeText(url).then(() => {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    });
  };

  const unsortedCount = useMemo(() => savedEntries.filter(e => !e.folderId).length, [savedEntries]);

  const displayedToolIds = useMemo(() => {
    if (selectedFolderId === 'all') return savedEntries.map(e => e.toolId);
    if (selectedFolderId === null) return savedEntries.filter(e => !e.folderId).map(e => e.toolId);
    return savedEntries.filter(e => e.folderId === selectedFolderId).map(e => e.toolId);
  }, [selectedFolderId, savedEntries]);

  const displayedTools = useMemo(() =>
    tools
      .filter(t => displayedToolIds.includes(t.id))
      .filter(t => {
        if (!searchQuery) return true;
        return t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase());
      })
      .map(t => ({ ...t, isLiked: likedTools.includes(t.id), isSaved: true, totalLikes: likeCounts[t.id] ?? 0, saves: saveCounts[t.id] ?? 0 })),
    [tools, displayedToolIds, searchQuery, likedTools, likeCounts, saveCounts]
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} savedCount={savedToolIds.length} />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 max-w-400 mx-auto w-full">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/feed" className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Your Library</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {savedToolIds.length} saved tool{savedToolIds.length !== 1 ? 's' : ''}
            </p>
          </div>
          {savedToolIds.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
              >
                {shareCopied ? <Check size={14} className="text-emerald-500" /> : <Link2 size={14} />}
                {shareCopied ? 'Copied!' : 'Share'}
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
              >
                <Download size={14} /> Export .md
              </button>
            </div>
          )}
        </div>

        {/* Folder strip */}
        <div className="flex items-center gap-2 flex-wrap mb-7">
          <button
            onClick={() => setSelectedFolderId('all')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedFolderId === 'all' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
          >
            <Bookmark size={12} /> All
            <span className="text-xs opacity-60">({savedToolIds.length})</span>
          </button>

          {folders.map(folder => {
            const count = savedEntries.filter(e => e.folderId === folder.id).length;
            const isActive = selectedFolderId === folder.id;
            if (editingFolderId === folder.id) {
              return (
                <div key={folder.id} className="flex items-center gap-1.5">
                  <input autoFocus type="text" value={editingName} onChange={e => setEditingName(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleRenameFolder(folder.id); if (e.key === 'Escape') { setEditingFolderId(null); setEditingName(''); } }} onBlur={() => handleRenameFolder(folder.id)} className="px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-400 w-28" />
                </div>
              );
            }
            return (
              <div key={folder.id} className="relative group/tab">
                <button onClick={() => setSelectedFolderId(folder.id)} className={`flex items-center gap-1.5 pl-3 pr-6 py-1.5 rounded-full text-sm font-medium transition-colors ${isActive ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}>
                  <FolderOpen size={12} /> {folder.name}
                  <span className="text-xs opacity-60">({count})</span>
                </button>
                <button onClick={e => { e.stopPropagation(); setFolderMenuId(folderMenuId === folder.id ? null : folder.id); }} className="absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 opacity-0 group-hover/tab:opacity-100 transition-opacity">
                  <MoreHorizontal size={12} />
                </button>
                {folderMenuId === folder.id && (
                  <div className="absolute top-9 left-0 z-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg py-1 w-36">
                    <button onClick={() => { setEditingFolderId(folder.id); setEditingName(folder.name); setFolderMenuId(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"><Pencil size={13} /> Rename</button>
                    <button onClick={() => { handleDeleteFolder(folder.id); setFolderMenuId(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"><Trash2 size={13} /> Delete</button>
                  </div>
                )}
              </div>
            );
          })}

          {unsortedCount > 0 && (
            <button onClick={() => setSelectedFolderId(null)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedFolderId === null ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}>
              Unsorted <span className="text-xs opacity-60">({unsortedCount})</span>
            </button>
          )}

          {newFolderMode ? (
            <div className="flex items-center gap-1.5">
              <input autoFocus type="text" value={newFolderName} onChange={e => setNewFolderName(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleCreateFolder(); if (e.key === 'Escape') { setNewFolderMode(false); setNewFolderName(''); } }} onBlur={() => { if (!newFolderName.trim()) setNewFolderMode(false); }} placeholder="Folder name…" className="px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-400 w-32" />
              <button onClick={handleCreateFolder} disabled={!newFolderName.trim()} className="px-2.5 py-1 text-xs bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-medium disabled:opacity-40 hover:opacity-90 transition-opacity">Create</button>
            </div>
          ) : (
            <button onClick={() => setNewFolderMode(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-dashed border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 transition-colors">
              <Plus size={12} /> New folder
            </button>
          )}
        </div>

        {/* Grid */}
        {displayedTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
            {displayedTools.map(tool => (
              <ToolsCard key={tool.id} tool={tool} isLiked={tool.isLiked} isSaved={true} likesCount={tool.totalLikes} saveCount={tool.saves} onToggleLike={toggleLike} onToggleSave={handleSave} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
              <Bookmark className="w-7 h-7 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
              {savedToolIds.length === 0 ? 'No saved tools yet' : 'Nothing here'}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-xs text-sm mb-6">
              {savedToolIds.length === 0 ? 'Head to the feed and bookmark tools you love.' : 'Save tools to this folder from the feed.'}
            </p>
            <Link href="/feed" className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
              Explore Feed
            </Link>
          </div>
        )}
      </main>

      {saveModal && <SaveModal toolId={saveModal.toolId} toolName={saveModal.toolName} onClose={handleModalClose} />}
      {folderMenuId && <div className="fixed inset-0 z-10" onClick={() => setFolderMenuId(null)} />}
    </div>
  );
}
