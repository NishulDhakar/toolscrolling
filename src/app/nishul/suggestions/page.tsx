'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/authService';
import { addTool, getAllTools } from '@/lib/toolsService';
import { suggestedTools, SuggestedTool } from '@/data/suggestedTools';
import Link from 'next/link';
import {
  ArrowLeft,
  Sparkles,
  Flame,
  Gem,
  CheckCircle2,
  Plus,
  ExternalLink,
} from 'lucide-react';
import { getCategories } from '@/lib/categoryService';

export default function SuggestionsPage() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<Record<string, string>>({});
  const [addedTools, setAddedTools] = useState<Set<string>>(new Set());
  const [addingTools, setAddingTools] = useState<Set<string>>(new Set());
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/nishul/login');
      return;
    }

    setCategories(getCategories());

    const defaults: Record<string, string> = {};
    suggestedTools.forEach(t => {
      defaults[t.title] = t.defaultCategory;
    });
    setSelectedCategories(defaults);

    const existingTitles = new Set(
      getAllTools().map(t => t.title.toLowerCase())
    );
    setAddedTools(
      new Set(
        suggestedTools
          .filter(t => existingTitles.has(t.title.toLowerCase()))
          .map(t => t.title)
      )
    );

    setIsLoaded(true);
  }, [router]);

  const handleAdd = (tool: SuggestedTool) => {
    setAddingTools(prev => new Set(prev).add(tool.title));
    try {
      addTool({
        title: tool.title,
        description: tool.description,
        image: tool.image,
        link: tool.link,
        category: selectedCategories[tool.title] ?? tool.defaultCategory,
      });
      setAddedTools(prev => new Set(prev).add(tool.title));
    } finally {
      setAddingTools(prev => {
        const next = new Set(prev);
        next.delete(tool.title);
        return next;
      });
    }
  };

  const hotCount = suggestedTools.filter(t => t.badge === 'hot').length;
  const gemCount = suggestedTools.filter(t => t.badge === 'gem').length;

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
          <div className="flex items-center gap-4">
            <Link
              href="/nishul"
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
            >
              <ArrowLeft size={20} className="text-slate-600 dark:text-slate-400" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg">
                <Sparkles className="text-white" size={22} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Today&apos;s Suggestions
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  AI-discovered tools &mdash;{' '}
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: 'Discovered',
              value: suggestedTools.length,
              color: 'text-slate-900 dark:text-white',
              bg: 'bg-slate-100 dark:bg-slate-800',
            },
            {
              label: 'Hot Picks',
              value: hotCount,
              color: 'text-orange-500',
              bg: 'bg-orange-50 dark:bg-orange-900/20',
            },
            {
              label: 'Hidden Gems',
              value: gemCount,
              color: 'text-emerald-500',
              bg: 'bg-emerald-50 dark:bg-emerald-900/20',
            },
            {
              label: 'Added to Feed',
              value: addedTools.size,
              color: 'text-purple-500',
              bg: 'bg-purple-50 dark:bg-purple-900/20',
            },
          ].map(({ label, value, color, bg }) => (
            <div
              key={label}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5"
            >
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{label}</p>
              <div className="flex items-end gap-2">
                <p className={`text-3xl font-bold ${color}`}>{value}</p>
                <span className={`mb-1 px-2 py-0.5 rounded-md text-xs font-medium ${color} ${bg}`}>
                  tools
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {suggestedTools.map(tool => {
            const isAdded = addedTools.has(tool.title);
            const isAdding = addingTools.has(tool.title);

            return (
              <div
                key={tool.title}
                className={`bg-white dark:bg-slate-900 rounded-xl border flex flex-col transition-all duration-300
                  ${isAdded
                    ? 'border-green-200 dark:border-green-800/40 opacity-60'
                    : 'border-slate-200 dark:border-slate-800 hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
              >
                <div className="p-5 flex flex-col flex-1">
                  {/* Badge + score */}
                  <div className="flex items-center justify-between mb-4 min-h-[24px]">
                    <div>
                      {tool.badge === 'hot' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-xs font-semibold rounded-full">
                          <Flame size={11} />
                          Hot Pick
                        </span>
                      )}
                      {tool.badge === 'gem' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-full">
                          <Gem size={11} />
                          Hidden Gem
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 tabular-nums">
                      {tool.trendScore}
                    </span>
                  </div>

                  {/* Logo + name */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 flex-shrink-0 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden">
                      <img
                        src={tool.image}
                        alt={tool.title}
                        className="w-full h-full object-contain p-1.5"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(tool.title)}&background=random&size=64`;
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 dark:text-white truncate leading-tight">
                        {tool.title}
                      </h3>
                      <a
                        href={tool.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-purple-500 dark:hover:text-purple-400 transition mt-0.5"
                      >
                        <ExternalLink size={11} />
                        Visit site
                      </a>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3 flex-1">
                    {tool.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {tool.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Trend bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 mb-1">
                      <span>Trend Score</span>
                      <span className="font-semibold">{tool.trendScore}/100</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          tool.badge === 'hot'
                            ? 'bg-gradient-to-r from-orange-400 to-red-400'
                            : tool.badge === 'gem'
                            ? 'bg-gradient-to-r from-emerald-400 to-teal-400'
                            : 'bg-gradient-to-r from-purple-500 to-pink-500'
                        }`}
                        style={{ width: `${tool.trendScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Action row */}
                  {isAdded ? (
                    <div className="flex items-center justify-center gap-2 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle2 size={15} className="text-green-500" />
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">
                        Added to Feed
                      </span>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <select
                        value={selectedCategories[tool.title] ?? tool.defaultCategory}
                        onChange={e =>
                          setSelectedCategories(prev => ({
                            ...prev,
                            [tool.title]: e.target.value,
                          }))
                        }
                        className="flex-1 min-w-0 px-2 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleAdd(tool)}
                        disabled={isAdding}
                        className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shadow-sm"
                      >
                        <Plus size={13} />
                        {isAdding ? 'Adding…' : 'Add Tool'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
