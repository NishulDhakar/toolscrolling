'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getAllTools } from '@/lib/toolsService';
import { getLikeCount, toggleLikeCount } from '@/lib/likeService';
import { getSaveCount } from '@/lib/saveCountService';
import { saveToolToFolder, isToolSaved, unsaveToolFromFolder } from '@/lib/folderService';
import ToolsCard from '@/components/ToolsCard';
import SaveModal from '@/components/SaveModal';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { ArrowLeft, Bookmark, FolderOpen, AlertCircle } from 'lucide-react';

interface SharedFolder {
  id: string;
  name: string;
}

interface SharedEntry {
  toolId: string;
  folderId?: string;
}

interface SharedCollection {
  folders: SharedFolder[];
  entries: SharedEntry[];
}

function SharedContent() {
  const searchParams = useSearchParams();
  const [collection, setCollection] = useState<SharedCollection | null>(null);
  const [error, setError] = useState(false);
  const [tools, setTools] = useState<any[]>([]);
  const [likedTools, setLikedTools] = useState<string[]>([]);
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [saveCounts, setSaveCounts] = useState<Record<string, number>>({});
  const [savedToolIds, setSavedToolIds] = useState<string[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<'all' | string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [saveModal, setSaveModal] = useState<{ toolId: string; toolName: string } | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const data = searchParams.get('data');
    if (!data) { setError(true); return; }
    try {
      const decoded = JSON.parse(atob(data));
      if (!decoded.entries || !Array.isArray(decoded.entries)) throw new Error();
      setCollection({ folders: decoded.folders ?? [], entries: decoded.entries });
    } catch {
      setError(true);
    }
  }, [searchParams]);

  useEffect(() => {
    const allTools = getAllTools();
    setTools(allTools);
    const lc: Record<string, number> = {};
    const sc: Record<string, number> = {};
    allTools.forEach(t => { lc[t.id] = getLikeCount(t.id); sc[t.id] = getSaveCount(t.id); });
    setLikeCounts(lc);
    setSaveCounts(sc);

    const savedLikes = localStorage.getItem('likedTools');
    if (savedLikes) setLikedTools(JSON.parse(savedLikes));

    const currentSaved = allTools.filter(t => isToolSaved(t.id)).map(t => t.id);
    setSavedToolIds(currentSaved);
    setIsLoaded(true);
  }, []);

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
    if (savedToolIds.includes(id)) {
      unsaveToolFromFolder(id);
      setSavedToolIds(prev => prev.filter(t => t !== id));
    } else {
      const tool = tools.find(t => t.id === id);
      setSaveModal({ toolId: id, toolName: tool?.title ?? '' });
    }
  };

  const handleModalClose = () => {
    const allTools = getAllTools();
    setSavedToolIds(allTools.filter(t => isToolSaved(t.id)).map(t => t.id));
    setSaveModal(null);
  };

  const displayedToolIds = useMemo(() => {
    if (!collection) return [];
    if (selectedFolderId === 'all') return collection.entries.map(e => e.toolId);
    return collection.entries.filter(e => e.folderId === selectedFolderId).map(e => e.toolId);
  }, [collection, selectedFolderId]);

  const displayedTools = useMemo(() =>
    tools
      .filter(t => displayedToolIds.includes(t.id))
      .filter(t => {
        if (!searchQuery) return true;
        return t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase());
      })
      .map(t => ({
        ...t,
        isLiked: likedTools.includes(t.id),
        isSaved: savedToolIds.includes(t.id),
        totalLikes: likeCounts[t.id] ?? 0,
        saves: saveCounts[t.id] ?? 0,
      })),
    [tools, displayedToolIds, searchQuery, likedTools, savedToolIds, likeCounts, saveCounts]
  );

  const totalCount = collection?.entries.length ?? 0;

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
        <Navbar searchQuery="" onSearchChange={() => {}} savedCount={savedToolIds.length} />
        <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
          <div className="w-16 h-16 bg-rose-100 dark:bg-rose-500/10 rounded-2xl flex items-center justify-center mb-4">
            <AlertCircle className="w-7 h-7 text-rose-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Invalid share link</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">This link is broken or has expired.</p>
          <Link href="/feed" className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
            Explore Feed
          </Link>
        </main>
      </div>
    );
  }

  if (!collection) return null;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} savedCount={savedToolIds.length} />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 max-w-400 mx-auto w-full">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <Link href="/feed" className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Shared Collection</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {totalCount} saved tool{totalCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-400 dark:text-slate-500 mb-7 ml-11">
          Viewing someone else&apos;s saves — click the bookmark to add any tool to your own library.
        </p>

        {/* Folder strip */}
        {collection.folders.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mb-7">
            <button
              onClick={() => setSelectedFolderId('all')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedFolderId === 'all' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
            >
              <Bookmark size={12} /> All
              <span className="text-xs opacity-60">({totalCount})</span>
            </button>

            {collection.folders.map(folder => {
              const count = collection.entries.filter(e => e.folderId === folder.id).length;
              if (count === 0) return null;
              return (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolderId(folder.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedFolderId === folder.id ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
                >
                  <FolderOpen size={12} /> {folder.name}
                  <span className="text-xs opacity-60">({count})</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Grid */}
        {displayedTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
            {displayedTools.map(tool => (
              <ToolsCard
                key={tool.id}
                tool={tool}
                isLiked={tool.isLiked}
                isSaved={tool.isSaved}
                likesCount={tool.totalLikes}
                saveCount={tool.saves}
                onToggleLike={toggleLike}
                onToggleSave={handleSave}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
              <Bookmark className="w-7 h-7 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Nothing here</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-xs text-sm">
              No tools in this folder.
            </p>
          </div>
        )}
      </main>

      {saveModal && <SaveModal toolId={saveModal.toolId} toolName={saveModal.toolName} onClose={handleModalClose} />}
    </div>
  );
}

export default function SharedPage() {
  return (
    <Suspense>
      <SharedContent />
    </Suspense>
  );
}
