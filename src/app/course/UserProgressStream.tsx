import { createSupabaseServerClient } from '@/lib/supabaseServer';

interface Module {
  id: string;
  lessons: { id: string; module_id: string }[];
}

interface UserProgressStreamProps {
  userId: string;
  modules: Module[];
}

export default async function UserProgressStream({ userId, modules }: UserProgressStreamProps) {
  const supabase = await createSupabaseServerClient();

  // Build lesson to module map
  const lessonToModule = new Map<string, string>();
  const lessonIds: string[] = [];
  for (const module of modules) {
    for (const lesson of module.lessons) {
      lessonToModule.set(lesson.id, module.id);
      lessonIds.push(lesson.id);
    }
  }

  if (lessonIds.length === 0) {
    return (
      <script
        dangerouslySetInnerHTML={{
          __html: `window.__userProgress={completedLessonIds:[],modulesWithHomework:[]};window.dispatchEvent(new CustomEvent('userProgressLoaded',{detail:window.__userProgress}));`
        }}
      />
    );
  }

  // Fetch progress and homework in parallel
  const [progressResult, homeworkResult] = await Promise.all([
    supabase
      .from('lesson_progress')
      .select('lesson_id')
      .eq('user_id', userId)
      .eq('completed', true)
      .in('lesson_id', lessonIds),
    supabase
      .from('homework_submissions')
      .select('lesson_id')
      .eq('user_id', userId)
      .in('lesson_id', lessonIds)
  ]);

  const completedLessonIds = (progressResult.data || []).map((p: { lesson_id: string }) => p.lesson_id);

  // Map homework submissions to module IDs
  const modulesWithHomework = Array.from(
    new Set(
      (homeworkResult.data || [])
        .map((s: { lesson_id: string }) => lessonToModule.get(s.lesson_id))
        .filter((m): m is string => !!m)
    )
  );

  const progressData = JSON.stringify({ completedLessonIds, modulesWithHomework });

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `window.__userProgress=${progressData};window.dispatchEvent(new CustomEvent('userProgressLoaded',{detail:window.__userProgress}));`
      }}
    />
  );
}
