import Link from 'next/link';
import { getCurrentUserWithProfile } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { HomeworkForm } from './HomeworkForm';
import HomeworkInstructionsInlineEditor from './HomeworkInstructionsInlineEditor';

interface Lesson {
  id: string;
  title: string;
  order: number;
}

interface Module {
  id: string;
  title: string;
  description: string | null;
  order: number;
  course_id: string;
}

interface Course {
  id: string;
  title: string;
}

interface LessonProgress {
  lesson_id: string;
  completed: boolean;
}

interface HomeworkSubmission {
  id: string;
  submission_text: string;
  feedback: string | null;
  submitted_at: string;
  grade: number | null;
  graded_at: string | null;
  status: 'SUBMITTED' | 'REVIEWED' | 'APPROVED';
}

async function getModuleData(moduleId: string) {
  const supabase = await createSupabaseServerClient();

  // Fetch the module
  const { data: module, error: moduleError } = await supabase
    .from('modules')
    .select('id, title, description, "order", course_id, homework_instructions')
    .eq('id', moduleId)
    .single();

  if (moduleError || !module) {
    return { module: null, course: null, lessons: [], error: 'Module not found' };
  }

  // Fetch the parent course
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select('id, title')
    .eq('id', module.course_id)
    .single();

  if (courseError || !course) {
    return {
      module,
      course: null,
      lessons: [],
      error: 'Course not found',
    };
  }

  // Fetch all lessons in this module ordered by order ASC
  const { data: lessons, error: lessonsError } = await supabase
    .from('lessons')
    .select('id, title, "order"')
    .eq('module_id', moduleId)
    .order('order', { ascending: true });

  if (lessonsError) {
    return { module, course, lessons: [], error: null };
  }

  return {
    module,
    course,
    lessons: lessons || [],
    error: null,
  };
}

async function getUserProgress(
  userId: string,
  lessonIds: string[]
): Promise<Map<string, LessonProgress>> {
  const supabase = await createSupabaseServerClient();

  if (lessonIds.length === 0) {
    return new Map();
  }

  const { data: progress, error } = await supabase
    .from('lesson_progress')
    .select('lesson_id, completed')
    .eq('user_id', userId)
    .in('lesson_id', lessonIds);

  if (error || !progress) {
    return new Map();
  }

  return new Map((progress as Array<{ lesson_id: string; completed: boolean }>).map((p) => [p.lesson_id, p]));
}

async function getLatestHomeworkSubmission(
  userId: string,
  moduleId: string
): Promise<HomeworkSubmission | null> {
  const supabase = await createSupabaseServerClient();

  // Get all lesson IDs for this module first
  const { data: lessons, error: lessonsError } = await supabase
    .from('lessons')
    .select('id')
    .eq('module_id', moduleId);

  if (lessonsError || !lessons || lessons.length === 0) {
    return null;
  }

  const lessonIds = (lessons as Array<{ id: string }>).map((l) => l.id);

  const { data: submissions, error } = await supabase
    .from('homework_submissions')
    .select(
      'id, submission_text, feedback, submitted_at, grade, graded_at, status'
    )
    .eq('user_id', userId)
    .in('lesson_id', lessonIds)
    .order('submitted_at', { ascending: false })
    .limit(1);

  if (error || !submissions || submissions.length === 0) {
    return null;
  }

  return submissions[0] as HomeworkSubmission;
}

