import { createSupabaseServerClient } from './supabaseServer';
import { createClient } from '@supabase/supabase-js';

export type CertificateEligibilityResult = {
  eligible: boolean;
  missingLessonsCount: number;
  missingModulesCount: number;
  totalLessonsCount: number;
  totalModulesCount: number;
};

/**
 * Check if a user is eligible for a certificate.
 *
 * A user is eligible if:
 * 1) They have completed ALL lessons in the main course
 * 2) They have at least ONE homework submission for each module
 *
 * @param userId - The user ID to check
 * @returns Certificate eligibility result with detailed counts
 */
export async function checkCertificateEligibility(
  userId: string
): Promise<CertificateEligibilityResult> {
  const supabase = await createSupabaseServerClient();

  // Get the first course (main course)
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select('id, title')
    .limit(1)
    .single();

  if (courseError || !course) {
    return {
      eligible: false,
      missingLessonsCount: 0,
      missingModulesCount: 0,
      totalLessonsCount: 0,
      totalModulesCount: 0,
    };
  }

  // Get all modules for this course
  const { data: modules, error: modulesError } = await supabase
    .from('modules')
    .select('id')
    .eq('course_id', course.id);

  if (modulesError || !modules) {
    return {
      eligible: false,
      missingLessonsCount: 0,
      missingModulesCount: 0,
      totalLessonsCount: 0,
      totalModulesCount: 0,
    };
  }

  const totalModulesCount = modules.length;

  // Get all lessons for this course
  const { data: lessons, error: lessonsError } = await supabase
    .from('lessons')
    .select('id, module_id')
    .in(
      'module_id',
      (modules as Array<{ id: string }>).map((m) => m.id)
    );

  if (lessonsError || !lessons) {
    return {
      eligible: false,
      missingLessonsCount: 0,
      missingModulesCount: 0,
      totalLessonsCount: 0,
      totalModulesCount: 0,
    };
  }

  const totalLessonsCount = lessons.length;

  // Get user's completed lessons
  const { data: completedProgress, error: progressError } = await supabase
    .from('lesson_progress')
    .select('lesson_id')
    .eq('user_id', userId)
    .eq('completed', true);

  if (progressError) {
    return {
      eligible: false,
      missingLessonsCount: totalLessonsCount,
      missingModulesCount: totalModulesCount,
      totalLessonsCount,
      totalModulesCount,
    };
  }

  const completedLessonIds = new Set(
    (completedProgress || [] as Array<{ lesson_id: string }>).map((p) => p.lesson_id)
  );
  const missingLessonsCount = totalLessonsCount - completedLessonIds.size;

  // Check if all lessons are completed
  if (missingLessonsCount > 0) {
    return {
      eligible: false,
      missingLessonsCount,
      missingModulesCount: totalModulesCount,
      totalLessonsCount,
      totalModulesCount,
    };
  }

  // Check homework submission for each module
  // Batch query: Get all homework submissions for user across all modules in ONE query
  const { data: userSubmissions, error: submissionsError } = await supabase
    .from('homework_submissions')
    .select('lesson_id')
    .eq('user_id', userId);

  if (submissionsError) {
    return {
      eligible: false,
      missingLessonsCount,
      missingModulesCount: totalModulesCount,
      totalLessonsCount,
      totalModulesCount,
    };
  }

  // Create a set of submitted lesson IDs for O(1) lookup
  const submittedLessonIds = new Set(
    (userSubmissions || [] as Array<{ lesson_id: string }>).map((s) => s.lesson_id)
  );

  // Create a map of lessons by module_id for quick lookup
  const lessonsByModule = new Map<string, string[]>();
  for (const lesson of lessons) {
    if (!lessonsByModule.has(lesson.module_id)) {
      lessonsByModule.set(lesson.module_id, []);
    }
    lessonsByModule.get(lesson.module_id)!.push(lesson.id);
  }

  // Check which modules have at least one submission
  const modulesWithSubmission = new Set<string>();
  for (const courseModule of modules) {
    const moduleLesson = lessonsByModule.get(courseModule.id) || [];
    if (moduleLesson.some((lessonId) => submittedLessonIds.has(lessonId))) {
      modulesWithSubmission.add(courseModule.id);
    }
  }

  const missingModulesCount = totalModulesCount - modulesWithSubmission.size;

  const eligible = missingLessonsCount === 0 && missingModulesCount === 0;

  console.log(`CERT: lessons ${completedLessonIds.size}/${totalLessonsCount}, modules ${modulesWithSubmission.size}/${totalModulesCount}, eligible=${eligible}`);

  return {
    eligible,
    missingLessonsCount: 0,
    missingModulesCount,
    totalLessonsCount,
    totalModulesCount,
  };
}

