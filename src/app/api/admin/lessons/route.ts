import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServer';

interface CreateLessonBody {
  moduleId: string;
  title: string;
  description?: string;
  content?: string;
  order?: number;
}

/**
 * POST /api/admin/lessons
 * Create a new lesson
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateLessonBody = await request.json();

    if (!body.moduleId || !body.title) {
      return NextResponse.json(
        { error: 'โมดูล ID และชื่อบทเรียนเป็นสิ่งจำเป็น' },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();

    // If order is not provided, calculate it
    let order = body.order;
    if (order === undefined || order === null) {
      const { data: lessons } = await supabase
        .from('lessons')
        .select('order')
        .eq('module_id', body.moduleId);

      const maxOrder = Math.max(
        -1,
        ...(lessons || [] as Array<{ order: number | null }>).map((l) => l.order || 0)
      );
      order = maxOrder + 1;
    }

    const { data: lesson, error } = await supabase
      .from('lessons')
      .insert({
        module_id: body.moduleId,
        title: body.title,
        description: body.description || null,
        content: body.content || null,
        order: order,
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error creating lesson:', error);
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการสร้างบทเรียน' },
        { status: 500 }
      );
    }

    return NextResponse.json({ lesson }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error in lessons POST:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    );
  }
}
