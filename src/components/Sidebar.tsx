import React from 'react';
import { LayoutGrid, Code, PenTool, Brain, Sparkles, Folder, Bookmark, X, Flame, Plus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface SidebarProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
  streak?: number;
}

const Sidebar: React.FC<SidebarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  isOpen = false,
  onClose,
  streak = 0,
}) => {
  const getIcon = (category: string) => {
    const p = { size: 17 };
    switch (category) {
      case 'All': return <LayoutGrid {...p} />;
      case 'Development': return <Code {...p} />;
      case 'Design': return <PenTool {...p} />;
      case 'AI': return <Brain {...p} />;
      case 'Productivity': return <Sparkles {...p} />;
      default: return <Folder {...p} />;
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed md:sticky top-0 left-0 z-50 h-screen w-60 bg-white dark:bg-slate-950
        border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex-1 px-3 py-5 overflow-y-auto">
          {/* Logo */}
          <div className="mb-7 px-2 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-slate-900 dark:bg-white flex items-center justify-center">
                <Image src="/logo1.png" width={32} height={32} alt="logo" />
              </div>
              <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                ToolScrolling
              </span>
            </Link>
            <button
              onClick={onClose}
              className="md:hidden p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
            >
              <X size={18} />
            </button>
          </div>

          {/* Discover */}
          <nav className="space-y-0.5">
            <p className="px-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Discover
            </p>
            {categories.map(category => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => {
                    onSelectCategory(category);
                    if (typeof window !== 'undefined' && window.innerWidth < 768 && onClose) onClose();
                  }}
                  className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900/50'
                  }`}
                >
                  <span className={isActive ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}>
                    {getIcon(category)}
                  </span>
                  <span className="flex-1 text-left">{category}</span>
                </button>
              );
            })}
          </nav>

          {/* Library */}
          <div className="pt-5 mt-5 border-t border-slate-100 dark:border-slate-900 space-y-0.5">
            <p className="px-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Library
            </p>
            <Link
              href="/saves"
              className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
            >
              <Bookmark size={17} className="text-slate-400 dark:text-slate-500" />
              Saved Tools
            </Link>
            <Link
              href="/submit"
              className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
            >
              <Plus size={17} className="text-slate-400 dark:text-slate-500" />
              Submit a Tool
            </Link>
          </div>
        </div>

        {/* Footer — streak */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800">
          {streak > 0 ? (
            <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/40">
              <Flame size={16} className="text-amber-500 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                  {streak} day streak{streak > 1 ? '!' : ''}
                </p>
                <p className="text-[10px] text-amber-600/70 dark:text-amber-500/70">Keep it up</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 px-2 py-1.5">
              <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-medium text-slate-500">
                U
              </div>
              <div>
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300">Free Plan</p>
                <p className="text-[10px] text-slate-400">Unlimited saves</p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