function getStatusBadge(submission: HomeworkSubmission): { label: string; color: string } {
  switch (submission.status) {
    case 'SUBMITTED':
      return { label: 'รอตรวจ', color: 'bg-yellow-100 text-yellow-800' };
    case 'REVIEWED':
      return { label: 'ตรวจแล้ว', color: 'bg-blue-100 text-blue-800' };
    case 'APPROVED':
      return { label: 'ผ่านแล้ว', color: 'bg-green-100 text-green-800' };
    default:
      return { label: 'รอตรวจ', color: 'bg-yellow-100 text-yellow-800' };
  }
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const user = await getCurrentUserWithProfile();
  const { moduleId } = await params;
  const isAdmin = user?.profile?.role === 'ADMIN';

  const { module, course, lessons, error } = await getModuleData(moduleId);

  if (error || !module || !course) {
    return (
      <div className="min-h-screen py-12 px-4" style={{ backgroundColor: '#efe3d4' }}>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center" style={{ borderColor: 'var(--border-light)' }}>
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              ไม่พบโมดูล
            </h1>
            <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>{error || 'เกิดข้อผิดพลาดในการดึงข้อมูล'}</p>
            <Link
              href="/course"
              className="inline-block px-6 py-3 text-white font-semibold rounded-lg transition-all hover:opacity-90"
              style={{ background: 'var(--golden)' }}
            >
              กลับไปหน้าคอร์ส
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get user progress
  const lessonIds = (lessons as Array<{ id: string; title: string; order: number }>).map((l) => l.id);
  const userProgress = await getUserProgress(user!.user.id, lessonIds);

  // Get latest homework submission
  const homeworkSubmission = await getLatestHomeworkSubmission(
    user!.user.id,
    moduleId
  );

  // Calculate completion stats
  const completedLessons = lessons.filter((l) => {
    const progress = userProgress.get(l.id);
    return progress?.completed === true;
  }).length;

  const completionPercentage =
    lessons.length > 0 ? Math.round((completedLessons / lessons.length) * 100) : 0;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#efe3d4' }}>
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <Link
            href="/course"
            className="hover:underline"
            style={{ color: 'var(--blue)' }}
          >
            คอร์สเรียน
          </Link>
          <span>/</span>
          <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{module.title}</span>
        </nav>

        {/* Module Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8" style={{ borderColor: 'var(--border-light)' }}>
          <div className="mb-4">
            <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>{course.title}</p>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
              {module.title}
            </h1>
            {module.description && (
              <p className="text-base sm:text-lg" style={{ color: 'var(--text-secondary)' }}>{module.description}</p>
            )}
          </div>

          {/* Progress Summary */}
          <div className="mt-6 pt-6" style={{ borderTop: '1px solid var(--border-light)' }}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  ความก้าวหน้าในโมดูล
                </p>
                <p className="text-2xl font-bold" style={{ color: 'var(--golden)' }}>
                  {completedLessons} / {lessons.length} บทเรียน
                </p>
              </div>
              <div className="flex-1">
                <div className="w-full rounded-full h-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <div
                    className="h-4 rounded-full transition-all duration-300"
                    style={{ backgroundColor: 'var(--golden)', width: `${completionPercentage}%` }}
                  />
                </div>
              </div>
              <div className="text-2xl font-bold" style={{ color: 'var(--golden)' }}>
                {completionPercentage}%
              </div>
            </div>
          </div>
        </div>

        {/* Lessons Summary */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8" style={{ borderColor: 'var(--border-light)' }}>
          <div className="px-6 py-4 text-white flex items-center gap-2" style={{ background: 'var(--blue)' }}>
            <span>📚</span>
            <h2 className="text-xl font-bold">บทเรียนในโมดูลนี้</h2>
          </div>

          {lessons.length === 0 ? (
            <div className="px-6 py-8 text-center" style={{ color: 'var(--text-tertiary)' }}>
              <p>ยังไม่มีบทเรียนในโมดูลนี้</p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: 'var(--border-light)' }}>
              {lessons.map((lesson, index) => {
                const progress = userProgress.get(lesson.id);
                const isCompleted = progress?.completed === true;

                return (
                  <div key={lesson.id} className="px-6 py-4 hover:opacity-95 transition-colors" style={{ backgroundColor: 'transparent' }}>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className={`text-2xl ${isCompleted ? '✅' : '📝'}`} />
                          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                            บทเรียน {index + 1}: {lesson.title}
                          </h3>
                        </div>
                        <div className="mt-2 ml-8">
                          {isCompleted ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full text-white" style={{ backgroundColor: '#10b981' }}>
                              ✓ เรียนจบแล้ว
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full text-white" style={{ backgroundColor: 'var(--golden)' }}>
                              → ยังไม่จบ
                            </span>
                          )}
                        </div>
                      </div>
                      <Link
                        href={`/course/lesson/${lesson.id}`}
                        className="px-4 py-2 font-semibold rounded-lg transition-all hover:opacity-90 text-sm text-white"
                        style={{ background: 'var(--golden)' }}
                      >
                        {isCompleted ? 'ทบทวน' : 'เรียน'}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Homework Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8" style={{ borderColor: 'var(--border-light)' }}>
          <div className="px-6 py-4 text-white flex items-center gap-2" style={{ background: 'var(--blue)' }}>
            <span>📝</span>
            <h2 className="text-xl font-bold">การบ้านของโมดูลนี้</h2>
          </div>

          <div className="p-6">
            {/* Homework Instructions Editor/Preview */}
            {isAdmin ? (
              <HomeworkInstructionsInlineEditor
                moduleId={moduleId}
                currentInstructions={
                  module?.homework_instructions ||
                  '💡 คุณสามารถส่งลิงก์ Google Docs, Notion, GitHub, หรือคำตอบแบบตัวหนังสือก็ได้'
                }
              />
            ) : (
              <div className="mb-6 p-4 rounded-lg border" style={{ backgroundColor: 'rgba(74, 113, 246, 0.05)', borderColor: 'var(--blue)' }}>
                <p className="text-xs font-semibold mb-2" style={{ color: 'var(--blue)' }}>📋 คำแนะนำการบ้าน:</p>
                <div
                  className="text-sm max-w-none leading-relaxed
                    [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:my-2
                    [&_h2]:text-xl [&_h2]:font-bold [&_h2]:my-2
                    [&_p]:my-1
                    [&_ul]:list-disc [&_ul]:ml-6
                    [&_ol]:list-decimal [&_ol]:ml-6
                    [&_li]:my-1
                    [&_strong]:font-bold
                    [&_em]:italic
                    [&_s]:line-through"
                  style={{ color: 'var(--text-secondary)' }}
                  dangerouslySetInnerHTML={{
                    __html: module?.homework_instructions ||
                      '💡 คุณสามารถส่งลิงก์ Google Docs, Notion, GitHub, หรือคำตอบแบบตัวหนังสือก็ได้',
                  }}
                />
              </div>
            )}

            {/* Previous Submission */}
            {homeworkSubmission && (
              <div className="mb-8 p-6 rounded-lg border" style={{ backgroundColor: '#f9fafb', borderColor: 'var(--border-light)' }}>
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                    การส่งครั้งล่าสุด
                  </h3>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full text-white`}
                    style={{
                      background: homeworkSubmission.status === 'APPROVED' ? '#10b981' :
                               homeworkSubmission.status === 'REVIEWED' ? 'var(--blue)' :
                               'var(--golden)',
                    }}
                  >
                    {getStatusBadge(homeworkSubmission).label}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                    ส่งเมื่อ: {new Date(homeworkSubmission.submitted_at).toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <div className="bg-white p-4 rounded border" style={{ borderColor: 'var(--border-light)', color: 'var(--text-primary)' }}>
                    <p className="whitespace-pre-wrap">
                      {homeworkSubmission.submission_text}
                    </p>
                  </div>
                </div>

                {homeworkSubmission.feedback && (
                  <div className="p-4 rounded border" style={{ backgroundColor: 'rgba(74, 113, 246, 0.05)', borderColor: 'var(--blue)' }}>
                    <p className="text-sm font-semibold mb-2" style={{ color: 'var(--blue)' }}>
                      💬 ความคิดเห็นจากผู้สอน
                    </p>
                    <p className="whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>
                      {homeworkSubmission.feedback}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Homework Form - Hidden if approved */}
            {!homeworkSubmission || homeworkSubmission.status !== 'APPROVED' && (
              <div className="p-6 rounded-lg border" style={{ backgroundColor: 'rgba(74, 113, 246, 0.05)', borderColor: 'var(--blue)' }}>
                <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  {homeworkSubmission && homeworkSubmission.status !== 'APPROVED' ? '✏️ แก้ไขการบ้าน' : 'ส่งการบ้าน'}
                </h3>
                <HomeworkForm moduleId={moduleId} existingSubmission={homeworkSubmission} />
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex gap-4">
          <Link
            href="/course"
            className="flex-1 px-6 py-3 text-white font-semibold rounded-lg transition-all hover:opacity-90 text-center"
            style={{ background: '#9ca3af' }}
          >
            ← กลับไปหน้าคอร์ส
          </Link>
        </div>
      </div>
    </div>
  );
}
