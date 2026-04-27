'use client';

import React, { useState, useRef } from 'react';
import { Tool } from '@/data/tools';
import { validateTool } from '@/lib/toolsService';
import { Loader2, Search, CheckCircle, AlertCircle, RefreshCw, X } from 'lucide-react';

interface ToolFormProps {
  initialData?: Omit<Tool, 'id'>;
  onSubmit: (data: Omit<Tool, 'id'>) => void;
  onCancel: () => void;
  submitLabel?: string;
}

type FetchState = 'idle' | 'loading' | 'done' | 'error';

const CATEGORIES = ['Development', 'Design', 'Productivity', 'AI', 'Other'] as const;
const PRICING_OPTIONS = ['Free', 'Freemium', 'Paid'] as const;

export default function ToolForm({ initialData, onSubmit, onCancel, submitLabel = 'Submit' }: ToolFormProps) {
  const isEdit = !!initialData;

  const [url, setUrl] = useState(initialData?.link ?? '');
  const [fetchState, setFetchState] = useState<FetchState>(isEdit ? 'done' : 'idle');
  const [fetchError, setFetchError] = useState('');

  const [title, setTitle] = useState(initialData?.title ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [image, setImage] = useState(initialData?.image ?? '');
  const [category, setCategory] = useState<Tool['category']>(initialData?.category ?? 'Development');
  const [pricing, setPricing] = useState<Tool['pricing']>(initialData?.pricing ?? 'Free');
  const [tagInput, setTagInput] = useState((initialData?.tags ?? []).join(', '));

  const [errors, setErrors] = useState<string[]>([]);

  const showFields = fetchState === 'done' || fetchState === 'error' || isEdit;

  const handleFetch = async () => {
    const raw = url.trim();
    if (!raw) return;
    setFetchState('loading');
    setFetchError('');
    setErrors([]);
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

  const parseTags = (raw: string): string[] =>
    raw.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    const formData: Omit<Tool, 'id'> = {
      title: title.trim(),
      description: description.trim(),
      image: image.trim(),
      link: url.trim(),
      category,
      pricing,
      tags: parseTags(tagInput),
    };
    const { valid, errors: ve } = validateTool(formData);
    if (!valid) { setErrors(ve); return; }
    onSubmit(formData);
  };

  const tagList = parseTags(tagInput);

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errors.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <ul className="space-y-1">
            {errors.map((err, i) => (
              <li key={i} className="text-sm text-red-700 dark:text-red-300 flex items-center gap-2">
                <AlertCircle size={13} className="shrink-0" /> {err}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* URL + Fetch */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Tool URL <span className="text-purple-500">*</span>
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={url}
            onChange={e => { setUrl(e.target.value); if (fetchState === 'done' && !isEdit) setFetchState('idle'); }}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleFetch(); } }}
            placeholder="https://example.com"
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-sm"
            autoFocus={!isEdit}
          />
          <button
            type="button"
            onClick={handleFetch}
            disabled={fetchState === 'loading' || !url.trim()}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl font-medium text-sm transition-colors shrink-0"
          >
            {fetchState === 'loading' ? <Loader2 size={15} className="animate-spin" /> : fetchState === 'done' ? <RefreshCw size={15} /> : <Search size={15} />}
            {fetchState === 'loading' ? 'Fetching…' : fetchState === 'done' ? 'Re-fetch' : 'Fetch'}
          </button>
        </div>
        {fetchState === 'done' && (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
            <CheckCircle size={12} /> Metadata loaded — review and edit below
          </p>
        )}
        {fetchState === 'error' && (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400">
            <AlertCircle size={12} /> {fetchError} — fill fields manually
          </p>
        )}
      </div>

      {showFields && (
        <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-400 pt-1">Review and edit before saving</p>

          {/* Logo preview + image URL */}
          <div className="flex gap-3 items-start">
            {image && (
              <div className="w-14 h-14 shrink-0 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                <img src={image} alt="logo" className="w-10 h-10 object-contain" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
            )}
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Image / Logo URL</label>
              <input type="text" value={image} onChange={e => setImage(e.target.value)} placeholder="https://example.com/logo.png" className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-sm" />
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Name <span className="text-purple-500">*</span></label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., VS Code" className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-sm" />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Description <span className="text-purple-500">*</span></label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="A brief description of the tool…" className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-sm resize-none" />
          </div>

          {/* Category + Pricing side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Category <span className="text-purple-500">*</span></label>
              <select value={category} onChange={e => setCategory(e.target.value as Tool['category'])} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-sm">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Pricing</label>
              <select value={pricing} onChange={e => setPricing(e.target.value as Tool['pricing'])} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-sm">
                {PRICING_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Tags <span className="text-slate-400 font-normal">(comma-separated)</span>
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              placeholder="e.g., editor, open-source, ai"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-sm"
            />
            {tagList.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tagList.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => setTagInput(tagList.filter(t => t !== tag).join(', '))}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={!showFields}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 disabled:opacity-40 transition-all shadow-lg text-sm"
        >
          {submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition text-sm"
        >
          Cancel
        </button>
      </div>

      {!showFields && (
        <p className="text-center text-xs text-slate-400">
          Enter a URL and press Fetch to auto-fill the details
        </p>
      )}
    </form>
  );
}
