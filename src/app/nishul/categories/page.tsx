'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Lock, Tag } from 'lucide-react';
import { isAuthenticated } from '@/lib/authService';
import {
  getCategories,
  addCategory,
  deleteCategory,
  DEFAULT_CATEGORIES,
} from '@/lib/categoryService';

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/nishul/login');
      return;
    }
    setCategories(getCategories());
    setIsLoaded(true);
  }, [router]);

  const handleAdd = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const success = addCategory(trimmed);
    if (!success) {
      setError(`"${trimmed}" already exists.`);
      return;
    }
    setCategories(getCategories());
    setInput('');
    setError('');
  };

  const handleDelete = (name: string) => {
    deleteCategory(name);
    setCategories(getCategories());
  };

  const customCategories = categories.filter(c => !DEFAULT_CATEGORIES.includes(c));

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link
              href="/nishul"
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
            >
              <ArrowLeft size={20} className="text-slate-600 dark:text-slate-400" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg">
                <Tag className="text-white" size={22} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Categories
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {categories.length} total &mdash; {DEFAULT_CATEGORIES.length} default, {customCategories.length} custom
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Add new */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 uppercase tracking-wide">
            Add New Category
          </h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={e => { setInput(e.target.value); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="e.g. Security, GameDev, DevOps…"
              className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm"
            />
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-blue-600 transition shadow-sm text-sm"
            >
              <Plus size={16} />
              Add
            </button>
          </div>
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </div>

        {/* Default categories */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lock size={14} className="text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
              Default Categories
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {DEFAULT_CATEGORIES.map(cat => (
              <span
                key={cat}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-sm font-medium"
              >
                {cat}
                <Lock size={11} className="opacity-40" />
              </span>
            ))}
          </div>
        </div>

        {/* Custom categories */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 uppercase tracking-wide">
            Custom Categories
          </h2>
          {customCategories.length === 0 ? (
            <p className="text-sm text-slate-400 dark:text-slate-500">
              No custom categories yet. Add one above.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {customCategories.map(cat => (
                <span
                  key={cat}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/40 rounded-lg text-sm font-medium"
                >
                  {cat}
                  <button
                    onClick={() => handleDelete(cat)}
                    className="ml-1 p-0.5 hover:text-red-500 transition rounded"
                    title={`Delete ${cat}`}
                  >
                    <Trash2 size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
