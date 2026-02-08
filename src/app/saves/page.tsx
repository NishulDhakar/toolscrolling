'use client';

import React, { useState, useEffect } from 'react';
import { tools } from '../../data/tools';
import ToolCard from '../../components/ToolsCard';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function SavesPage() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [likedTools, setLikedTools] = useState<string[]>([]);
    const [savedTools, setSavedTools] = useState<string[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const savedLikes = localStorage.getItem('likedTools');
        const savedSaves = localStorage.getItem('savedTools');

        if (savedLikes) setLikedTools(JSON.parse(savedLikes));
        if (savedSaves) setSavedTools(JSON.parse(savedSaves));
        setIsLoaded(true);
    }, []);

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

    const categories = ['All', ...Array.from(new Set(tools.map(tool => tool.category)))];

    // Filter only saved tools
    const savedToolsList = tools
        .filter(tool => savedTools.includes(tool.id))
        .filter(tool => {
            const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tool.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesSearch;
        })
        .map(tool => ({
            ...tool,
            isLiked: likedTools.includes(tool.id),
            isSaved: true,
            totalLikes: tool.initialLikes + (likedTools.includes(tool.id) ? 1 : 0)
        }));

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-black font-sans text-gray-900 dark:text-gray-100">
            <Sidebar
                categories={categories}
                selectedCategory={activeCategory}
                onSelectCategory={(cat) => {
                    // If user clicks a category in sidebar on saves page, 
                    // maybe redirect to home with that filter? 
                    // For now, let's keep it simple or just make sidebar links work 
                    // properly if we convert them to configured links.
                    // Since Sidebar uses buttons, we might want to refactor Sidebar 
                    // to use Links or handle navigation.
                    // For this minimal page, I'll just render Sidebar for visual consistency
                    // but maybe we should disable category clicking or handle it.
                    // I'll make it redirect to home
                    window.location.href = `/?category=${cat}`;
                }}
            />

            <div className="flex-1 flex flex-col min-h-screen w-full">
                <Navbar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    likedCount={likedTools.length}
                    savedCount={savedTools.length}
                />

                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-8 flex items-center space-x-4">
                            <Link href="/" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                <ArrowLeft size={24} className="text-gray-600 dark:text-gray-400" />
                            </Link>
                            <div>
                                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                                    Saved Tools
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400 mt-1">
                                    Your personal collection
                                </p>
                            </div>
                        </div>

                        {savedToolsList.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {savedToolsList.map(tool => (
                                    <ToolCard
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
                            <div className="flex flex-col items-center justify-center py-20 text-center min-h-[50vh]">
                                <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-8 mb-6">
                                    <span className="text-5xl">🔖</span>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No saved tools yet</h3>
                                <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-8">
                                    Start exploring and save your favorite tools to access them quickly here.
                                </p>
                                <Link
                                    href="/"
                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:-translate-y-1"
                                >
                                    Explore Tools
                                </Link>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
