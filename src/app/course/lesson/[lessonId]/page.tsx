import Link from 'next/link';
import { requireUser } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { MarkLessonCompleteButton } from './MarkLessonCompleteButton';
import LessonTitleDescriptionEditor from './LessonTitleDescriptionEditor';
import VideoEmbedEditor from './VideoEmbedEditor';
import LessonContentEditor from './LessonContentEditor';

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  video_embed: string | null;
  order: number;
  module_id: string;
}

interface Module {
  id: string;
  title: string;
  description: string | null;
  order: number;
}

interface LessonProgress {
  lesson_id: string;
  completed: boolean;
  completed_at: string | null;
}

async function getLessonData(lessonId: string) {
  const supabase = await createSupabaseServerClient();

  // Fetch the lesson
  const { data: lesson, error: lessonError } = await supabase
    .from('lessons')
    .select('id, title, description, content, video_embed, order, module_id')
    .eq('id', lessonId)
    .single();

  if (lessonError || !lesson) {
    return { lesson: null, module: null, error: 'Lesson not found' };
  }

  // Fetch the parent module
  const { data: module, error: moduleError } = await supabase
    .from('modules')
    .select('id, title, description, "order"')
    .eq('id', lesson.module_id)
    .single();

  if (moduleError || !module) {
    return { lesson, module: null, error: 'Module not found' };
  }

  // Fetch all lessons in this module ordered by order ASC
  const { data: moduleLessons, error: moduleLessonsError } = await supabase
    .from('lessons')
    .select('id, title, order')
    .eq('module_id', module.id)
    .order('order', { ascending: true });

  if (moduleLessonsError) {
    return { lesson, module, moduleLessons: [], error: null };
  }

  return { lesson, module, moduleLessons: moduleLessons || [], error: null };
}

async function getUserProgress(
  userId: string,
  moduleLessonIds: string[]
): Promise<Map<string, LessonProgress>> {
  const supabase = await createSupabaseServerClient();

  const { data: progress, error } = await supabase
    .from('lesson_progress')
    .select('lesson_id, completed, completed_at')
    .eq('user_id', userId)
    .in('lesson_id', moduleLessonIds);

  if (error || !progress) {
    return new Map();
  }

  return new Map(progress.map((p) => [p.lesson_id, p]));
}

/**
 * Check if a lesson is unlocked based on sequential progress
 */
