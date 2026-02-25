-- Run this in Supabase SQL Editor to improve query performance for course/profile paths.

-- Lesson progress lookups and toggles
create index if not exists idx_lesson_progress_user_completed
  on public.lesson_progress (user_id, completed);

create index if not exists idx_lesson_progress_user_lesson
  on public.lesson_progress (user_id, lesson_id);

-- Course tree ordering
create index if not exists idx_lessons_module_order
  on public.lessons (module_id, "order");

create index if not exists idx_modules_course_order
  on public.modules (course_id, "order");

-- Optional hardening (enable only after de-duplicating data if needed):
-- create unique index if not exists uq_lesson_progress_user_lesson
--   on public.lesson_progress (user_id, lesson_id);
