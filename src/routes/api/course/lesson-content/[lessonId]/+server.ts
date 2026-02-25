import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, params }) => {
  if (!locals.session) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const lessonId = params.lessonId;
  if (!lessonId) {
    return json({ error: 'Missing lessonId' }, { status: 400 });
  }

  const { data, error } = await locals.supabase
    .from('lessons')
    .select('id, video_embed, content, is_published')
    .eq('id', lessonId)
    .maybeSingle();

  if (error || !data) {
    return json({ error: 'Lesson not found' }, { status: 404 });
  }

  if (data.is_published === false) {
    return json({ error: 'Lesson not available' }, { status: 403 });
  }

  return json({
    id: data.id,
    video_embed_html: data.video_embed,
    content_json: data.content
  });
};
