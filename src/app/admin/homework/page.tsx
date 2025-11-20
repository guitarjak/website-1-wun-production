import { requireAdmin } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import HomeworkList from './HomeworkList';
import FilterSection from './FilterSection';

export type Submission = {
  id: string;
  lesson_id: string;
  user_id: string;
  submission_text: string | null;
  submitted_at: string;
  feedback: string | null;
  status: 'SUBMITTED' | 'REVIEWED' | 'APPROVED';
  full_name: string | null;
  email: string | null;
  lesson_title: string;
};

async function fetchSubmissions(lessonFilter?: string, statusFilter?: string): Promise<Submission[]> {
  const supabase = await createSupabaseServerClient();

  // Build the query with joins
  let query = supabase
    .from('homework_submissions')
    .select(
      `id,
       lesson_id,
       user_id,
       submission_text,
       submitted_at,
       feedback,
       status,
       users_profile!homework_submissions_user_id_fkey(full_name, email),
       lessons!homework_submissions_lesson_id_fkey(id, title)`
    )
    .order('submitted_at', { ascending: false });

  // Apply filters if provided
  if (lessonFilter && lessonFilter !== 'all') {
    query = query.eq('lesson_id', lessonFilter);
  }

  if (statusFilter && statusFilter !== 'all') {
    query = query.eq('status', statusFilter);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch submissions: ${error.message}`);
  }

  if (!data || data.length === 0) {
    return [];
  }

  // Transform the data to flat structure
  const submissions: Submission[] = data.map((item: any) => ({
    id: item.id,
    lesson_id: item.lesson_id,
    user_id: item.user_id,
    submission_text: item.submission_text,
    submitted_at: item.submitted_at,
    feedback: item.feedback,
    status: item.status,
    full_name: item.users_profile?.full_name || null,
    email: item.users_profile?.email || null,
    lesson_title: item.lessons?.title || 'Unknown Lesson',
  }));

  return submissions;
}

async function fetchAllLessons() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('lessons')
    .select('id, title')
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch lessons: ${error.message}`);
  }

  return data || [];
}

interface PageProps {
  searchParams: Promise<{
    lesson?: string;
    status?: string;
  }>;
}

export default async function AdminHomeworkPage({ searchParams }: PageProps) {
  // Ensure user is admin
  await requireAdmin();

  const params = await searchParams;
  const lessonFilter = params.lesson;
  const statusFilter = params.status;

  const [submissions, lessons] = await Promise.all([
    fetchSubmissions(lessonFilter, statusFilter),
    fetchAllLessons(),
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">ตรวจการบ้าน</h1>
          <p className="text-gray-600">
            จำนวนการบ้านทั้งหมด {submissions.length} งาน
          </p>
        </div>

        {/* Filters */}
        <FilterSection lessons={lessons} />

        {/* Submissions List */}
        {submissions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center text-gray-500">
            ไม่พบการบ้านที่ตรงกับเงื่อนไขการค้นหา
          </div>
        ) : (
          <HomeworkList submissions={submissions} />
        )}
      </div>
    </div>
  );
}
