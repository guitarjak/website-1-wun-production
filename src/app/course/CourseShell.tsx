'use client';

import Link from 'next/link';
import { useEffect, useLayoutEffect, useState } from 'react';
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

interface UserProgress {
  completedLessonIds: string[];
  modulesWithHomework: string[];
}

interface CourseShellProps {
  course: Course;
  isAdmin: boolean;
  initialProgress?: UserProgress;
}

function isLessonLocked(
  lessonIndex: number,
  moduleIndex: number,
  completedLessonIds: Set<string>,
  modules: Module[],
  modulesWithHomework: Set<string>
): boolean {
  if (moduleIndex === 0 && lessonIndex === 0) return false;

  if (lessonIndex > 0) {
    const previousLesson = modules[moduleIndex].lessons[lessonIndex - 1];
    if (previousLesson && completedLessonIds.has(previousLesson.id)) return false;
  }

  if (lessonIndex === 0 && moduleIndex > 0) {
    const previousModule = modules[moduleIndex - 1];
    const allPreviousLessonsCompleted = previousModule.lessons.every(
      (lesson) => completedLessonIds.has(lesson.id)
    );
    const previousHomeworkSubmitted = modulesWithHomework.has(previousModule.id);
    if (allPreviousLessonsCompleted && previousHomeworkSubmitted) return false;
  }

  return true;
}

export default function CourseShell({ course, isAdmin, initialProgress }: CourseShellProps) {
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(
    new Set(initialProgress?.completedLessonIds || [])
  );
  const [modulesWithHomework, setModulesWithHomework] = useState<Set<string>>(
    new Set(initialProgress?.modulesWithHomework || [])
  );
  const [progressLoaded, setProgressLoaded] = useState(!!initialProgress);

  // Use layout effect to synchronously set up listener and check for existing data before paint
  useLayoutEffect(() => {
    // Listen for streamed progress data
    const handleProgress = (event: CustomEvent<UserProgress>) => {
      setCompletedLessonIds(new Set(event.detail.completedLessonIds));
      setModulesWithHomework(new Set(event.detail.modulesWithHomework));
      setProgressLoaded(true);
    };

    // Set up listener FIRST
    window.addEventListener('userProgressLoaded', handleProgress as EventListener);

    // Then check if progress was already loaded before listener was set up
    const existingProgress = (window as unknown as { __userProgress?: UserProgress }).__userProgress;
    if (existingProgress) {
      setCompletedLessonIds(new Set(existingProgress.completedLessonIds));
      setModulesWithHomework(new Set(existingProgress.modulesWithHomework));
      setProgressLoaded(true);
    }

    return () => {
      window.removeEventListener('userProgressLoaded', handleProgress as EventListener);
    };
  }, []);

  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const completedCount = completedLessonIds.size;
  const allCompleted = completedCount === totalLessons && totalLessons > 0;

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
                {progressLoaded ? (
                  <>{completedCount} / {totalLessons} บทเรียน</>
                ) : (
                  <span className="inline-block h-8 w-32 bg-slate-200 rounded animate-pulse" />
                )}
              </p>
            </div>
            <div className="w-full">
              <div className="w-full rounded-full h-3" style={{ background: 'var(--bg-tertiary)' }}>
                <div
                  className="h-3 rounded-full transition-all duration-500"
                  style={{
                    backgroundColor: 'var(--golden)',
                    width: progressLoaded && totalLessons > 0
                      ? `${(completedCount / totalLessons) * 100}%`
                      : '0%',
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

        {course.modules.map((module, moduleIndex) => {
          const moduleLessonsCompleted = module.lessons.filter((l) => completedLessonIds.has(l.id)).length;
          const allModuleLessonsCompleted = moduleLessonsCompleted === module.lessons.length && module.lessons.length > 0;

          return (
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
                      {progressLoaded ? (
                        allModuleLessonsCompleted ? (
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
                        )
                      ) : (
                        <div className="inline-block px-4 py-2 bg-slate-200 rounded-lg w-28 h-9 animate-pulse" />
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
                      const isLocked = !isAdmin && progressLoaded && isLessonLocked(
                        lessonIndex,
                        moduleIndex,
                        completedLessonIds,
                        course.modules,
                        modulesWithHomework
                      );
                      // Before progress loads, show optimistic unlocked state for first lesson of each module
                      const showAsUnlocked = !progressLoaded && (lessonIndex === 0 || moduleIndex === 0);

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
                                <span className="text-2xl flex-shrink-0">
                                  {progressLoaded
                                    ? (isCompleted ? '✅' : isLocked ? '🔒' : '📝')
                                    : '📝'}
                                </span>
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
                                {progressLoaded ? (
                                  <>
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
                                  </>
                                ) : (
                                  <span className="inline-block h-6 w-20 bg-slate-200 rounded-full animate-pulse" />
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
                              ) : progressLoaded ? (
                                isLocked ? (
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
                                )
                              ) : showAsUnlocked ? (
                                <Link
                                  href={`/course/lesson/${lesson.id}`}
                                  className="flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-lg bg-yellow-100 text-black font-semibold hover:bg-yellow-200 transition-all text-xs sm:text-sm text-center"
                                >
                                  เริ่ม
                                </Link>
                              ) : (
                                <div className="flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-lg bg-slate-200 h-9 w-20 animate-pulse" />
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
                  {progressLoaded ? (
                    <>{moduleLessonsCompleted} / {module.lessons.length} บทเรียนเสร็จสิ้น</>
                  ) : (
                    <span className="inline-block h-4 w-32 bg-slate-200 rounded animate-pulse" />
                  )}
                </span>
                <div className="w-full sm:flex-1 sm:mx-4 bg-slate-300 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      backgroundColor: 'var(--accent)',
                      width: progressLoaded && module.lessons.length > 0
                        ? `${(moduleLessonsCompleted / module.lessons.length) * 100}%`
                        : '0%',
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Encouragement */}
      {(isAdmin || allCompleted) && course.modules.length > 0 && (
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
