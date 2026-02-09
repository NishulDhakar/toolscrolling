'use client';

import React, { useState, useEffect } from 'react';
import { Tool } from '@/data/tools';
import { validateTool } from '@/lib/toolsService';
import Image from 'next/image';

interface ToolFormProps {
    initialData?: Omit<Tool, 'id'>;
    onSubmit: (data: Omit<Tool, 'id'>) => void;
    onCancel: () => void;
    submitLabel?: string;
}

export default function ToolForm({
    initialData,
    onSubmit,
    onCancel,
    submitLabel = 'Submit',
}: ToolFormProps) {
    const [formData, setFormData] = useState<Omit<Tool, 'id'>>({
        title: '',
        description: '',
        image: '',
        link: '',
        category: 'Development',
        ...initialData,
    });

    const [errors, setErrors] = useState<string[]>([]);
    const [imagePreview, setImagePreview] = useState<string>(initialData?.image || '');

    useEffect(() => {
        if (formData.image && formData.image !== imagePreview) {
            const timer = setTimeout(() => {
                setImagePreview(formData.image);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [formData.image]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        // Clear errors when user starts typing
        if (errors.length > 0) {
            setErrors([]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const validation = validateTool(formData);

        if (!validation.valid) {
            setErrors(validation.errors);
            return;
        }

        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Messages */}
            {errors.length > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-red-800 dark:text-red-200 mb-2">
                        Please fix the following errors:
                    </h4>
                    <ul className="list-disc list-inside space-y-1">
                        {errors.map((error, index) => (
                            <li key={index} className="text-sm text-red-700 dark:text-red-300">
                                {error}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Title */}
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Title *
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                    placeholder="e.g., VS Code"
                />
            </div>

            {/* Description */}
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Description *
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition resize-none"
                    placeholder="A brief description of the tool..."
                />
            </div>

            {/* Image URL */}
            <div>
                <label htmlFor="image" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Image URL *
                </label>
                <input
                    type="url"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                    placeholder="https://example.com/image.png"
                />

                {/* Image Preview */}
                {imagePreview && (
                    <div className="mt-3 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Preview:</p>
                        <div className="relative w-24 h-24 mx-auto">
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full h-full object-contain"
                                onError={() => setImagePreview('')}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Link */}
            <div>
                <label htmlFor="link" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Link *
                </label>
                <input
                    type="url"
                    id="link"
                    name="link"
                    value={formData.link}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                    placeholder="https://example.com"
                />
            </div>

            {/* Category */}
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Category *
                </label>
                <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                >
                    <option value="Development">Development</option>
                    <option value="Design">Design</option>
                    <option value="Productivity">Productivity</option>
                    <option value="AI">AI</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
                <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
                >
                    {submitLabel}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
