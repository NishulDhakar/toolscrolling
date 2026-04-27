'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Shuffle, ExternalLink, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getAllTools, type CustomTool } from '@/lib/toolsService';
import { getLikeCount, toggleLikeCount } from '@/lib/likeService';
import { getSavedToolIds } from '@/lib/folderService';
import { getSaveCount } from '@/lib/saveCountService';
import { recordVisit } from '@/lib/streakService';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import ToolsCard from '@/components/ToolsCard';
import SaveModal from '@/components/SaveModal';

// Deterministic "tool of the day" — changes daily, same for everyone in a session
function getToolOfDay(tools: CustomTool[]): CustomTool | null {
  if (!tools.length) return null;
  const dayIndex = Math.floor(Date.now() / 86_400_000);
  return tools[dayIndex % tools.length];
}

const PRICING_STYLES: Record<string, string> = {
  Free: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
  Freemium: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
  Paid: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
};

export default function FeedPage() {
  const router = useRouter();
  const [tools, setTools] = useState<CustomTool[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [likedTools, setLikedTools] = useState<string[]>([]);
  const [savedToolIds, setSavedToolIds] = useState<string[]>([]);
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [saveCounts, setSaveCounts] = useState<Record<string, number>>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [saveModal, setSaveModal] = useState<{ toolId: string; toolName: string } | null>(null);
  const [todayDismissed, setTodayDismissed] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const allTools = getAllTools();
    setTools(allTools);

    const savedLikes = localStorage.getItem('likedTools');
    if (savedLikes) setLikedTools(JSON.parse(savedLikes));

    setSavedToolIds(getSavedToolIds());

    const lc: Record<string, number> = {};
    const sc: Record<string, number> = {};
    allTools.forEach(t => {
      lc[t.id] = getLikeCount(t.id);
      sc[t.id] = getSaveCount(t.id);
    });
    setLikeCounts(lc);
    setSaveCounts(sc);

    // Streak
    const s = recordVisit();
    setStreak(s.current);

    // Tool-of-day dismiss state
    const todayKey = new Date().toISOString().split('T')[0];
    const dismissed = localStorage.getItem('todDismissed');
    if (dismissed === todayKey) setTodayDismissed(true);

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
    const tool = tools.find(t => t.id === id);
    setSaveModal({ toolId: id, toolName: tool?.title ?? '' });
  };

  const handleModalClose = () => {
    setSavedToolIds(getSavedToolIds());
    setSaveModal(null);
  };

  const handleRandomTool = () => {
    const unsaved = tools.filter(t => !savedToolIds.includes(t.id));
    const pool = unsaved.length > 0 ? unsaved : tools;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    if (pick) router.push(`/tool/${pick.id}`);
  };

  const dismissToD = () => {
    const todayKey = new Date().toISOString().split('T')[0];
    localStorage.setItem('todDismissed', todayKey);
    setTodayDismissed(true);
  };

  const categories = ['All', ...Array.from(new Set(tools.map(t => t.category)))];
  const toolOfDay = getToolOfDay(tools);

  const filteredTools = tools
    .filter(tool => {
      const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
      const matchesSearch =
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    })
    .map(tool => ({
      ...tool,
      isLiked: likedTools.includes(tool.id),
      isSaved: savedToolIds.includes(tool.id),
      totalLikes: likeCounts[tool.id] ?? 0,
      saves: saveCounts[tool.id] ?? 0,
    }))
    .sort((a, b) => b.totalLikes - a.totalLikes);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      <Sidebar
        categories={categories}
        selectedCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        streak={streak}
      />

      <div className="flex-1 flex flex-col min-h-screen w-full">
        <Navbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          likedCount={likedTools.length}
          savedCount={savedToolIds.length}
          onOpenSidebar={() => setIsSidebarOpen(true)}
        />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 md:py-10 overflow-y-auto">
          <div className="max-w-400 mx-auto">

            {/* Tool of the Day */}
            {/* {toolOfDay && !todayDismissed && !searchQuery && activeCategory === 'All' && (
              <div className="relative mb-8 rounded-2xl overflow-hidden border border-purple-200 dark:border-purple-800/50 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/40 p-5">
                <div className="flex items-start gap-4">
                  <div className="shrink-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-purple-500 dark:text-purple-400 mb-2">
                      ✦ Tool of the Day
                    </p>
                    <img
                      src={toolOfDay.image}
                      alt={toolOfDay.title}
                      className="w-14 h-14 rounded-2xl object-contain bg-white dark:bg-slate-800 p-1.5 border border-purple-100 dark:border-purple-900"
                      onError={e => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(toolOfDay.title)}&background=random`;
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{toolOfDay.title}</h3>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
                        {toolOfDay.category}
                      </span>
                      {toolOfDay.pricing && (
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${PRICING_STYLES[toolOfDay.pricing]}`}>
                          {toolOfDay.pricing}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-3">
                      {toolOfDay.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <a
                        href={toolOfDay.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold transition-colors"
                      >
                        Visit Tool <ExternalLink size={12} />
                      </a>
                      <button
                        onClick={() => handleSave(toolOfDay.id)}
                        className="px-4 py-1.5 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg text-xs font-medium transition-colors"
                      >
                        {savedToolIds.includes(toolOfDay.id) ? 'Saved ✓' : 'Save'}
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={dismissToD}
                  className="absolute top-3 right-3 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-white/50 dark:hover:bg-black/20 rounded-lg transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            )} */}

            {/* Header row */}
            <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
              <div className="space-y-1">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {activeCategory === 'All' ? 'Discover Tools' : activeCategory}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  {activeCategory === 'All'
                    ? `${tools.length} curated tools and counting`
                    : `${filteredTools.length} ${activeCategory.toLowerCase()} tools`}
                </p>
              </div>

              {/* Random tool button */}
              <button
                onClick={handleRandomTool}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-medium hover:border-purple-300 dark:hover:border-purple-700 hover:text-purple-700 dark:hover:text-purple-300 transition-colors shadow-sm shrink-0"
              >
                <Shuffle size={15} />
                Surprise me
              </button>
            </div>

            {filteredTools.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
                {filteredTools.map(tool => (
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
                <div className="bg-slate-100 dark:bg-slate-900 rounded-full p-6 mb-4">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">No tools found</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6 text-sm">
                  We couldn&apos;t find anything matching your criteria.
                </p>
                <button
                  onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
                  className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {saveModal && (
        <SaveModal
          toolId={saveModal.toolId}
          toolName={saveModal.toolName}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}
