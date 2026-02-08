import React from 'react';
import { LayoutGrid, Code, PenTool, Brain, Sparkles, Folder, Bookmark, X } from 'lucide-react';
import Link from 'next/link';

interface SidebarProps {
    categories: string[];
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
    isOpen?: boolean;
    onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    categories,
    selectedCategory,
    onSelectCategory,
    isOpen = false,
    onClose
}) => {
    const getIcon = (category: string) => {
        const iconProps = { size: 18, strokeWidth: 2 };
        switch (category) {
            case 'All':
                return <LayoutGrid {...iconProps} />;
            case 'Development':
                return <Code {...iconProps} />;
            case 'Design':
                return <PenTool {...iconProps} />;
            case 'AI':
                return <Brain {...iconProps} />;
            case 'Productivity':
                return <Sparkles {...iconProps} />;
            default:
                return <Folder {...iconProps} />;
        }
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Container */}
            <aside className={`
                fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-slate-50/50 dark:bg-black border-r border-border flex flex-col flex-shrink-0
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="flex-1 px-4 py-6 overflow-y-auto">
                    {/* Header Section */}
                    <div className="mb-8 px-2 flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2.5 group">
                            <div className="w-8 h-8 rounded-lg bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-sm">
                                TS
                            </div>
                            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white group-hover:opacity-80 transition-opacity">
                                ToolScrolling
                            </span>
                        </Link>
                        {/* Mobile Close Button */}
                        <button
                            onClick={onClose}
                            className="md:hidden p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-1">
                        <p className="px-2 text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2">
                            Discover
                        </p>
                        {categories.map((category) => {
                            const isActive = selectedCategory === category;
                            return (
                                <button
                                    key={category}
                                    onClick={() => {
                                        onSelectCategory(category);
                                        if (window.innerWidth < 768 && onClose) onClose();
                                    }}
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium 
                                            transition-all duration-200
                                            ${isActive
                                            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-800'
                                            : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-900/50'
                                        }`}
                                >
                                    <span className={isActive ? 'text-black dark:text-white' : 'text-slate-400 dark:text-slate-500'}>
                                        {getIcon(category)}
                                    </span>
                                    <span className="flex-1 text-left">{category}</span>
                                </button>
                            );
                        })}

                        <div className="pt-6 mt-6 border-t border-border/50">
                            <p className="px-2 text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2">
                                Library
                            </p>
                            <a
                                href="/saves"
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium 
                                        transition-all duration-200
                                        text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-900/50`}
                            >
                                <span className="text-slate-400 dark:text-slate-500">
                                    <Bookmark size={18} />
                                </span>
                                <span className="flex-1 text-left">Saved Tools</span>
                            </a>
                        </div>
                    </nav>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-border">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-xs font-medium">
                            U
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">User Account</p>
                            <p className="text-xs text-slate-500 truncate">Free Plan</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
