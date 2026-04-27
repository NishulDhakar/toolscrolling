'use client';

import React from 'react';

type Block =
  | { type: 'h1' | 'h2' | 'h3' | 'h4'; text: string }
  | { type: 'p'; text: string }
  | { type: 'hr' }
  | { type: 'code'; lang: string; code: string }
  | { type: 'blockquote'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] };

function parseInline(text: string, keyBase: number): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+)`|\[(.+?)\]\((.+?)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1] !== undefined) {
      parts.push(<strong key={`${keyBase}-${k++}`} className="font-semibold text-slate-900 dark:text-white">{m[1]}</strong>);
    } else if (m[2] !== undefined) {
      parts.push(<em key={`${keyBase}-${k++}`}>{m[2]}</em>);
    } else if (m[3] !== undefined) {
      parts.push(<code key={`${keyBase}-${k++}`} className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[0.85em] font-mono text-violet-600 dark:text-violet-400">{m[3]}</code>);
    } else if (m[4] !== undefined) {
      parts.push(<a key={`${keyBase}-${k++}`} href={m[5]} target="_blank" rel="noopener noreferrer" className="text-purple-600 dark:text-purple-400 underline underline-offset-2 hover:text-purple-700">{m[4]}</a>);
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  if (parts.length === 0) return '';
  if (parts.length === 1 && typeof parts[0] === 'string') return parts[0];
  return parts;
}

function parseBlocks(md: string): Block[] {
  const lines = md.split('\n');
  const blocks: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    if (/^-{3,}$/.test(line.trim())) { blocks.push({ type: 'hr' }); i++; continue; }
    const hm = line.match(/^(#{1,4})\s+(.+)/);
    if (hm) {
      const lvl = Math.min(hm[1].length, 4) as 1 | 2 | 3 | 4;
      blocks.push({ type: `h${lvl}` as 'h1' | 'h2' | 'h3' | 'h4', text: hm[2] });
      i++; continue;
    }
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim(); i++;
      const codeLines: string[] = [];
      while (i < lines.length && !lines[i].startsWith('```')) { codeLines.push(lines[i]); i++; }
      i++;
      blocks.push({ type: 'code', lang, code: codeLines.join('\n') });
      continue;
    }
    if (line.startsWith('> ')) {
      const qLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('> ')) { qLines.push(lines[i].slice(2)); i++; }
      blocks.push({ type: 'blockquote', text: qLines.join(' ') });
      continue;
    }
    if (/^[-*]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s/.test(lines[i])) { items.push(lines[i].replace(/^[-*]\s/, '')); i++; }
      blocks.push({ type: 'ul', items }); continue;
    }
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) { items.push(lines[i].replace(/^\d+\.\s+/, '')); i++; }
      blocks.push({ type: 'ol', items }); continue;
    }
    const pLines: string[] = [];
    while (
      i < lines.length && lines[i].trim() !== '' &&
      !/^#{1,4}\s/.test(lines[i]) && !lines[i].startsWith('```') &&
      !lines[i].startsWith('> ') && !/^[-*]\s/.test(lines[i]) &&
      !/^\d+\.\s/.test(lines[i]) && !/^-{3,}$/.test(lines[i].trim())
    ) { pLines.push(lines[i]); i++; }
    if (pLines.length) blocks.push({ type: 'p', text: pLines.join(' ') });
  }
  return blocks;
}

export default function MarkdownRenderer({ content, className = '' }: { content: string; className?: string }) {
  if (!content?.trim()) return <p className="text-slate-400 italic text-sm">Nothing to preview yet…</p>;
  const blocks = parseBlocks(content);
  return (
    <div className={className}>
      {blocks.map((block, bi) => {
        switch (block.type) {
          case 'h1': return <h1 key={bi} className="text-3xl font-bold text-slate-900 dark:text-white mt-8 mb-4 first:mt-0 leading-tight">{parseInline(block.text, bi)}</h1>;
          case 'h2': return <h2 key={bi} className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-3 first:mt-0 pb-2 border-b border-slate-200 dark:border-slate-800">{parseInline(block.text, bi)}</h2>;
          case 'h3': return <h3 key={bi} className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-2">{parseInline(block.text, bi)}</h3>;
          case 'h4': return <h4 key={bi} className="text-lg font-semibold text-slate-800 dark:text-slate-200 mt-4 mb-2">{parseInline(block.text, bi)}</h4>;
          case 'p': return <p key={bi} className="text-slate-700 dark:text-slate-300 leading-relaxed text-base mb-5">{parseInline(block.text, bi)}</p>;
          case 'hr': return <hr key={bi} className="my-8 border-slate-200 dark:border-slate-700" />;
          case 'code': return (
            <pre key={bi} className="bg-slate-900 dark:bg-slate-950 rounded-xl p-5 overflow-x-auto mb-5 text-sm border border-slate-800">
              <code className="text-slate-100 font-mono leading-relaxed">{block.code}</code>
            </pre>
          );
          case 'blockquote': return (
            <blockquote key={bi} className="border-l-4 border-purple-400 dark:border-purple-600 pl-4 py-1 my-5 bg-purple-50/50 dark:bg-purple-900/10 rounded-r-xl">
              <p className="text-slate-600 dark:text-slate-400 italic leading-relaxed">{parseInline(block.text, bi)}</p>
            </blockquote>
          );
          case 'ul': return (
            <ul key={bi} className="mb-5 pl-5 space-y-1.5 list-disc">
              {block.items.map((item, ii) => <li key={ii} className="text-slate-700 dark:text-slate-300 leading-relaxed">{parseInline(item, bi * 1000 + ii)}</li>)}
            </ul>
          );
          case 'ol': return (
            <ol key={bi} className="mb-5 pl-5 space-y-1.5 list-decimal">
              {block.items.map((item, ii) => <li key={ii} className="text-slate-700 dark:text-slate-300 leading-relaxed">{parseInline(item, bi * 1000 + ii)}</li>)}
            </ol>
          );
          default: return null;
        }
      })}
    </div>
  );
}
