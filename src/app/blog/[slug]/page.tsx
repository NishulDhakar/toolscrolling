'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Clock, ArrowLeft, Calendar } from 'lucide-react';
import { getPostBySlug, BlogPost } from '@/lib/blogService';
import MarkdownRenderer from '@/components/MarkdownRenderer';

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function BlogPostPage() {
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const slug = typeof params.slug === 'string' ? params.slug : params.slug?.[0] ?? '';
    const found = getPostBySlug(slug);
    setPost(found ?? null);
    setIsLoaded(true);
  }, [params.slug]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Loading…</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center gap-4">
        <p className="text-slate-500 dark:text-slate-400 text-lg">Post not found.</p>
        <Link
          href="/blog"
          className="text-purple-600 dark:text-purple-400 hover:underline text-sm"
        >
          ← Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Nav */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-14">
            <Link
              href="/blog"
              className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
            >
              <ArrowLeft size={16} />
              Blog
            </Link>
          </div>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map(tag => (
            <span
              key={tag}
              className="px-2.5 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 text-xs font-semibold rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white leading-tight mb-6">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-8 pb-8 border-b border-slate-200 dark:border-slate-800">
          <span className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
              {post.author.charAt(0).toUpperCase()}
            </div>
            {post.author}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar size={14} />
            {formatDate(post.publishedAt)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={14} />
            {post.readTime} min read
          </span>
        </div>

        {/* Cover image */}
        <div className="rounded-2xl overflow-hidden mb-10 aspect-[16/9] bg-slate-200 dark:bg-slate-800">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                `https://picsum.photos/seed/${post.id}/800/450`;
            }}
          />
        </div>

        {/* Content */}
        <MarkdownRenderer content={post.content} />
      </article>
    </div>
  );
}
