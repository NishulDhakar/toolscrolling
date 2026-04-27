import React from 'react';
import { Search, Bookmark, Menu, Star, Command, Plus, BookOpen } from 'lucide-react';
import Link from 'next/link';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  savedCount?: number;
  likedCount?: number;
  onOpenSidebar?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  savedCount = 0,
  likedCount = 0,
  onOpenSidebar,
}) => {
  const openCmdK = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('open-cmdk'));
    }
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-400 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-3">

          {/* Mobile menu + logo */}
          <div className="flex items-center gap-2 md:hidden shrink-0">
            <button
              onClick={onOpenSidebar}
              className="p-2 -ml-1 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-bold text-sm text-slate-900 dark:text-white">ToolScrolling</span>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400 group-focus-within:text-slate-600 dark:group-focus-within:text-slate-300 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search tools…"
                className="block w-full pl-9 pr-4 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-300 dark:focus:ring-slate-700 transition-all"
                value={searchQuery}
                onChange={e => onSearchChange(e.target.value)}
              />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Cmd+K */}
            <button
              onClick={openCmdK}
              title="Search (⌘K)"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
            >
              <Command size={13} />
              <span className="hidden md:inline">K</span>
            </button>

            {/* Blog */}
            <Link
              href="/blog"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
            >
              <BookOpen size={13} />
              <span className="hidden md:inline">Blog</span>
            </Link>

            {/* Submit */}
            <Link
              href="/submit"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
            >
              <Plus size={13} />
              <span className="hidden md:inline">Submit</span>
            </Link>

            {/* Saves */}
            <Link
              href="/saves"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
            >
              <Bookmark size={13} />
              {savedCount > 0 && <span className="tabular-nums">{savedCount}</span>}
            </Link>

            {/* GitHub Star */}
            <a
              href="https://github.com/NishulDhakar/toolscrolling"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
            >
              <Star size={13} />
              <span>Star</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
