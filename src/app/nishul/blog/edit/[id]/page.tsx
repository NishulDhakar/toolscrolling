'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, CheckCircle2 } from 'lucide-react';
import { isAuthenticated } from '@/lib/authService';
import { getPostById, updatePost } from '@/lib/blogService';
import MarkdownEditor from '@/components/MarkdownEditor';

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : params.id?.[0] ?? '';

  const [isLoaded, setIsLoaded] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    coverImage: '',
    author: '',
    tags: '',
    readTime: '5',
    status: 'draft' as 'draft' | 'published',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/nishul/login');
      return;
    }
    const post = getPostById(id);
    if (!post) {
      setNotFound(true);
      setIsLoaded(true);
      return;
    }
    setForm({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage,
      author: post.author,
      tags: post.tags.join(', '),
      readTime: String(post.readTime),
      status: post.status,
    });
    setIsLoaded(true);
  }, [id, router]);

  const set = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Title is required.';
    if (!form.excerpt.trim()) errs.excerpt = 'Excerpt is required.';
    if (!form.content.trim()) errs.content = 'Content is required.';
    if (!form.author.trim()) errs.author = 'Author is required.';
    const rt = Number(form.readTime);
    if (isNaN(rt) || rt < 1) errs.readTime = 'Must be at least 1.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    updatePost(id, {
      title: form.title.trim(),
      excerpt: form.excerpt.trim(),
      content: form.content.trim(),
      coverImage: form.coverImage.trim() || `https://picsum.photos/seed/${id}/800/450`,
      author: form.author.trim(),
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      readTime: Number(form.readTime),
      status: form.status,
    });
    setSuccess(true);
    setTimeout(() => router.push('/nishul/blog'), 1400);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Loading…</div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center gap-4">
        <p className="text-slate-500">Post not found.</p>
        <Link href="/nishul/blog" className="text-teal-600 hover:underline text-sm">← Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link
              href="/nishul/blog"
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
            >
              <ArrowLeft size={20} className="text-slate-600 dark:text-slate-400" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-linear-to-br from-teal-500 to-cyan-500 rounded-lg">
                <BookOpen className="text-white" size={20} />
              </div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Edit Post</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 md:p-8">
          {success ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">Post Updated!</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Redirecting…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Title <span className="text-red-500">*</span></label>
                <input type="text" value={form.title} onChange={e => set('title', e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm transition" />
                {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Excerpt <span className="text-red-500">*</span></label>
                <textarea value={form.excerpt} onChange={e => set('excerpt', e.target.value)} rows={2}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm transition resize-none" />
                {errors.excerpt && <p className="mt-1 text-xs text-red-500">{errors.excerpt}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Content <span className="text-red-500">*</span></label>
                <MarkdownEditor
                  value={form.content}
                  onChange={v => set('content', v)}
                  rows={14}
                  error={errors.content}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Cover Image URL</label>
                  <input type="text" value={form.coverImage} onChange={e => set('coverImage', e.target.value)} placeholder="https://…"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Author <span className="text-red-500">*</span></label>
                  <input type="text" value={form.author} onChange={e => set('author', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm transition" />
                  {errors.author && <p className="mt-1 text-xs text-red-500">{errors.author}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Tags <span className="text-xs text-slate-400 font-normal">(comma-separated)</span></label>
                  <input type="text" value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="AI, Development"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Read Time (min)</label>
                  <input type="number" min={1} value={form.readTime} onChange={e => set('readTime', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm transition" />
                  {errors.readTime && <p className="mt-1 text-xs text-red-500">{errors.readTime}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Status</label>
                <div className="flex gap-3">
                  {(['draft', 'published'] as const).map(s => (
                    <button key={s} type="button" onClick={() => set('status', s)}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition capitalize ${
                        form.status === s
                          ? s === 'published' ? 'bg-green-500 text-white border-green-500' : 'bg-slate-700 dark:bg-slate-600 text-white border-slate-700'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit"
                  className="flex-1 py-3 bg-linear-to-r from-teal-500 to-cyan-500 text-white rounded-lg font-semibold hover:from-teal-600 hover:to-cyan-600 transition shadow-sm">
                  Save Changes
                </button>
                <Link href="/nishul/blog"
                  className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition text-center text-sm">
                  Cancel
                </Link>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
