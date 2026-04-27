'use client';

import React, { useRef, useCallback, useState } from 'react';
import MarkdownRenderer from './MarkdownRenderer';

interface MarkdownEditorProps {
  value: string;
  onChange: (val: string) => void;
  rows?: number;
  error?: string;
}

type ToolItem =
  | { kind: 'btn'; label: string; title: string; cls?: string; action: () => void }
  | { kind: 'sep' };

export default function MarkdownEditor({ value, onChange, rows = 14, error }: MarkdownEditorProps) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const [tab, setTab] = useState<'write' | 'preview'>('write');

  const applyFormat = useCallback(
    (prefix: string, suffix: string, placeholder: string) => {
      const ta = taRef.current;
      if (!ta) return;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const selected = value.slice(start, end) || placeholder;
      const newVal = value.slice(0, start) + prefix + selected + suffix + value.slice(end);
      onChange(newVal);
      setTimeout(() => {
        ta.focus();
        ta.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
      }, 0);
    },
    [value, onChange]
  );

  // For line-level prefixes (headings, list, blockquote) — inserts at start of current line
  const applyLine = useCallback(
    (prefix: string, placeholder: string) => {
      const ta = taRef.current;
      if (!ta) return;
      const start = ta.selectionStart;
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      const before = value.slice(0, lineStart);
      const after = value.slice(lineStart);
      // Strip any existing heading prefix before adding new one
      const stripped = after.replace(/^#{1,4}\s|^[-*]\s|^>\s|^\d+\.\s/, '');
      const newVal = before + prefix + stripped;
      onChange(newVal);
      setTimeout(() => {
        ta.focus();
        const newCursor = lineStart + prefix.length;
        ta.setSelectionRange(newCursor, newCursor + (stripped.split('\n')[0]?.length ?? 0));
      }, 0);
    },
    [value, onChange]
  );

  const insertBlock = useCallback(
    (text: string) => {
      const ta = taRef.current;
      if (!ta) return;
      const start = ta.selectionStart;
      const needsNewline = start > 0 && value[start - 1] !== '\n';
      const prefix = needsNewline ? '\n' : '';
      const newVal = value.slice(0, start) + prefix + text + '\n' + value.slice(start);
      onChange(newVal);
      setTimeout(() => {
        ta.focus();
        const pos = start + prefix.length + text.length + 1;
        ta.setSelectionRange(pos, pos);
      }, 0);
    },
    [value, onChange]
  );

  const tools: ToolItem[] = [
    { kind: 'btn', label: 'H1', title: 'Heading 1', cls: 'font-bold', action: () => applyLine('# ', 'Heading 1') },
    { kind: 'btn', label: 'H2', title: 'Heading 2', cls: 'font-bold', action: () => applyLine('## ', 'Heading 2') },
    { kind: 'btn', label: 'H3', title: 'Heading 3', cls: 'font-bold', action: () => applyLine('### ', 'Heading 3') },
    { kind: 'sep' },
    { kind: 'btn', label: 'B', title: 'Bold', cls: 'font-bold', action: () => applyFormat('**', '**', 'bold text') },
    { kind: 'btn', label: 'I', title: 'Italic', cls: 'italic', action: () => applyFormat('*', '*', 'italic text') },
    { kind: 'btn', label: '`', title: 'Inline code', cls: 'font-mono', action: () => applyFormat('`', '`', 'code') },
    { kind: 'sep' },
    { kind: 'btn', label: '```', title: 'Code block', cls: 'font-mono text-[11px]', action: () => insertBlock('```\ncode here\n```') },
    { kind: 'btn', label: '—', title: 'Bullet list', action: () => applyLine('- ', 'List item') },
    { kind: 'btn', label: '1.', title: 'Numbered list', action: () => applyLine('1. ', 'List item') },
    { kind: 'btn', label: '"', title: 'Blockquote', cls: 'font-serif text-base', action: () => applyLine('> ', 'Quote') },
    { kind: 'btn', label: '─', title: 'Divider', action: () => insertBlock('---') },
  ];

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-900">
      {/* Top bar: toolbar + tabs */}
      <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 flex-wrap">
        {/* Toolbar */}
        <div className="flex items-center gap-0.5 flex-wrap">
          {tools.map((t, i) =>
            t.kind === 'sep' ? (
              <span key={i} className="w-px h-4 bg-slate-300 dark:bg-slate-600 mx-1.5" />
            ) : (
              <button
                key={i}
                type="button"
                title={t.title}
                onClick={t.action}
                className={`px-2 py-1 rounded text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition min-w-[26px] ${t.cls ?? ''}`}
              >
                {t.label}
              </button>
            )
          )}
        </div>

        {/* Write / Preview tabs */}
        <div className="flex rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 text-xs">
          {(['write', 'preview'] as const).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`px-3 py-1 capitalize transition ${
                tab === t
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                  : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop: side-by-side. Mobile: tab-controlled */}
      <div className="flex">
        {/* Editor */}
        <div className={`flex-1 min-w-0 ${tab === 'preview' ? 'hidden lg:block lg:border-r lg:border-slate-200 lg:dark:border-slate-700' : ''}`}>
          <textarea
            ref={taRef}
            value={value}
            onChange={e => onChange(e.target.value)}
            rows={rows}
            placeholder={`Write in **Markdown**...\n\n# Heading 1\n## Heading 2\n\n- bullet list\n- another item\n\n> blockquote\n\n\`\`\`\ncode block\n\`\`\``}
            className="w-full px-4 py-3 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none font-mono text-sm leading-relaxed resize-none"
            spellCheck={false}
          />
        </div>

        {/* Preview — always visible on desktop, tab-controlled on mobile */}
        <div className={`flex-1 min-w-0 px-5 py-4 overflow-auto bg-white dark:bg-slate-900 ${tab === 'write' ? 'hidden lg:block' : ''}`}
          style={{ minHeight: `${rows * 1.625}rem` }}
        >
          <MarkdownRenderer content={value} />
        </div>
      </div>

      {error && (
        <p className="px-4 py-2 text-xs text-red-500 border-t border-slate-200 dark:border-slate-700 bg-red-50 dark:bg-red-900/10">
          {error}
        </p>
      )}
    </div>
  );
}
