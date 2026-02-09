'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAllTools, deleteTool, CustomTool } from '@/lib/toolsService';
import { isAuthenticated, logout } from '@/lib/authService';
import AdminToolCard from '@/components/AdminToolCard';
import Link from 'next/link';
import { Plus, Search, LayoutDashboard, LogOut } from 'lucide-react';

export default function AdminPage() {
    const router = useRouter();
    const [tools, setTools] = useState<CustomTool[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Check authentication
        if (!isAuthenticated()) {
            router.push('/admin/login');
            return;
        }
        loadTools();
    }, [router]);

    const loadTools = () => {
        const allTools = getAllTools();
        setTools(allTools);
        setIsLoaded(true);
    };

    const handleDelete = (id: string) => {
        const success = deleteTool(id);
        if (success) {
            loadTools();
        }
    };

    const categories = ['All', 'Development', 'Design', 'Productivity', 'AI', 'Other'];

    const filteredTools = tools.filter(tool => {
        const matchesCategory = filterCategory === 'All' || tool.category === filterCategory;
        const matchesSearch =
            tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tool.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const customToolsCount = tools.filter(t => t.isCustom).length;
    const staticToolsCount = tools.filter(t => !t.isCustom).length;

    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                <div className="text-slate-600 dark:text-slate-400">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Header */}
            <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg">
                                    <LayoutDashboard className="text-white" size={24} />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                                        Admin Panel
                                    </h1>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        Manage your tools collection
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    logout();
                                    router.push('/admin/login');
                                }}
                                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-2"
                                title="Logout"
                            >
                                <LogOut size={18} />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                            <Link
                                href="/feed"
                                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                            >
                                View Feed
                            </Link>
                            <Link
                                href="/admin/add"
                                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition flex items-center gap-2 shadow-lg"
                            >
                                <Plus size={18} />
                                Add Tool
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Tools</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white">{tools.length}</p>
                            </div>
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <LayoutDashboard className="text-blue-600 dark:text-blue-400" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Custom Tools</p>
                                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                                    {customToolsCount}
                                </p>
                            </div>
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                <Plus className="text-purple-600 dark:text-purple-400" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Static Tools</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                                    {staticToolsCount}
                                </p>
                            </div>
                            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                <LayoutDashboard className="text-slate-600 dark:text-slate-400" size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                size={18}
                            />
                            <input
                                type="text"
                                placeholder="Search tools..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                            />
                        </div>

                        {/* Category Filter */}
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat} {cat === 'All' ? `(${tools.length})` : `(${tools.filter(t => t.category === cat).length})`}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Tools List */}
                <div className="space-y-3">
                    {filteredTools.length > 0 ? (
                        filteredTools.map((tool) => (
                            <AdminToolCard key={tool.id} tool={tool} onDelete={handleDelete} />
                        ))
                    ) : (
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center">
                            <Search className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                No tools found
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-6">
                                Try adjusting your search or filters
                            </p>
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setFilterCategory('All');
                                }}
                                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
