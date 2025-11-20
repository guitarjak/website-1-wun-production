import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { clearCachePattern } from '@/lib/cache';

interface RequestBody {
  lessonId: string;
  completed?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    let body: RequestBody;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { lessonId, completed = true } = body;

    // Validate input
    if (!lessonId || typeof lessonId !== 'string') {
      return NextResponse.json(
        { error: 'lessonId is required and must be a string' },
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

    // Check if lesson exists
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select('id')
      .eq('id', lessonId)
      .single();

    if (lessonError || !lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    // Upsert into lesson_progress
    // If the row already exists, update it; otherwise, create it
    const { data: existingProgress } = await supabase
      .from('lesson_progress')
      .select('id')
      .eq('user_id', user.id)
      .eq('lesson_id', lessonId)
      .single();

    if (existingProgress) {
      // Update existing progress
      const { error: updateError } = await supabase
        .from('lesson_progress')
        .update({
          completed: completed,
          completed_at: completed ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId);

      if (updateError) {
        console.error('Progress update error:', updateError);
        return NextResponse.json(
          { error: 'Failed to update lesson progress' },
          { status: 500 }
        );
      }
    } else {
      // Create new progress record
      const { error: insertError } = await supabase
        .from('lesson_progress')
        .insert({
          user_id: user.id,
          lesson_id: lessonId,
          completed: completed,
          completed_at: completed ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error('Progress insert error:', insertError);
        return NextResponse.json(
          { error: 'Failed to record lesson progress' },
          { status: 500 }
        );
      }
    }

    // Invalidate course structure cache since progress changed
    // This ensures next page load gets fresh data
    clearCachePattern('course:*');
    clearCachePattern('progress:*');

    const message = completed ? 'Lesson marked as complete' : 'Lesson marked as incomplete';
    return NextResponse.json(
      { success: true, message, completed },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unexpected error in progress API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
