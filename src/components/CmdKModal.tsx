'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, ArrowRight, Command } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getAllTools, type CustomTool } from '@/lib/toolsService';

const PRICING_STYLES: Record<string, string> = {
  Free: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
  Freemium: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
  Paid: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
};

interface CmdKModalProps {
  onClose: () => void;
}

export default function CmdKModal({ onClose }: CmdKModalProps) {
  const [query, setQuery] = useState('');
  const [allTools, setAllTools] = useState<CustomTool[]>([]);
  const [results, setResults] = useState<CustomTool[]>([]);
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const tools = getAllTools();
    setAllTools(tools);
    setResults(tools.slice(0, 7));
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults(allTools.slice(0, 7));
      setSelected(0);
      return;
    }
    const q = query.toLowerCase();
    const filtered = allTools.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.tags?.some(tag => tag.toLowerCase().includes(q))
    );
    setResults(filtered.slice(0, 7));
    setSelected(0);
  }, [query, allTools]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Scroll selected item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${selected}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [selected]);

  const navigate = (tool: CustomTool) => {
    router.push(`/tool/${tool.id}`);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelected(i => Math.min(i + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelected(i => Math.max(i - 1, 0));
        break;
      case 'Enter':
        if (results[selected]) navigate(results[selected]);
        break;
      case 'Escape':
        onClose();
        break;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 bg-black/50 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search tools by name, category, or tag…"
            className="flex-1 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 outline-none text-sm"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              Clear
            </button>
          )}
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[400px] overflow-y-auto py-1.5">
          {results.length === 0 ? (
            <div className="py-10 text-center text-slate-400 text-sm">
              No tools found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <>
              {!query && (
                <p className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  All Tools
                </p>
              )}
              {results.map((tool, i) => (
                <button
                  key={tool.id}
                  data-index={i}
                  onClick={() => navigate(tool)}
                  onMouseEnter={() => setSelected(i)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                    selected === i
                      ? 'bg-slate-50 dark:bg-slate-800'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <img
                    src={tool.image}
                    alt={tool.title}
                    className="w-8 h-8 rounded-lg object-contain bg-slate-100 dark:bg-slate-700 p-1 shrink-0"
                    onError={e => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tool.title)}&background=random`;
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{tool.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{tool.description}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {tool.pricing && (
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${PRICING_STYLES[tool.pricing] ?? ''}`}>
                        {tool.pricing}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-full">
                      {tool.category}
                    </span>
                    {selected === i && <ArrowRight size={13} className="text-slate-400" />}
                  </div>
                </button>
              ))}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono text-[10px]">↑↓</kbd>
            navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono text-[10px]">↵</kbd>
            open
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono text-[10px]">esc</kbd>
            close
          </span>
          <span className="ml-auto">{results.length} result{results.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>
  );
}
