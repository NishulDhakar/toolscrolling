'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Heart, Bookmark, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface Tool {
    id: string;
    title: string;
    description: string;
    image: string;
    link: string;
    category: string;
    initialLikes: number;
}

interface ToolsCardProps {
    tool: Tool;
    isLiked: boolean;
    isSaved: boolean;
    likesCount: number;
    onToggleLike: (id: string) => void;
    onToggleSave: (id: string) => void;
}

export default function ToolsCard({
    tool,
    isLiked,
    isSaved,
    likesCount,
    onToggleLike,
    onToggleSave,
}: ToolsCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
            className="group relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-primary-500/10 dark:hover:shadow-primary-500/5 transition-all duration-300"
        >
            {/* Hover Gradient Border */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500 to-electric-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 p-[1px]" />

            <div className="absolute inset-[1px] bg-white dark:bg-slate-900 rounded-[15px] -z-10" />

            <div className="p-5 flex flex-col h-full">
                {/* Header with Image and Category */}
                <div className="flex justify-between items-start mb-4">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <img
                            src={tool.image}
                            alt={tool.title}
                            className="w-12 h-12 object-contain relative z-10 rounded-xl bg-slate-50 dark:bg-slate-800 p-1"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${tool.title}&background=random`
                            }}
                        />
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {tool.category}
                    </span>
                </div>

                {/* Content */}
                <div className="flex-1 mb-4">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {tool.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {tool.description}
                    </p>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                onToggleLike(tool.id);
                            }}
                            className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200
                                ${isLiked
                                    ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-500'
                                    : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                        >
                            <Heart size={16} className={isLiked ? "fill-current" : ""} />
                            <span>{likesCount}</span>
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                onToggleSave(tool.id);
                            }}
                            className={`p-1.5 rounded-lg transition-all duration-200
                                ${isSaved
                                    ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400'
                                    : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300'
                                }`}
                        >
                            <Bookmark size={16} className={isSaved ? "fill-current" : ""} />
                        </button>
                    </div>

                    <Link
                        href={tool.link}
                        target="_blank"
                        className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors group/link"
                    >
                        Visit
                        <ExternalLink size={14} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
