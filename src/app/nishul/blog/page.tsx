'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Plus, Pencil, Trash2, Eye, EyeOff, Calendar, Clock } from 'lucide-react';
import { isAuthenticated } from '@/lib/authService';
import { getAllPosts, deletePost, togglePublish, BlogPost } from '@/lib/blogService';

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function nishulBlogPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/nishul/login');
      return;
    }
    setPosts(getAllPosts().sort((a, b) => b.updatedAt - a.updatedAt));
    setIsLoaded(true);
  }, [router]);

  const handleTogglePublish = (id: string) => {
    togglePublish(id);
    setPosts(getAllPosts().sort((a, b) => b.updatedAt - a.updatedAt));
  };

  const handleDelete = (id: string) => {
    deletePost(id);
    setPosts(getAllPosts().sort((a, b) => b.updatedAt - a.updatedAt));
    setDeletingId(null);
  };

  const published = posts.filter(p => p.status === 'published').length;
  const drafts = posts.filter(p => p.status === 'draft').length;

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/nishul"
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
              >
                <ArrowLeft size={20} className="text-slate-600 dark:text-slate-400" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg">
                  <BookOpen className="text-white" size={22} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Blog</h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {published} published &middot; {drafts} draft
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                href="/blog"
                target="_blank"
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition text-sm"
              >
                View Blog
              </Link>
              <Link
                href="/nishul/blog/new"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg font-medium hover:from-teal-600 hover:to-cyan-600 transition shadow-sm text-sm"
              >
                <Plus size={16} />
                New Post
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {posts.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-16 text-center">
            <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400 mb-4">No blog posts yet.</p>
            <Link
              href="/nishul/blog/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg font-medium text-sm"
            >
              <Plus size={15} />
              Write your first post
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map(post => (
              <div
                key={post.id}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4 items-start">
                  {/* Cover thumb */}
                  <div className="w-20 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          `https://picsum.photos/seed/${post.id}/160/90`;
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-slate-900 dark:text-white leading-snug line-clamp-1 flex-1">
                        {post.title}
                      </h3>
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          post.status === 'published'
                            ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {post.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1 mb-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={11} />
                        {formatDate(post.publishedAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {post.readTime}m read
                      </span>
                      {post.tags.slice(0, 2).map(t => (
                        <span key={t} className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => handleTogglePublish(post.id)}
                      className={`p-2 rounded-lg transition ${
                        post.status === 'published'
                          ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                      title={post.status === 'published' ? 'Unpublish' : 'Publish'}
                    >
                      {post.status === 'published' ? <Eye size={15} /> : <EyeOff size={15} />}
                    </button>
                    <Link
                      href={`/nishul/blog/edit/${post.id}`}
                      className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition"
                      title="Edit"
                    >
                      <Pencil size={15} />
                    </Link>
                    <button
                      onClick={() => setDeletingId(post.id)}
                      className="p-2 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Delete confirm modal */}
      {deletingId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Delete Post</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              This cannot be undone. The post will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deletingId)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition text-sm"
              >
                Delete
              </button>
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
