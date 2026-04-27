'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Rss } from 'lucide-react';
import { getPublishedPosts, BlogPost } from '@/lib/blogService';
import BlogCard from '@/components/BlogCard';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activeTag, setActiveTag] = useState('All');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setPosts(getPublishedPosts());
    setIsLoaded(true);
  }, []);

  const allTags = ['All', ...Array.from(new Set(posts.flatMap(p => p.tags)))];

  const filtered =
    activeTag === 'All' ? posts : posts.filter(p => p.tags.includes(activeTag));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <Link
              href="/feed"
              className="font-bold text-slate-900 dark:text-white text-sm hover:text-purple-600 dark:hover:text-purple-400 transition"
            >
              ← ToolScrolling
            </Link>
            <div className="flex items-center gap-2">
              <BookOpen size={18} className="text-purple-600" />
              <span className="font-bold text-slate-900 dark:text-white">Blog</span>
            </div>
            <div className="w-24" />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="mb-12 max-w-xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 text-xs font-semibold rounded-full">
              Latest
            </span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
            The ToolScrolling Blog
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">
            Guides, tool breakdowns, and insights on the software tools shaping how we build.
          </p>
        </div>

        {/* Tag filter */}
        {isLoaded && allTags.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  activeTag === tag
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        {!isLoaded ? (
          <div className="text-center py-20 text-slate-400">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">No posts yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(post => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
