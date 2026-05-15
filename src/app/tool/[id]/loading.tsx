export default function ToolLoading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
          <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Hero card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 mb-8 shadow-sm animate-pulse">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Logo */}
            <div className="w-20 h-20 rounded-2xl bg-slate-200 dark:bg-slate-800 shrink-0" />

            {/* Info */}
            <div className="flex-1 space-y-3">
              <div className="flex gap-2">
                <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded-full" />
                <div className="h-6 w-16 bg-slate-100 dark:bg-slate-700 rounded-full" />
              </div>
              <div className="h-8 w-2/3 bg-slate-200 dark:bg-slate-800 rounded-lg" />
              <div className="space-y-2">
                <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded" />
                <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-5/6" />
                <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-3/4" />
              </div>
              {/* Tags */}
              <div className="flex gap-2 flex-wrap">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-6 w-16 bg-slate-100 dark:bg-slate-800 rounded-full" />
                ))}
              </div>
              {/* Action buttons */}
              <div className="flex gap-2 pt-1">
                <div className="h-10 w-28 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                <div className="h-10 w-20 bg-slate-100 dark:bg-slate-700 rounded-xl" />
                <div className="h-10 w-20 bg-slate-100 dark:bg-slate-700 rounded-xl" />
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex gap-6">
            <div className="h-4 w-20 bg-slate-100 dark:bg-slate-800 rounded" />
            <div className="h-4 w-28 bg-slate-100 dark:bg-slate-800 rounded" />
            <div className="h-4 w-24 bg-slate-100 dark:bg-slate-800 rounded" />
          </div>
        </div>

        {/* Related tools */}
        <div>
          <div className="h-6 w-40 bg-slate-200 dark:bg-slate-800 rounded mb-4 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 animate-pulse"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-800 shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
