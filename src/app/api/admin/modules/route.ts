import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServer';

interface CreateModuleBody {
  courseId: string;
  title: string;
  description?: string;
  order?: number;
}

/**
 * POST /api/admin/modules
 * Create a new module
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateModuleBody = await request.json();

    if (!body.courseId || !body.title) {
      return NextResponse.json(
        { error: 'คอร์ส ID และชื่อโมดูลเป็นสิ่งจำเป็น' },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();

    // If order is not provided, calculate it
    let order = body.order;
    if (order === undefined || order === null) {
      const { data: modules } = await supabase
        .from('modules')
        .select('order')
        .eq('course_id', body.courseId);

      const maxOrder = Math.max(
        -1,
        ...(modules || [] as Array<{ order: number | null }>).map((m) => m.order || 0)
      );
      order = maxOrder + 1;
    }

    const { data: module, error } = await supabase
      .from('modules')
      .insert({
        course_id: body.courseId,
        title: body.title,
        description: body.description || null,
        order: order,
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error creating module:', error);
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการสร้างโมดูล' },
        { status: 500 }
      );
    }

    return NextResponse.json({ module }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error in modules POST:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    );
  }
}
