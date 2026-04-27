'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Bookmark, Share2, Check, Tag } from 'lucide-react';
import { getToolById, getAllTools, type CustomTool } from '@/lib/toolsService';
import { isToolSaved, getSavedToolIds } from '@/lib/folderService';
import { getSaveCount } from '@/lib/saveCountService';
import SaveModal from '@/components/SaveModal';

const PRICING_STYLES: Record<string, string> = {
  Free: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800',
  Freemium: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border border-amber-200 dark:border-amber-800',
  Paid: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-200 dark:border-blue-800',
};

export default function ToolDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [tool, setTool] = useState<CustomTool | null>(null);
  const [related, setRelated] = useState<CustomTool[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [saveCount, setSaveCount] = useState(0);
  const [saveModal, setSaveModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const t = getToolById(id);
    if (!t) { router.replace('/feed'); return; }
    setTool(t);
    setIsSaved(isToolSaved(id));
    setSaveCount(getSaveCount(id));

    const others = getAllTools()
      .filter(x => x.id !== id && x.category === t.category)
      .slice(0, 4);
    setRelated(others);
  }, [id, router]);

  const handleModalClose = () => {
    setIsSaved(isToolSaved(id));
    setSaveCount(getSaveCount(id));
    setSaveModal(false);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/tool/${id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: Web Share API
      if (navigator.share) {
        navigator.share({ title: tool?.title, url });
      }
    }
  };

  if (!tool) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
          <Link
            href="/feed"
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <span className="text-sm text-slate-500 dark:text-slate-400 truncate">{tool.title}</span>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Hero card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 mb-8 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Logo */}
            <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center p-3 shrink-0">
              <img
                src={tool.image}
                alt={tool.title}
                className="w-full h-full object-contain"
                onError={e => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tool.title)}&background=random&size=80`;
                }}
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {tool.category}
                </span>
                {tool.pricing && (
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${PRICING_STYLES[tool.pricing]}`}>
                    {tool.pricing}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
                {tool.title}
              </h1>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                {tool.description}
              </p>

              {/* Tags */}
              {tool.tags && tool.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {tool.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-0.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-full"
                    >
                      <Tag size={10} />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <a
                  href={tool.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Visit Tool
                  <ExternalLink size={14} />
                </a>
                <button
                  onClick={() => setSaveModal(true)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                    isSaved
                      ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Bookmark size={15} className={isSaved ? 'fill-current' : ''} />
                  {isSaved ? 'Saved' : 'Save'}
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  {copied ? <Check size={15} className="text-emerald-500" /> : <Share2 size={15} />}
                  {copied ? 'Copied!' : 'Share'}
                </button>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-6 text-sm text-slate-500 dark:text-slate-400">
            <span>
              <strong className="text-slate-900 dark:text-white">{saveCount.toLocaleString()}</strong> saves
            </span>
            <span>
              Category: <strong className="text-slate-900 dark:text-white">{tool.category}</strong>
            </span>
            {tool.pricing && (
              <span>
                Pricing: <strong className="text-slate-900 dark:text-white">{tool.pricing}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Related tools */}
        {related.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              More {tool.category} tools
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map(r => (
                <Link
                  key={r.id}
                  href={`/tool/${r.id}`}
                  className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors group"
                >
                  <img
                    src={r.image}
                    alt={r.title}
                    className="w-10 h-10 rounded-lg object-contain bg-slate-100 dark:bg-slate-800 p-1 shrink-0"
                    onError={e => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(r.title)}&background=random`;
                    }}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {r.title}
                    </p>
                    {r.pricing && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">{r.pricing}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      {saveModal && (
        <SaveModal
          toolId={tool.id}
          toolName={tool.title}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}
