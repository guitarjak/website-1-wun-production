-- Add draft/publish support for lessons.
-- Safe to run multiple times.

alter table public.lessons
  add column if not exists is_published boolean;

update public.lessons
set is_published = true
where is_published is null;

alter table public.lessons
  alter column is_published set default true;

alter table public.lessons
  alter column is_published set not null;

create index if not exists idx_lessons_module_published_order
  on public.lessons (module_id, is_published, "order");
