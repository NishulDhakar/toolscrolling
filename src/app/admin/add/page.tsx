'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { addTool } from '@/lib/toolsService';
import { isAuthenticated } from '@/lib/authService';
import ToolForm from '@/components/ToolForm';
import Link from 'next/link';
import { ArrowLeft, Plus } from 'lucide-react';
import { Tool } from '@/data/tools';

export default function AddToolPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check authentication
        if (!isAuthenticated()) {
            router.push('/admin/login');
            return;
        }
        setIsLoading(false);
    }, [router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                <div className="text-slate-600 dark:text-slate-400">Loading...</div>
            </div>
        );
    }

    const handleSubmit = (data: Omit<Tool, 'id'>) => {
        setIsSubmitting(true);

        try {
            const newTool = addTool(data);
            setSuccess(true);

            // Redirect after a short delay to show success message
            setTimeout(() => {
                router.push('/admin');
            }, 1500);
        } catch (error) {
            console.error('Error adding tool:', error);
            alert('Failed to add tool. Please try again.');
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        router.push('/admin');
    };

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
                                <Plus size={24} className="text-purple-600" />
                                Add New Tool
                            </h1>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                Fill out the form below to add a new tool to your collection
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
                                Tool Added Successfully!
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400">
                                Redirecting to admin panel...
                            </p>
                        </div>
                    ) : (
                        <ToolForm
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                            submitLabel={isSubmitting ? 'Adding...' : 'Add Tool'}
                        />
                    )}
                </div>
            </main>
        </div>
    );
}