function isLessonUnlocked(
  currentLessonOrder: number,
  moduleLessons: Array<{ id: string; order: number }>,
  userProgress: Map<string, LessonProgress>
): boolean {
  // First lesson in module is always unlocked
  if (currentLessonOrder === 1) {
    return true;
  }

  // For subsequent lessons, check if previous lesson is completed
  const previousLesson = moduleLessons.find(
    (l) => l.order === currentLessonOrder - 1
  );

  if (!previousLesson) {
    return false;
  }

  const previousProgress = userProgress.get(previousLesson.id);
  return previousProgress?.completed === true;
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const user = await requireUser();
  const { lessonId } = await params;
  const isAdmin = user.profile.role === 'ADMIN';

  const { lesson, module, moduleLessons, error } = await getLessonData(
    lessonId
  );

  if (error || !lesson || !module) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              ไม่พบบทเรียน
            </h1>
            <p className="text-gray-600 mb-6">{error || 'เกิดข้อผิดพลาดในการดึงข้อมูล'}</p>
            <Link
              href="/course"
              className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
            >
              กลับไปหน้าคอร์ส
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get user progress
  const moduleLessonIds = moduleLessons.map((l) => l.id);
  const userProgress = await getUserProgress(user!.user.id, moduleLessonIds);

  // Check if current lesson is unlocked
  const isUnlocked = isLessonUnlocked(
    lesson.order,
    moduleLessons,
    userProgress
  );

  // Check if lesson is already completed
  const lessonProgress = userProgress.get(lessonId);
  const isCompleted = lessonProgress?.completed === true;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-600">
          <Link
            href="/course"
            className="hover:text-indigo-600 transition-colors"
          >
            คอร์สเรียน
          </Link>
          <span>/</span>
          <span>{module.title}</span>
          <span>/</span>
          <span className="text-gray-900 font-semibold">{lesson.title}</span>
        </nav>

        {/* Locked State (only for students) */}
        {!isAdmin && !isUnlocked && (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-8 text-center mb-8">
            <div className="text-5xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-yellow-900 mb-2">
              บทเรียนนี้ยังไม่เปิด
            </h2>
            <p className="text-yellow-800 mb-6">
              คุณยังไม่สามารถเข้าเรียนบทเรียนนี้ได้
              <br />
              กรุณาเรียนบทเรียนก่อนหน้านี้ให้จบก่อน
            </p>
            <Link
              href="/course"
              className="inline-block px-6 py-3 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition-colors"
            >
              ← กลับไปหน้าคอร์ส
            </Link>
          </div>
        )}

        {/* Content (admins always see it, students only if unlocked) */}
        {isAdmin || isUnlocked ? (
          <>
            {/* Lesson Header */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              {isAdmin ? (
                <LessonTitleDescriptionEditor
                  lessonId={lessonId}
                  initialTitle={lesson.title}
                  initialDescription={lesson.description}
                />
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                      {lesson.title}
                    </h1>
                    <p className="text-gray-600 text-lg mb-4">{module.title}</p>
                    {lesson.description && (
                      <p className="text-gray-700 text-base leading-relaxed">
                        {lesson.description}
                      </p>
                    )}
                  </div>
                  {isCompleted && (
                    <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full whitespace-nowrap">
                      <span>✓</span>
                      <span className="font-semibold">เรียนจบแล้ว</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Video Section */}
            {isAdmin ? (
              <VideoEmbedEditor
                lessonId={lessonId}
                initialEmbed={lesson.video_embed}
              />
            ) : (
              lesson.video_embed && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                  <div className="aspect-video relative w-full">
                    <div
                      dangerouslySetInnerHTML={{ __html: lesson.video_embed }}
                      className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0"
                    />
                  </div>
                </div>
              )
            )}

            {/* Lesson Content */}
            {isAdmin ? (
              <LessonContentEditor
                lessonId={lessonId}
                initialContent={lesson.content}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 mb-8" style={{ borderColor: 'var(--border-light)' }}>
                <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                  เนื้อหาบทเรียน
                </h2>
                {lesson.content ? (
                  <div
                    className="max-w-none leading-relaxed [&_p]:my-3 [&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6 [&_li]:my-1"
                    style={{ color: 'var(--text-secondary)' }}
                    dangerouslySetInnerHTML={{ __html: lesson.content }}
                  />
                ) : (
                  <p className="italic" style={{ color: 'var(--text-tertiary)' }}>ไม่มีเนื้อหาเพิ่มเติม</p>
                )}
              </div>
            )}

            {/* Completion Section (only for students) */}
            {!isAdmin && (
              <div className="rounded-lg p-8 mb-8" style={{ background: 'var(--golden-lighter)', borderLeft: '4px solid var(--golden)' }}>
                <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  ✓ ยืนยันว่าคุณเรียนจบแล้ว
                </h3>
                <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
                  เมื่อคุณเรียนจบบทเรียนนี้แล้ว โปรดคลิกปุ่มด้านล่างเพื่อบันทึกความก้าวหน้า
                </p>
                <MarkLessonCompleteButton
                  lessonId={lessonId}
                  isCompleted={isCompleted}
                  nextLessonId={
                    moduleLessons.find((l) => l.order === lesson.order + 1)?.id
                  }
                />
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-4">
              <Link
                href="/course"
                className="flex-1 px-6 py-3 text-white font-semibold rounded-lg transition-all hover:opacity-90 text-center"
                style={{
                  background: '#4b5563',
                  color: 'white',
                }}
              >
                ← กลับไปหน้าคอร์ส
              </Link>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
