import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServer';

interface UpdateLessonBody {
  title?: string;
  description?: string;
  content?: string;
  video_embed?: string;
  order?: number;
}

/**
 * PUT /api/admin/lessons/[lessonId]
 * Update a lesson
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await params;
    const body: UpdateLessonBody = await request.json();

    const supabase = await createSupabaseServerClient();

    const updateData: Record<string, string | number | null> = {
      updated_at: new Date().toISOString(),
    };

    // Only include fields that are provided
    if (body.title !== undefined) {
      updateData.title = body.title;
    }
    if (body.description !== undefined) {
      updateData.description = body.description || null;
    }
    if (body.content !== undefined) {
      updateData.content = body.content || null;
    }
    if (body.video_embed !== undefined) {
      updateData.video_embed = body.video_embed || null;
    }
    if (body.order !== undefined) {
      updateData.order = body.order;
    }

    // Make sure at least one field is being updated (besides updated_at)
    const fieldsToUpdate = Object.keys(updateData).filter(k => k !== 'updated_at');
    if (fieldsToUpdate.length === 0) {
      return NextResponse.json(
        { error: 'ไม่มีข้อมูลที่จะอัปเดต' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('lessons')
      .update(updateData)
      .eq('id', lessonId);

    if (error) {
      console.error('Error updating lesson:', error);
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการอัปเดตบทเรียน' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error in lessons PUT:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/lessons/[lessonId]
 * Delete a lesson
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await params;

    const supabase = await createSupabaseServerClient();

    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', lessonId);

    if (error) {
      console.error('Error deleting lesson:', error);
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการลบบทเรียน' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error in lessons DELETE:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    );
  }
}
