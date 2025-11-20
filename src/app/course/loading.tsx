export default function CourseLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-white to-slate-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-12">
          <div className="h-10 w-48 bg-slate-200 rounded-lg animate-pulse mb-4" />
          <div className="h-5 w-64 bg-slate-100 rounded-lg animate-pulse" />
        </div>

        {/* Module Skeletons */}
        <div className="space-y-8">
          {[1, 2, 3].map((index) => (
            <div key={index} className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
              {/* Module Header Skeleton */}
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="h-6 w-48 bg-slate-200 rounded-lg animate-pulse mb-2" />
                    <div className="h-4 w-96 bg-slate-100 rounded-lg animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Lesson Skeletons */}
              <div className="space-y-1">
                {[1, 2].map((lessonIndex) => (
                  <div key={lessonIndex} className="px-6 py-4 border-b border-slate-100 last:border-b-0">
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-5 bg-slate-200 rounded animate-pulse flex-shrink-0" />
                      <div className="flex-1">
                        <div className="h-5 w-64 bg-slate-200 rounded-lg animate-pulse mb-2" />
                        <div className="h-4 w-96 bg-slate-100 rounded-lg animate-pulse" />
                      </div>
                      <div className="h-10 w-24 bg-slate-100 rounded-lg animate-pulse flex-shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Loading Text */}
        <div className="mt-12 text-center">
          <p className="text-slate-600 text-sm animate-pulse">
            กำลังโหลดคอร์สเรียนของคุณ...
          </p>
        </div>
      </div>
    </div>
  );
}
