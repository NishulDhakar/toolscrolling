import React from 'react';
import { Search, Heart, Bookmark, Menu } from 'lucide-react';

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
    onOpenSidebar
}) => {
    return (
        <nav className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 gap-4">

                    {/* Mobile Menu & Logo Area */}
                    <div className="flex items-center gap-3 md:hidden">
                        <button
                            onClick={onOpenSidebar}
                            className="p-2 -ml-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <span className="font-bold text-lg text-slate-900 dark:text-white">ToolScrolling</span>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-2xl">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-slate-400 group-focus-within:text-slate-600 dark:group-focus-within:text-slate-300 transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search tools..."
                                className="block w-full pl-10 pr-4 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-lg 
                                         bg-slate-50 dark:bg-slate-900 
                                         text-slate-900 dark:text-slate-100 
                                         placeholder-slate-400 dark:placeholder-slate-500
                                         focus:outline-none focus:ring-1 focus:ring-slate-300 dark:focus:ring-slate-700
                                         transition-all duration-200"
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        <div className="hidden sm:flex items-center gap-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                            {/* Stats or other links could go here */}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
