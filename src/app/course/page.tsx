import Link from 'next/link';
import { unstable_cache } from 'next/cache';
import { requireUser } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import CourseEditButton from './CourseEditButton';
import ModuleControls from './ModuleControls';
import AddModuleButton from './AddModuleButton';
import AddLessonButton from './AddLessonButton';
import LessonDeleteButton from './LessonDeleteButton';
import CompletionMessageEditor from './CompletionMessageEditor';

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

  // OPTIMIZATION: Single query with nested relationships - fetches course, modules, and lessons in ONE request
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

  // Sort modules by order and lessons within each module by order
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

// OPTIMIZATION: Cache course data for 60 seconds - course structure rarely changes
const getCourseData = unstable_cache(
  fetchCourseData,
  ['course-data'],
  { revalidate: 60, tags: ['course'] }
);

async function getUserProgress(userId: string): Promise<Set<string>> {
  const supabase = await createSupabaseServerClient();

  const { data: progress, error } = await supabase
    .from('lesson_progress')
    .select('lesson_id, completed')
    .eq('user_id', userId)
    .eq('completed', true);

  if (error || !progress) {
    return new Set();
  }

  return new Set((progress as Array<{ lesson_id: string }>).map((p) => p.lesson_id));
}

async function getUserHomeworkSubmissions(
  userId: string,
  modules: Module[]
): Promise<Set<string>> {
  if (modules.length === 0) {
    return new Set();
  }

  // Build lesson to module map from already-fetched data (no extra DB query!)
  const lessonToModule = new Map<string, string>();
  const lessonIds: string[] = [];
  for (const module of modules) {
    for (const lesson of module.lessons) {
      lessonToModule.set(lesson.id, module.id);
      lessonIds.push(lesson.id);
    }
  }

  if (lessonIds.length === 0) {
    return new Set();
  }

  const supabase = await createSupabaseServerClient();

  // Get submissions for this user for any of these lessons (single query)
  const { data: submissions } = await supabase
    .from('homework_submissions')
    .select('lesson_id')
    .eq('user_id', userId)
    .in('lesson_id', lessonIds);

  if (!submissions) {
    return new Set();
  }

  // Map lesson_ids back to module_ids
  const modulesWithSubmission = new Set(
    (submissions as Array<{ lesson_id: string }>).map((s) => lessonToModule.get(s.lesson_id)).filter((m) => m)
  );

  return modulesWithSubmission as Set<string>;
}

/**
 * Check if a lesson should be locked based on module order and progress
 */
function isLessonLocked(
  lessonIndex: number,
  moduleIndex: number,
  completedLessonIds: Set<string>,
  modules: Module[],
  modulesWithHomework: Set<string>
): boolean {
  // First module, first lesson is always available
  if (moduleIndex === 0 && lessonIndex === 0) {
    return false;
  }

  // Check if previous lesson in same module is completed
  if (lessonIndex > 0) {
    const previousLesson = modules[moduleIndex].lessons[lessonIndex - 1];
    if (previousLesson && completedLessonIds.has(previousLesson.id)) {
      return false;
    }
  }

  // Check if this is first lesson of a module and all lessons of previous module are completed
  // AND homework for previous module has been submitted
  if (lessonIndex === 0 && moduleIndex > 0) {
    const previousModule = modules[moduleIndex - 1];
    const allPreviousLessonsCompleted = previousModule.lessons.every(
      (lesson) => completedLessonIds.has(lesson.id)
    );
    const previousHomeworkSubmitted = modulesWithHomework.has(previousModule.id);

    if (allPreviousLessonsCompleted && previousHomeworkSubmitted) {
      return false;
    }
  }

  return true;
}

