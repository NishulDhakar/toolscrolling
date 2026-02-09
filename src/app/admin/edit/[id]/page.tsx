'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getToolById, updateTool } from '@/lib/toolsService';
import { isAuthenticated } from '@/lib/authService';
import ToolForm from '@/components/ToolForm';
import Link from 'next/link';
import { ArrowLeft, Edit } from 'lucide-react';
import { Tool } from '@/data/tools';

export default function EditToolPage() {
    const router = useRouter();
    const params = useParams();
    const toolId = params.id as string;

    const [tool, setTool] = useState<Omit<Tool, 'id'> | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Check authentication
        if (!isAuthenticated()) {
            router.push('/admin/login');
            return;
        }

        const foundTool = getToolById(toolId);

        if (!foundTool) {
            setError('Tool not found');
            return;
        }

        if (!foundTool.isCustom) {
            setError('Cannot edit static tools');
            return;
        }

        const { id, isCustom, ...toolData } = foundTool;
        setTool(toolData);
    }, [toolId, router]);

    const handleSubmit = (data: Omit<Tool, 'id'>) => {
        setIsSubmitting(true);

        try {
            const updatedTool = updateTool(toolId, data);

            if (!updatedTool) {
                throw new Error('Failed to update tool');
            }

            setSuccess(true);

            // Redirect after a short delay
            setTimeout(() => {
                router.push('/admin');
            }, 1500);
        } catch (error) {
            console.error('Error updating tool:', error);
            alert('Failed to update tool. Please try again.');
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        router.push('/admin');
    };

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 max-w-md text-center">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                            className="w-8 h-8 text-red-600 dark:text-red-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                        {error}
                    </h2>
                    <Link
                        href="/admin"
                        className="inline-block mt-4 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                    >
                        Back to Admin
                    </Link>
                </div>
            </div>
        );
    }

    if (!tool) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                <div className="text-slate-600 dark:text-slate-400">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Header */}
            <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin"
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                        >
                            <ArrowLeft size={20} className="text-slate-600 dark:text-slate-400" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Edit size={24} className="text-blue-600" />
                                Edit Tool
                            </h1>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                Update the tool information below
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Form */}
            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 md:p-8">
                    {success ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg
                                    className="w-8 h-8 text-green-600 dark:text-green-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                                Tool Updated Successfully!
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400">
                                Redirecting to admin panel...
                            </p>
                        </div>
                    ) : (
                        <ToolForm
                            initialData={tool}
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                            submitLabel={isSubmitting ? 'Updating...' : 'Update Tool'}
                        />
                    )}
                </div>
            </main>
        </div>
    );
}
