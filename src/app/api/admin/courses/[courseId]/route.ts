import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServer';

interface UpdateCourseBody {
  title: string;
  description?: string;
}

/**
 * PUT /api/admin/courses/[courseId]
 * Update a course
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;
    const body: UpdateCourseBody = await request.json();

    if (!body.title) {
      return NextResponse.json(
        { error: 'ชื่อคอร์สเป็นสิ่งจำเป็น' },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();

    // Verify user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'ไม่ได้รับอนุญาต' },
        { status: 401 }
      );
    }

    // Verify user is the course instructor
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('instructor_id')
      .eq('id', courseId)
      .single();

    if (courseError || !course) {
      return NextResponse.json(
        { error: 'ไม่พบคอร์ส' },
        { status: 404 }
      );
    }

    if (course.instructor_id !== user.id) {
      return NextResponse.json(
        { error: 'คุณไม่มีสิทธิ์แก้ไขคอร์สนี้' },
        { status: 403 }
      );
    }

    const { error } = await supabase
      .from('courses')
      .update({
        title: body.title,
        description: body.description || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', courseId);

    if (error) {
      console.error('Error updating course:', error);
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการอัปเดตคอร์ส' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error in courses PUT:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/courses/[courseId]
 * Delete a course
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;

    const supabase = await createSupabaseServerClient();

    // Verify user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'ไม่ได้รับอนุญาต' },
        { status: 401 }
      );
    }

    // Verify user is the course instructor
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('instructor_id')
      .eq('id', courseId)
      .single();

    if (courseError || !course) {
      return NextResponse.json(
        { error: 'ไม่พบคอร์ส' },
        { status: 404 }
      );
    }

    if (course.instructor_id !== user.id) {
      return NextResponse.json(
        { error: 'คุณไม่มีสิทธิ์ลบคอร์สนี้' },
        { status: 403 }
      );
    }

    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', courseId);

    if (error) {
      console.error('Error deleting course:', error);
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการลบคอร์ส' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error in courses DELETE:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    );
  }
}
