import { requireUser } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const user = await requireUser();
    const { completionTitle, completionMessage } = await request.json();

    if (!completionTitle || !completionMessage) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      );
    }

    const { courseId } = await params;
    const supabase = await createSupabaseServerClient();

    // Get the course to verify ownership
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id, instructor_id')
      .eq('id', courseId)
      .single();

    if (courseError || !course) {
      return NextResponse.json(
        { error: 'ไม่พบคอร์ส' },
        { status: 404 }
      );
    }

    // Verify user is the instructor
    if (course.instructor_id !== user.user.id) {
      return NextResponse.json(
        { error: 'คุณไม่มีสิทธิ์แก้ไขคอร์สนี้' },
        { status: 403 }
      );
    }

    // Update completion message
    const { error } = await supabase
      .from('courses')
      .update({
        completion_title: completionTitle.trim(),
        completion_message: completionMessage.trim(),
      })
      .eq('id', courseId);

    if (error) {
      console.error('Error updating completion message:', error);
      return NextResponse.json(
        { error: 'ไม่สามารถอัปเดตข้อมูลได้' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      completion_title: completionTitle.trim(),
      completion_message: completionMessage.trim(),
    });
  } catch (error) {
    console.error('Completion message update error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    );
  }
}
