-- Performance optimization migration: Add critical indexes
-- These indexes will significantly improve query performance for high-frequency queries

-- Index for lesson_progress lookups by user_id and completed status
-- Used in: Certificate eligibility check, course progress calculation
-- Without this: Full table scan on lesson_progress table
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_completed
ON public.lesson_progress(user_id, completed)
WHERE completed = true;

-- Index for lessons by module_id with order
-- Used in: Fetching lessons for a module, course structure queries
-- Without this: Full table scan on lessons table
CREATE INDEX IF NOT EXISTS idx_lessons_module_order
ON public.lessons(module_id, order);

-- Index for modules by course_id with order
-- Used in: Fetching all modules for a course
-- Without this: Full table scan on modules table
CREATE INDEX IF NOT EXISTS idx_modules_course_order
ON public.modules(course_id, order);

-- Index for homework_submissions lookups
-- Used in: Certificate eligibility check, user progress tracking
-- Without this: Full table scan on homework_submissions table
CREATE INDEX IF NOT EXISTS idx_homework_submissions_user_lesson
ON public.homework_submissions(user_id, lesson_id);

-- Index for homework_submissions by user for faster submission history lookup
CREATE INDEX IF NOT EXISTS idx_homework_submissions_user
ON public.homework_submissions(user_id, submitted_at DESC);

-- Additional indexes for common filtering patterns
-- Index for lesson_progress by lesson_id (for checking individual lesson completion)
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson_id
ON public.lesson_progress(lesson_id);

-- Index for homework_submissions by lesson_id
CREATE INDEX IF NOT EXISTS idx_homework_submissions_lesson_id
ON public.homework_submissions(lesson_id);

-- Index for certificates lookups
-- Used in: Getting or creating certificates for users
CREATE INDEX IF NOT EXISTS idx_certificates_user_course
ON public.certificates(user_id, course_id);
