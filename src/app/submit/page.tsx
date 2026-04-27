'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { addSubmission } from '@/lib/submissionService';

type FetchState = 'idle' | 'loading' | 'done' | 'error';
const CATEGORIES = ['Development', 'Design', 'Productivity', 'AI', 'Other'];

export default function SubmitPage() {
  const [url, setUrl] = useState('');
  const [fetchState, setFetchState] = useState<FetchState>('idle');
  const [fetchError, setFetchError] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('Development');
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const showFields = fetchState === 'done' || fetchState === 'error';

  const handleFetch = async () => {
    const raw = url.trim();
    if (!raw) return;
    setFetchState('loading');
    setFetchError('');
    try {
      const res = await fetch(`/api/fetch-meta?url=${encodeURIComponent(raw)}`);
      const data = await res.json();
      if (!res.ok || data.error) {
        setFetchError(data.error ?? 'Could not fetch metadata');
        setFetchState('error');
        return;
      }
      if (data.title) setTitle(data.title);
      if (data.description) setDescription(data.description);
      if (data.image) setImage(data.image);
      setFetchState('done');
    } catch {
      setFetchError('Network error — fill fields manually');
      setFetchState('error');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !title.trim() || !description.trim()) return;
    addSubmission({ url: url.trim(), title: title.trim(), description: description.trim(), image, category, note });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Submitted!</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
            Thanks for the tip. We&apos;ll review it and add it to the feed if it&apos;s a good fit.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => { setSubmitted(false); setUrl(''); setTitle(''); setDescription(''); setImage(''); setNote(''); setFetchState('idle'); }}
              className="px-4 py-2 text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              Submit another
            </button>
            <Link
              href="/feed"
              className="px-4 py-2 text-sm font-medium bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl hover:opacity-90 transition-opacity"
            >
              Back to feed
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      <div className="max-w-xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/feed"
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Submit a Tool</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Know something great that belongs here?
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-sm">
          {/* URL */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Tool URL <span className="text-purple-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={url}
                onChange={e => { setUrl(e.target.value); if (fetchState !== 'idle') setFetchState('idle'); }}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleFetch(); } }}
                placeholder="https://example.com"
                autoFocus
                className="flex-1 px-3 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              />
              <button
                type="button"
                onClick={handleFetch}
                disabled={fetchState === 'loading' || !url.trim()}
                className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl font-medium text-sm transition-colors shrink-0"
              >
                {fetchState === 'loading' ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
                {fetchState === 'loading' ? 'Fetching…' : 'Fetch'}
              </button>
            </div>
            {fetchState === 'done' && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                <CheckCircle size={12} /> Info loaded — review below
              </p>
            )}
            {fetchState === 'error' && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400">
                <AlertCircle size={12} /> {fetchError}
              </p>
            )}
          </div>

          {showFields && (
            <>
              {/* Logo preview + image */}
              <div className="flex gap-3 items-start">
                {image && (
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                    <img src={image} alt="logo" className="w-9 h-9 object-contain" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </div>
                )}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Image / Logo URL</label>
                  <input type="text" value={image} onChange={e => setImage(e.target.value)} placeholder="https://…" className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition" />
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Name <span className="text-purple-500">*</span></label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Tool name" required className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition" />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Description <span className="text-purple-500">*</span></label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="What does this tool do?" required className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition resize-none" />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Note */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Why are you submitting this? <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <textarea value={note} onChange={e => setNote(e.target.value)} rows={2} placeholder="Why should this be on ToolScrolling?" className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition resize-none" />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-sm hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
              >
                Submit for Review
              </button>
            </>
          )}

          {!showFields && (
            <p className="text-center text-xs text-slate-400 pb-1">
              Enter the tool URL above and press Fetch to auto-fill the details
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
