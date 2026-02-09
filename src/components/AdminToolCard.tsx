'use client';

import React, { useState } from 'react';
import { CustomTool } from '@/lib/toolsService';
import { Edit, Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface AdminToolCardProps {
    tool: CustomTool;
    onDelete: (id: string) => void;
}

export default function AdminToolCard({ tool, onDelete }: AdminToolCardProps) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        await onDelete(tool.id);
        setIsDeleting(false);
        setShowDeleteConfirm(false);
    };

    return (
        <>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-lg transition-shadow">
                <div className="flex gap-4">
                    {/* Image */}
                    <div className="w-16 h-16 flex-shrink-0 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden">
                        <img
                            src={tool.image}
                            alt={tool.title}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                                e.currentTarget.src = 'https://via.placeholder.com/64?text=No+Image';
                            }}
                        />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 mb-1">
                            <h3 className="font-semibold text-slate-900 dark:text-white truncate flex-1">
                                {tool.title}
                            </h3>
                            {tool.isCustom && (
                                <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full">
                                    Custom
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-2">
                            {tool.description}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded">
                                {tool.category}
                            </span>
                            <span>♥ {tool.initialLikes}</span>
                            <a
                                href={tool.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 hover:text-purple-600 dark:hover:text-purple-400 transition"
                            >
                                <ExternalLink size={12} />
                                Visit
                            </a>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                        <Link
                            href={`/admin/edit/${tool.id}`}
                            className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition"
                            title="Edit"
                        >
                            <Edit size={16} />
                        </Link>
                        {tool.isCustom && (
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition"
                                title="Delete"
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-md w-full shadow-2xl">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                            Delete Tool
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">
                            Are you sure you want to delete &quot;{tool.title}&quot;? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
