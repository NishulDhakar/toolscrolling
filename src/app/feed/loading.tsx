export default function FeedLoading() {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar placeholder */}
      <div className="hidden md:flex w-60 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex-col px-3 py-5 gap-2">
        <div className="h-9 w-36 bg-slate-200 dark:bg-slate-800 rounded-lg mb-5 animate-pulse" />
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-8 bg-slate-100 dark:bg-slate-800/60 rounded-lg animate-pulse" style={{ animationDelay: `${i * 40}ms` }} />
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar placeholder */}
        <div className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-6 flex items-center gap-4">
          <div className="flex-1 h-9 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
          <div className="h-9 w-20 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
          <div className="h-9 w-20 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
        </div>

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-400 mx-auto">
            {/* Header row */}
            <div className="flex items-end justify-between mb-8">
              <div className="space-y-2">
                <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
                <div className="h-4 w-32 bg-slate-100 dark:bg-slate-700 rounded animate-pulse" />
              </div>
              <div className="h-9 w-32 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
            </div>

            {/* Tool cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 animate-pulse"
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800" />
                    <div className="h-5 w-14 bg-slate-100 dark:bg-slate-800 rounded-full" />
                  </div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded mb-2 w-3/4" />
                  <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded mb-1" />
                  <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded w-2/3 mb-4" />
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="h-4 w-12 bg-slate-100 dark:bg-slate-800 rounded" />
                    <div className="flex gap-2">
                      <div className="h-7 w-7 bg-slate-100 dark:bg-slate-800 rounded-lg" />
                      <div className="h-7 w-7 bg-slate-100 dark:bg-slate-800 rounded-lg" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
