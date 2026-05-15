export default function SubmitLoading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm animate-pulse">
        <div className="h-7 w-40 bg-slate-200 dark:bg-slate-800 rounded-lg mb-2" />
        <div className="h-4 w-64 bg-slate-100 dark:bg-slate-700 rounded mb-8" />

        {/* URL input row */}
        <div className="flex gap-2 mb-6">
          <div className="flex-1 h-11 bg-slate-100 dark:bg-slate-800 rounded-xl" />
          <div className="h-11 w-20 bg-slate-200 dark:bg-slate-700 rounded-xl" />
        </div>

        {/* Fields */}
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded mb-2" />
              <div className="h-11 bg-slate-100 dark:bg-slate-800 rounded-xl" />
            </div>
          ))}
          <div>
            <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded mb-2" />
            <div className="h-24 bg-slate-100 dark:bg-slate-800 rounded-xl" />
          </div>
        </div>

        <div className="h-11 bg-slate-200 dark:bg-slate-700 rounded-xl mt-6" />
      </div>
    </div>
  );
}
