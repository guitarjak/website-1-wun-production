import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServer';

interface CreateCourseBody {
  title: string;
  description?: string;
}

/**
 * POST /api/admin/courses
 * Create a new course
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateCourseBody = await request.json();

    if (!body.title) {
      return NextResponse.json(
        { error: 'ชื่อคอร์สเป็นสิ่งจำเป็น' },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();

    // Get current user to use as instructor
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'ไม่พบผู้ใช้ที่ลงชื่อเข้า' },
        { status: 401 }
      );
    }

    const { data: course, error } = await supabase
      .from('courses')
      .insert({
        title: body.title,
        description: body.description || null,
        instructor_id: user.id,
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error creating course:', error);
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการสร้างคอร์ส' },
        { status: 500 }
      );
    }

    return NextResponse.json({ course }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error in courses POST:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    );
  }
}
