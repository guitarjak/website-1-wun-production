export default function CourseLoading() {
  return (
    <div className="animate-pulse">
      {/* Course Header Skeleton */}
      <div
        className="backdrop-blur rounded-2xl shadow-lg p-6 sm:p-8 mb-8 border"
        style={{ borderColor: 'var(--border-light)', background: 'var(--bg-primary)' }}
      >
        <div className="h-8 bg-slate-200 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-slate-200 rounded w-1/2 mb-6"></div>

        {/* Progress Summary Skeleton */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="h-4 bg-slate-200 rounded w-32 mb-2"></div>
          <div className="h-8 bg-slate-200 rounded w-48 mb-4"></div>
          <div className="w-full rounded-full h-3 bg-slate-200"></div>
        </div>
      </div>

      {/* Module Skeletons */}
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="backdrop-blur rounded-2xl shadow-lg overflow-hidden border border-slate-100 mb-6"
          style={{ background: 'var(--bg-primary)' }}
        >
          {/* Module Header Skeleton */}
          <div className="bg-slate-50 border-l-4 border-slate-300 px-4 sm:px-6 py-4 sm:py-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-200 rounded"></div>
              <div className="flex-1">
                <div className="h-6 bg-slate-200 rounded w-48 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-64"></div>
              </div>
            </div>
          </div>

          {/* Lesson Skeletons */}
          <div className="divide-y">
            {[1, 2].map((j) => (
              <div key={j} className="px-4 sm:px-6 py-5 sm:py-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-slate-200 rounded flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-slate-200 rounded w-56 mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-40"></div>
                  </div>
                  <div className="h-10 w-24 bg-slate-200 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Module Footer Skeleton */}
          <div className="bg-slate-50 px-4 sm:px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-slate-200 rounded w-32"></div>
              <div className="flex-1 mx-4 bg-slate-200 rounded-full h-2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
