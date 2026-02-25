import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { lessonContentToHtml } from '$lib/server/lesson-content';
import { createHash } from 'node:crypto';

export const GET: RequestHandler = async ({ locals, params, request }) => {
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

  const payload = {
    id: data.id,
    video_embed_html: data.video_embed,
    content_html: lessonContentToHtml(data.content)
  };

  const etag = `"${createHash('sha1')
    .update(`${payload.id}|${payload.video_embed_html ?? ''}|${payload.content_html ?? ''}`)
    .digest('hex')}"`;
  const ifNoneMatch = request.headers.get('if-none-match');

  const responseHeaders = {
    'cache-control': 'private, max-age=60, stale-while-revalidate=300',
    etag
  };

  if (ifNoneMatch === etag) {
    return new Response(null, {
      status: 304,
      headers: responseHeaders
    });
  }

  return json(payload, {
    headers: responseHeaders
  });
};