export default async function CoursePage() {
  // OPTIMIZATION: Run user auth and course data fetch in parallel
  // These don't depend on each other, so we can fetch both simultaneously
  const [user, course] = await Promise.all([
    requireUser(),
    getCourseData(),
  ]);

  // OPTIMIZATION: Run progress and homework queries in parallel
  // Both need user.id but not each other's results
  const [completedLessonIds, modulesWithHomework] = await Promise.all([
    getUserProgress(user.user.id),
    getUserHomeworkSubmissions(user.user.id, course?.modules || []),
  ]);

  // If no course exists
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
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
            ผู้ดูแลระบบจะสร้างคอร์สเรียนให้คุณในเร็วๆ นี้
          </p>
        </div>
      </div>
    );
  }

  // If no modules
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
            <p className="mb-1" style={{ color: 'var(--text-secondary)' }}>
              โปรดติดต่อผู้ดูแลระบบ
            </p>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              ผู้ดูแลระบบกำลังเตรียมเนื้อหาบทเรียนให้คุณ
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Check if user is admin
  const isAdmin = user?.profile?.role === 'ADMIN';

  return (
    <div>
      {/* Course Header */}
      <div
        className="backdrop-blur rounded-2xl shadow-lg p-6 sm:p-8 mb-8 border"
        style={{ borderColor: 'var(--border-light)', background: 'var(--bg-primary)' }}
      >
        {isAdmin ? (
          <CourseEditButton
            courseId={course.id}
            initialTitle={course.title}
            initialDescription={course.description}
          />
        ) : (
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold mb-3 break-words" style={{ color: 'var(--text-primary)' }}>
              {course.title}
            </h1>
            {course.description && (
              <p className="text-base sm:text-lg line-clamp-3" style={{ color: 'var(--text-secondary)' }}>{course.description}</p>
            )}
          </div>
        )}

        {/* Progress Summary */}
        <div className="mt-6 pt-6" style={{ borderTop: '1px solid var(--border-light)' }}>
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                ความก้าวหน้าโดยรวม
              </p>
              <p className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--blue)' }}>
                {completedLessonIds.size} / {course.modules.reduce((sum, m) => sum + m.lessons.length, 0)} บทเรียน
              </p>
            </div>
            <div className="w-full">
              <div className="w-full rounded-full h-3" style={{ background: 'var(--bg-tertiary)' }}>
                <div
                  className="h-3 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: 'var(--golden)',
                    width: `${
                      course.modules.reduce((sum, m) => sum + m.lessons.length, 0) > 0
                        ? (completedLessonIds.size /
                            course.modules.reduce((sum, m) => sum + m.lessons.length, 0)) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modules and Lessons */}
      <div className="space-y-6 sm:space-y-8">
        {isAdmin && (
          <div className="flex justify-center sm:justify-end mb-4">
            <AddModuleButton courseId={course.id} />
          </div>
        )}

        {course.modules.map((module, moduleIndex) => (
          <div
            key={module.id}
            className="backdrop-blur rounded-2xl shadow-lg overflow-hidden border border-slate-100 hover:shadow-xl transition-shadow"
            style={{ background: 'var(--bg-primary)' }}
          >
            {/* Module Header */}
            <div className="bg-slate-50 border-l-4 px-4 sm:px-6 py-4 sm:py-5" style={{ borderLeftColor: 'var(--accent)' }}>
              <div className="flex items-start gap-3 justify-between">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <span className="text-2xl flex-shrink-0">📖</span>
                  <div className="flex-1 min-w-0">
                    {isAdmin ? (
                      <ModuleControls
                        moduleId={module.id}
                        initialTitle={module.title}
                        initialDescription={module.description}
                      />
                    ) : (
                      <div>
                        <h2 className="text-lg sm:text-2xl font-bold text-slate-900 break-words">
                          {module.title}
                        </h2>
                        {module.description && (
                          <p className="text-slate-600 text-xs sm:text-sm mt-1 line-clamp-2">
                            {module.description}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {!isAdmin && (
                  <div className="flex-shrink-0 ml-4">
                    {module.lessons.every((lesson) =>
                      completedLessonIds.has(lesson.id)
                    ) ? (
                      <Link
                        href={`/course/module/${module.id}`}
                        className={`inline-block px-4 py-2 font-semibold rounded-lg transition-colors whitespace-nowrap text-sm ${
                          modulesWithHomework.has(module.id)
                            ? 'bg-green-100 text-black hover:bg-green-200'
                            : 'bg-slate-200 text-black hover:bg-slate-300'
                        }`}
                      >
                        {modulesWithHomework.has(module.id)
                          ? '✓ ส่งการบ้านแล้ว'
                          : '→ สรุปโมดูล & การบ้าน'}
                      </Link>
                    ) : (
                      <div className="inline-block px-4 py-2 bg-slate-300 text-slate-600 font-semibold rounded-lg whitespace-nowrap text-sm opacity-60">
                        🔒 ส่งการบ้าน
                      </div>
                    )}
                  </div>
                )}
              </div>

              {isAdmin && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end gap-3 sm:gap-4 mt-4">
                  <Link
                    href={`/course/module/${module.id}`}
                    className="px-4 py-2 bg-slate-200 text-black font-semibold rounded-lg hover:bg-slate-300 transition-colors whitespace-nowrap text-sm"
                  >
                    📝 แก้ไขการบ้าน
                  </Link>
                </div>
              )}
            </div>

            {/* Lessons List */}
            <div className="divide-y">
              {module.lessons.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  <p>ยังไม่มีบทเรียนในโมดูลนี้</p>
                  {isAdmin && (
                    <div className="mt-4">
                      <AddLessonButton moduleId={module.id} />
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {module.lessons.map((lesson, lessonIndex) => {
                  const isCompleted = completedLessonIds.has(lesson.id);
                  const isLocked = isLessonLocked(
                    lessonIndex,
                    moduleIndex,
                    completedLessonIds,
                    course.modules,
                    modulesWithHomework
                  );

                  return (
                    <div
                      key={lesson.id}
                      className={`px-4 sm:px-6 py-5 sm:py-6 transition-colors ${
                        isLocked ? 'bg-slate-50' : ''
                      } border-b border-slate-100 last:border-b-0`}
                    >
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                        <div className="flex-1 min-w-0 w-full">
                          <div className="flex items-start gap-3 mb-2">
                            <span
                              className={`text-2xl flex-shrink-0 ${
                                isCompleted ? '✅' : isLocked ? '🔒' : '📝'
                              }`}
                            />
                            <h3 className="text-base sm:text-lg font-semibold text-slate-900 break-words">
                              บทเรียน {lessonIndex + 1}: {lesson.title}
                            </h3>
                          </div>

                          {lesson.description && (
                            <p className="text-slate-600 text-sm sm:ml-8 line-clamp-2">
                              {lesson.description}
                            </p>
                          )}

                          {/* Status Badge */}
                          <div className="mt-3 sm:ml-8 flex items-center gap-2 flex-wrap">
                            {isCompleted && (
                              <span className="inline-flex items-center gap-1 bg-green-100 text-black text-xs font-semibold px-3 py-1 rounded-full">
                                ✓ เรียนจบแล้ว
                              </span>
                            )}
                            {!isCompleted && isLocked && (
                              <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-1 rounded-full">
                                🔒 ยังไม่เปิด
                              </span>
                            )}
                            {!isCompleted && !isLocked && (
                              <span className="inline-flex items-center gap-1 bg-yellow-100 text-black text-xs font-semibold px-3 py-1 rounded-full">
                                → ยังไม่จบ
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
                          {isAdmin ? (
                            <>
                              <Link
                                href={`/course/lesson/${lesson.id}`}
                                className="flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-lg bg-slate-200 text-black font-semibold hover:bg-slate-300 transition-all text-xs sm:text-sm text-center"
                              >
                                ✏️ แก้ไข
                              </Link>
                              <LessonDeleteButton
                                lessonId={lesson.id}
                                lessonTitle={lesson.title}
                              />
                            </>
                          ) : isLocked ? (
                            <button
                              disabled
                              className="flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-lg bg-slate-300 text-black font-semibold cursor-not-allowed text-xs sm:text-sm text-center opacity-60"
                            >
                              🔒 ไม่อนุญาต
                            </button>
                          ) : (
                            <Link
                              href={`/course/lesson/${lesson.id}`}
                              className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-lg font-semibold transition-all text-xs sm:text-sm text-center ${
                                isCompleted
                                  ? 'bg-slate-100 text-black hover:bg-slate-200'
                                  : 'bg-yellow-100 text-black hover:bg-yellow-200'
                              }`}
                            >
                              {isCompleted ? 'ทบทวน' : 'เริ่ม'}
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                  })}
                  {isAdmin && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                      <AddLessonButton moduleId={module.id} />
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Module Footer Stats */}
            <div className="bg-slate-50 px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-slate-600">
              <span className="font-semibold">
                {module.lessons.filter((l) =>
                  completedLessonIds.has(l.id)
                ).length}{' '}
                / {module.lessons.length} บทเรียนเสร็จสิ้น
              </span>
              <div className="w-full sm:flex-1 sm:mx-4 bg-slate-300 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: 'var(--accent)',
                    width: `${
                      module.lessons.length > 0
                        ? (module.lessons.filter((l) =>
                            completedLessonIds.has(l.id)
                          ).length / module.lessons.length) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Completion Encouragement */}
      {(isAdmin || (completedLessonIds.size === course.modules.reduce((sum, m) => sum + m.lessons.length, 0))) && course.modules.length > 0 && (
        <>
          <CompletionMessageEditor
            courseId={course.id}
            initialTitle={course.completion_title || 'ยินดีด้วย!'}
            initialMessage={
              course.completion_message
                ? course.completion_message.replace('{course_title}', course.title)
                : `คุณเสร็จสิ้นการเรียนคอร์ส ${course.title} แล้ว 🌟`
            }
            isAdmin={isAdmin}
          />
          {!isAdmin && (
            <div className="mt-6 text-center">
              <Link
                href="/certificate"
                className="inline-block px-6 sm:px-8 py-3 text-black font-semibold rounded-lg transition-all text-sm sm:text-base"
                style={{ backgroundColor: 'var(--golden)' }}
              >
                ดูใบรับรองของฉัน
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
