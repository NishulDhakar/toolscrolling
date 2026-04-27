'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Bookmark, ExternalLink, Share2, Check } from 'lucide-react';
import Link from 'next/link';

interface Tool {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  category: string;
  pricing?: string;
  tags?: string[];
  initialLikes?: number;
}

interface ToolsCardProps {
  tool: Tool;
  isLiked: boolean;
  isSaved: boolean;
  likesCount: number;
  saveCount?: number;
  onToggleLike: (id: string) => void;
  onToggleSave: (id: string) => void;
}

const PRICING_STYLES: Record<string, string> = {
  Free: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
  Freemium: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
  Paid: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
};

export default function ToolsCard({
  tool,
  isLiked,
  isSaved,
  likesCount,
  saveCount = 0,
  onToggleLike,
  onToggleSave,
}: ToolsCardProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const url = `${window.location.origin}/tool/${tool.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      if (navigator.share) navigator.share({ title: tool.title, url });
    }
  };

  return (
    <motion.div

      className="group relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 flex flex-col"
    >
      <div className="p-5 flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <Link href={`/tool/${tool.id}`} className="relative shrink-0">
            <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
            <img
              src={tool.image}
              alt={tool.title}
              className="w-12 h-12 object-contain relative z-10 rounded-xl bg-slate-50 dark:bg-slate-800 p-1"
              onError={e => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tool.title)}&background=random`;
              }}
            />
          </Link>

          {/* Badges */}
          <div className="flex flex-col items-end gap-1">
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {tool.category}
            </span>
            {tool.pricing && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${PRICING_STYLES[tool.pricing] ?? ''}`}>
                {tool.pricing}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 mb-4">
          <Link href={`/tool/${tool.id}`} className="block group/title">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5 group-hover/title:text-purple-600 dark:group-hover/title:text-purple-400 transition-colors leading-snug">
              {tool.title}
            </h3>
          </Link>
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {tool.description}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3.5 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5">
            {/* Save button */}
            <button
              onClick={e => { e.stopPropagation(); e.preventDefault(); onToggleSave(tool.id); }}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                isSaved
                  ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400'
                  : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <Bookmark size={14} className={isSaved ? 'fill-current' : ''} />
              {saveCount > 0 && (
                <span className="tabular-nums">{saveCount >= 1000 ? `${(saveCount / 1000).toFixed(1)}k` : saveCount}</span>
              )}
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 transition-all duration-200"
              title="Copy link"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Share2 size={14} />}
            </button>
          </div>

          <Link
            href={tool.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 transition-colors group/link"
          >
            Visit
            <ExternalLink size={13} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
