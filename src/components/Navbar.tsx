import React from 'react';
import { Search, Heart, Bookmark, Moon, Sun } from 'lucide-react';

interface NavbarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    savedCount?: number;
    likedCount?: number;
}

const Navbar: React.FC<NavbarProps> = ({
    searchQuery,
    onSearchChange,
    savedCount = 0,
    likedCount = 0
}) => {
    return (
        <nav className="sticky top-0 z-50 glass-card border-b border-slate-200/50 dark:border-slate-700/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-1 flex items-center gap-8">
                        {/* Mobile Logo */}
                        <div className="mr-8 md:hidden flex items-center">
                            <img src="/logo.png" alt="ToolScrolling" className="h-20 w-20 rounded-md object-contain" />
                        </div>

                        {/* Search Bar */}
                        <div className="relative w-full max-w-lg group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors">
                                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-primary-500" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search tools, libraries, AI..."
                                className="block w-full pl-11 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl 
                                         bg-slate-50/50 dark:bg-slate-900/50 
                                         text-slate-900 dark:text-slate-100 
                                         placeholder-slate-400 dark:placeholder-slate-500
                                         focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
                                         dark:focus:ring-electric-500/20 dark:focus:border-electric-500
                                         transition-all duration-200
                                         hover:border-slate-300 dark:hover:border-slate-600"
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                            />
                        </div>
                    </div>


                </div>
            </div>
        </nav>
    );
};

export default Navbar;
