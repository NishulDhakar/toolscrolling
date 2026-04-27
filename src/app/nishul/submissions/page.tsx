'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, Trash2, ExternalLink, Clock, Inbox } from 'lucide-react';
import { isAuthenticated } from '@/lib/authService';
import {
  getSubmissions,
  approveSubmission,
  rejectSubmission,
  deleteSubmission,
  type Submission,
} from '@/lib/submissionService';

type Filter = 'pending' | 'approved' | 'rejected';

export default function SubmissionsPage() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filter, setFilter] = useState<Filter>('pending');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) { router.push('/nishul/login'); return; }
    setSubmissions(getSubmissions());
    setIsLoaded(true);
  }, [router]);

  const refresh = () => setSubmissions(getSubmissions());

  const handleApprove = (id: string) => { approveSubmission(id); refresh(); };
  const handleReject = (id: string) => { rejectSubmission(id); refresh(); };
  const handleDelete = (id: string) => { deleteSubmission(id); refresh(); };

  const filtered = submissions.filter(s => s.status === filter);
  const counts = {
    pending: submissions.filter(s => s.status === 'pending').length,
    approved: submissions.filter(s => s.status === 'approved').length,
    rejected: submissions.filter(s => s.status === 'rejected').length,
  };

  if (!isLoaded) return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
      <div className="text-slate-500 dark:text-slate-400 text-sm">Loading…</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center gap-4">
          <Link href="/nishul" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition">
            <ArrowLeft size={18} className="text-slate-600 dark:text-slate-400" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Submissions</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Community-submitted tools awaiting review</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter tabs */}
        <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit mb-6">
          {(['pending', 'approved', 'rejected'] as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span className={`px-1.5 py-0.5 rounded-full text-xs font-semibold ${
                f === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                f === 'approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
              }`}>
                {counts[f]}
              </span>
            </button>
          ))}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
              <Inbox className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">No {filter} submissions</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {filter === 'pending' ? 'New submissions will appear here.' : `Nothing has been ${filter} yet.`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(sub => (
              <div
                key={sub.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5"
              >
                <div className="flex gap-4">
                  {/* Logo */}
                  {sub.image && (
                    <div className="w-12 h-12 shrink-0 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden p-1">
                      <img
                        src={sub.image}
                        alt={sub.title}
                        className="w-full h-full object-contain"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">{sub.title}</h3>
                        <a
                          href={sub.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 flex items-center gap-1 mt-0.5 transition-colors"
                        >
                          {sub.url} <ExternalLink size={10} />
                        </a>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">
                          {sub.category}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <Clock size={10} />
                          {new Date(sub.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">
                      {sub.description}
                    </p>

                    {sub.note && (
                      <p className="mt-2 text-xs text-slate-400 italic border-l-2 border-slate-200 dark:border-slate-700 pl-2">
                        &ldquo;{sub.note}&rdquo;
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-4">
                      {filter === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(sub.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-lg text-xs font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors border border-emerald-200 dark:border-emerald-800"
                          >
                            <CheckCircle size={13} /> Approve
                          </button>
                          <button
                            onClick={() => handleReject(sub.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 rounded-lg text-xs font-medium hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors border border-rose-200 dark:border-rose-800"
                          >
                            <XCircle size={13} /> Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(sub.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ml-auto"
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
