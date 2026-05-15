export default function SavesLoading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-8 w-36 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
              <div className="h-4 w-24 bg-slate-100 dark:bg-slate-700 rounded animate-pulse" />
            </div>
            <div className="flex gap-2">
              <div className="h-9 w-28 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
              <div className="h-9 w-24 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Folder tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-9 w-24 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" style={{ animationDelay: `${i * 40}ms` }} />
          ))}
        </div>

        {/* Tool grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex items-center gap-3 animate-pulse"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
