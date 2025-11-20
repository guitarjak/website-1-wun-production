import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { clearCachePattern } from '@/lib/cache';

interface PostRequestBody {
  moduleId: string;
  content: string;
}

/**
 * POST /api/homework
 *
 * Creates a new homework submission for the current user and module.
 * This endpoint allows multiple submissions (keeps history).
 *
 * Request body:
 * {
 *   moduleId: string;
 *   content: string;
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    let body: PostRequestBody;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { moduleId, content } = body;

    // Validate input
    if (!moduleId || typeof moduleId !== 'string') {
      return NextResponse.json(
        { error: 'moduleId is required and must be a string' },
        { status: 400 }
      );
    }

    if (!content || typeof content !== 'string' || content.trim() === '') {
      return NextResponse.json(
        { error: 'content is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    // Get the authenticated user
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Check authentication
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized: Please log in first' },
        { status: 401 }
      );
    }

    // Validate that the module exists
    const { data: module, error: moduleError } = await supabase
      .from('modules')
      .select('id')
      .eq('id', moduleId)
      .single();

    if (moduleError || !module) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      );
    }

    // Get the first lesson of this module (for lesson_id foreign key)
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select('id')
      .eq('module_id', moduleId)
      .order('order', { ascending: true })
      .limit(1)
      .single();

    if (lessonError || !lesson) {
      return NextResponse.json(
        { error: 'No lessons found in this module' },
        { status: 404 }
      );
    }

    // Check if user has existing submission for any lesson in this module
    const { data: allLessons } = await supabase
      .from('lessons')
      .select('id')
      .eq('module_id', moduleId);

    const allLessonIds = (allLessons || []).map((l) => l.id);

    let existingSubmissionId: string | null = null;

    if (allLessonIds.length > 0) {
      const { data: existingSubmissions } = await supabase
        .from('homework_submissions')
        .select('id')
        .eq('user_id', user.id)
        .in('lesson_id', allLessonIds)
        .limit(1);

      if (existingSubmissions && existingSubmissions.length > 0) {
        existingSubmissionId = existingSubmissions[0].id;
      }
    }

    // Update or Insert
    if (existingSubmissionId) {
      // Update existing submission
      const { error: updateError } = await supabase
        .from('homework_submissions')
        .update({
          submission_text: content.trim(),
          submitted_at: new Date().toISOString(),
        })
        .eq('id', existingSubmissionId);

      if (updateError) {
        console.error('Update error:', updateError);
        return NextResponse.json(
          { error: 'Failed to update homework' },
          { status: 500 }
        );
      }
    } else {
      // Create new submission
      const { error: insertError } = await supabase
        .from('homework_submissions')
        .insert({
          user_id: user.id,
          lesson_id: lesson.id,
          submission_text: content.trim(),
          submitted_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error('Insert error:', insertError);
        return NextResponse.json(
          { error: 'Failed to submit homework' },
          { status: 500 }
        );
      }
    }

    // Invalidate cache since homework was submitted
    clearCachePattern('course:*');
    clearCachePattern('progress:*');

    return NextResponse.json(
      { success: true, message: 'Homework submitted successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Unexpected error in homework API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/homework?moduleId=...
 *
 * Retrieves all homework submissions for the current user for a specific module.
 * Results are ordered by submitted_at DESC (newest first).
 *
 * Query parameters:
 * - moduleId: (required) The module ID to fetch submissions for
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get('moduleId');

    // Validate input
    if (!moduleId) {
      return NextResponse.json(
        { error: 'moduleId query parameter is required' },
        { status: 400 }
      );
    }

    // Get the authenticated user
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Check authentication
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized: Please log in first' },
        { status: 401 }
      );
    }

    // Validate that the module exists
    const { data: module, error: moduleError } = await supabase
      .from('modules')
      .select('id')
      .eq('id', moduleId)
      .single();

    if (moduleError || !module) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      );
    }

    // Get all lesson IDs for this module
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('id')
      .eq('module_id', moduleId);

    if (lessonsError || !lessons) {
      return NextResponse.json(
        {
          success: true,
          data: [],
          count: 0,
        },
        { status: 200 }
      );
    }

    const lessonIds = lessons.map((l) => l.id);

    // Fetch all submissions for this user for any lesson in this module, ordered by newest first
    const { data: submissions, error } = await supabase
      .from('homework_submissions')
      .select('*')
      .eq('user_id', user.id)
      .in('lesson_id', lessonIds)
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error('Homework fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch homework submissions' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: submissions || [],
        count: submissions?.length || 0,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unexpected error in homework GET API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
