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
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
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

                <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 md:py-12 overflow-y-auto">
                    <div className="max-w-[1600px] mx-auto">
                        {/* Header */}
                        <div className="mb-10 space-y-4 max-w-2xl">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                                {activeCategory === 'All' ? 'Discover Tools' : activeCategory}
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">
                                {activeCategory === 'All'
                                    ? 'Curated collection of the best developer and design tools.'
                                    : `Explore ${filteredTools.length} ${activeCategory.toLowerCase()} tools.`
                                }
                            </p>

                            {activeCategory !== 'All' && (
                                <div className="pt-2">
                                    <span className="inline-flex items-center px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-medium">
                                        {filteredTools.length} results
                                    </span>
                                </div>
                            )}
                        </div>

                        {filteredTools.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 lg:gap-8">
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
                            <div className="flex flex-col items-center justify-center py-24 text-center">
                                <div className="bg-slate-100 dark:bg-slate-900 rounded-full p-6 mb-4">
                                    <Search className="w-8 h-8 text-slate-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                                    No tools found
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
                                    We couldn't find anything matching your criteria.
                                </p>
                                <button
                                    onClick={() => {
                                        setActiveCategory('All');
                                        setSearchQuery('');
                                    }}
                                    className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