/**
 * Generate a unique certificate number.
 *
 * Format: COURSE-YYYYMM-XXXX
 * - YYYYMM = current year + month (e.g., 202411)
 * - XXXX = random 4-digit hex token (e.g., a1f3)
 *
 * @returns A certificate number string
 */
export function generateCertificateNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const yyyymm = `${year}${month}`;

  // Generate random 4-digit hex token
  const randomToken = Math.random().toString(16).slice(2, 6).padStart(4, '0');

  return `COURSE-${yyyymm}-${randomToken.toUpperCase()}`;
}

/**
 * Get or create a certificate for a user.
 *
 * First checks eligibility. If eligible:
 * - Returns existing certificate if one exists for (user, course)
 * - Creates a new certificate if none exists
 *
 * @param userId - The user ID
 * @returns Certificate data and course title, or null if not eligible
 */
export async function getOrCreateCertificateForUser(userId: string): Promise<{
  certificate: {
    id: string;
    certificate_number: string;
    issued_at: string;
  } | null;
  courseTitle: string | null;
}> {
  const supabase = await createSupabaseServerClient();

  // Check eligibility first
  const eligibility = await checkCertificateEligibility(userId);

  if (!eligibility.eligible) {
    return {
      certificate: null,
      courseTitle: null,
    };
  }

  // Get the first course (main course)
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select('id, title')
    .limit(1)
    .single();

  if (courseError || !course) {
    return {
      certificate: null,
      courseTitle: null,
    };
  }

  // Check if certificate already exists for this user + course
  // Use service role to ensure we can read all columns including certificate_number
  const serviceSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: existingCerts } = await serviceSupabase
    .from('certificates')
    .select('id, certificate_number, issued_at')
    .eq('user_id', userId)
    .eq('course_id', course.id)
    .limit(1);

  // Return existing certificate if found
  if (existingCerts && existingCerts.length > 0) {
    const existingCert = existingCerts[0];
    return {
      certificate: {
        id: existingCert.id,
        certificate_number: existingCert.certificate_number,
        issued_at: existingCert.issued_at,
      },
      courseTitle: course.title,
    };
  }

  // Create a new certificate using service role (to bypass RLS)
  const certificateNumber = generateCertificateNumber();
  const issuedAt = new Date().toISOString();

  const { data: newCerts, error: insertError } = await serviceSupabase
    .from('certificates')
    .insert({
      user_id: userId,
      course_id: course.id,
      certificate_number: certificateNumber,
      issued_at: issuedAt,
    })
    .select('id, certificate_number, issued_at');

  if (insertError) {
    console.error('Error creating certificate:', insertError.message, insertError.code, insertError.details);
    return {
      certificate: null,
      courseTitle: null,
    };
  }

  if (!newCerts || newCerts.length === 0) {
    console.error('Certificate created but no data returned');
    return {
      certificate: null,
      courseTitle: null,
    };
  }

  const newCert = newCerts[0];
  console.log(`Certificate created: ${newCert.certificate_number}`);

  return {
    certificate: {
      id: newCert.id,
      certificate_number: newCert.certificate_number,
      issued_at: newCert.issued_at,
    },
    courseTitle: course.title,
  };
}
