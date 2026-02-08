'use client';

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { tools } from '@/data/tools';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import ToolsCard from '@/components/ToolsCard';

export default function Home() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [likedTools, setLikedTools] = useState<string[]>([]);
    const [savedTools, setSavedTools] = useState<string[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Load from local storage on mount
    useEffect(() => {
        const savedLikes = localStorage.getItem('likedTools');
        const savedSaves = localStorage.getItem('savedTools');

        if (savedLikes) setLikedTools(JSON.parse(savedLikes));
        if (savedSaves) setSavedTools(JSON.parse(savedSaves));
        setIsLoaded(true);
    }, []);

    // Save to local storage whenever state changes
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('likedTools', JSON.stringify(likedTools));
        }
    }, [likedTools, isLoaded]);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('savedTools', JSON.stringify(savedTools));
        }
    }, [savedTools, isLoaded]);

    const toggleLike = (id: string) => {
        setLikedTools(prev =>
            prev.includes(id) ? prev.filter(toolId => toolId !== id) : [...prev, id]
        );
    };

    const toggleSave = (id: string) => {
        setSavedTools(prev =>
            prev.includes(id) ? prev.filter(toolId => toolId !== id) : [...prev, id]
        );
    };

    // Get categories from tools
    const categories = ['All', ...Array.from(new Set(tools.map(tool => tool.category)))];

    // Filter and Sort Tools
    const filteredTools = tools
        .filter(tool => {
            const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
            const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tool.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        })
        .map(tool => ({
            ...tool,
            isLiked: likedTools.includes(tool.id),
            isSaved: savedTools.includes(tool.id),
            // Calculate total likes: initial + 1 if user liked
            totalLikes: tool.initialLikes + (likedTools.includes(tool.id) ? 1 : 0)
        }))
        .sort((a, b) => b.totalLikes - a.totalLikes); // Sort by total likes descending

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 
                    dark:from-slate-950 dark:via-slate-900 dark:to-slate-950
                    font-sans text-slate-900 dark:text-slate-100">
            <Sidebar
                categories={categories}
                selectedCategory={activeCategory}
                onSelectCategory={setActiveCategory}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />
            

            <div className="flex-1 flex flex-col min-h-screen w-full">
                <Navbar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    likedCount={likedTools.length}
                    savedCount={savedTools.length}
                    onOpenSidebar={() => setIsSidebarOpen(true)}
                />

                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <div className="mb-8 space-y-3">
                            <div className="flex items-center gap-3">
                                <h2 className="text-4xl font-bold gradient-text">
                                    {activeCategory === 'All' ? 'Discover Tools' : activeCategory}
                                </h2>
                                {activeCategory !== 'All' && (
                                    <span className="px-3 py-1 rounded-lg bg-primary-100 dark:bg-primary-950/30 
                                 text-primary-700 dark:text-primary-400 text-sm font-semibold">
                                        {filteredTools.length}
                                    </span>
                                )}
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 text-lg">
                                {activeCategory === 'All'
                                    ? 'Browse our curated collection of the best tools for developers and designers'
                                    : `Explore ${filteredTools.length} amazing ${activeCategory.toLowerCase()} tools`
                                }
                            </p>
                        </div>

                        {filteredTools.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredTools.map((tool) => (
                                    <ToolsCard
                                        key={tool.id}
                                        tool={tool}
                                        isLiked={tool.isLiked}
                                        isSaved={tool.isSaved}
                                        likesCount={tool.totalLikes}
                                        onToggleLike={toggleLike}
                                        onToggleSave={toggleSave}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-24 text-center animate-[fadeIn_0.3s_ease-out]">
                                <div className="relative mb-6">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-electric-500/20 blur-3xl rounded-full" />
                                    <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 
                                rounded-3xl p-8 shadow-xl">
                                        <Search className="w-16 h-16 text-slate-400 dark:text-slate-500" strokeWidth={1.5} />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                    No tools found
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
                                    We couldn't find any tools matching your search or category. Try adjusting your filters or search terms.
                                </p>
                                <button
                                    onClick={() => {
                                        setActiveCategory('All');
                                        setSearchQuery('');
                                    }}
                                    className="px-6 py-3 bg-gradient-to-r from-primary-600 to-electric-500 
                           hover:from-primary-700 hover:to-electric-600
                           text-white rounded-xl font-semibold 
                           shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30
                           transition-all duration-200 active:scale-95"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="max-w-7xl mx-auto mt-20 mb-10 border-t border-gray-200 dark:border-gray-800 pt-10">
                        <h2 className="text-3xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                            Featured Companies
                        </h2>
                    </div>
                </main>
            </div>
        </div>
    );
}
