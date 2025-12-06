import { Suspense } from 'react';
import { unstable_cache } from 'next/cache';
import { requireUser } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import CourseShell from './CourseShell';
import UserProgressStream from './UserProgressStream';

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  order: number;
  module_id: string;
}

interface Module {
  id: string;
  title: string;
  description: string | null;
  order: number;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  description: string | null;
  instructor_id: string;
  modules: Module[];
  completion_title?: string | null;
  completion_message?: string | null;
}

async function fetchCourseData(): Promise<Course | null> {
  const supabase = await createSupabaseServerClient();

  const { data: courseData, error: courseError } = await supabase
    .from('courses')
    .select(`
      id,
      title,
      description,
      instructor_id,
      completion_title,
      completion_message,
      modules (
        id,
        title,
        description,
        order,
        lessons (
          id,
          title,
          description,
          content,
          order,
          module_id
        )
      )
    `)
    .order('created_at', { ascending: true })
    .limit(1)
    .single();

  if (courseError || !courseData) {
    return null;
  }

  const sortedModules = (courseData.modules || [])
    .sort((a: { order: number }, b: { order: number }) => (a.order || 0) - (b.order || 0))
    .map((module: { id: string; title: string; description: string | null; order: number; lessons: Lesson[] }) => ({
      ...module,
      lessons: (module.lessons || []).sort((a: Lesson, b: Lesson) => (a.order || 0) - (b.order || 0)),
    }));

  return {
    id: courseData.id,
    title: courseData.title,
    description: courseData.description,
    instructor_id: courseData.instructor_id,
    completion_title: courseData.completion_title,
    completion_message: courseData.completion_message,
    modules: sortedModules,
  };
}

// Cache course data for 60 seconds - course structure rarely changes
const getCourseData = unstable_cache(
  fetchCourseData,
  ['course-data'],
  { revalidate: 60, tags: ['course'] }
);

export default async function CoursePage() {
  // Run auth and course data fetch in parallel
  const [user, course] = await Promise.all([
    requireUser(),
    getCourseData(),
  ]);

  // No course exists
  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-8xl mb-6">📚</div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
            ยังไม่มีคอร์สให้เรียนในตอนนี้
          </h2>
          <p className="text-lg mb-2" style={{ color: 'var(--text-secondary)' }}>
            โปรดติดต่อผู้ดูแลระบบ
          </p>
        </div>
      </div>
    );
  }

  // No modules
  if (!course.modules || course.modules.length === 0) {
    return (
      <div>
        <div
          className="backdrop-blur rounded-2xl shadow-lg p-6 sm:p-8 mb-8 border"
          style={{ borderColor: 'var(--border-light)', background: 'var(--bg-primary)' }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 break-words" style={{ color: 'var(--text-primary)' }}>
            {course.title}
          </h1>
          {course.description && (
            <p className="text-base sm:text-lg" style={{ color: 'var(--text-secondary)' }}>{course.description}</p>
          )}
        </div>

        <div className="min-h-96 flex items-center justify-center rounded-xl border-2 border-dashed px-4" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-secondary)' }}>
          <div className="text-center">
            <div className="text-6xl mb-4">📖</div>
            <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              ยังไม่มีบทเรียนในตอนนี้
            </h3>
          </div>
        </div>
      </div>
    );
  }

  const isAdmin = user?.profile?.role === 'ADMIN';

  return (
    <>
      {/* Course shell renders immediately with cached course data */}
      <CourseShell course={course} isAdmin={isAdmin} />

      {/* User progress streams in via Suspense - doesn't block initial render */}
      <Suspense fallback={null}>
        <UserProgressStream
          userId={user.user.id}
          modules={course.modules.map(m => ({
            id: m.id,
            lessons: m.lessons.map(l => ({ id: l.id, module_id: l.module_id }))
          }))}
        />
      </Suspense>
    </>
  );
}
