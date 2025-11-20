import { requireUser } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  try {
    const user = await requireUser();
    const { full_name } = await request.json();

    if (!full_name || typeof full_name !== 'string') {
      return NextResponse.json(
        { error: 'ชื่อเต็มจำเป็นต้องมี' },
        { status: 400 }
      );
    }

    if (full_name.trim().length === 0) {
      return NextResponse.json(
        { error: 'ชื่อเต็มไม่สามารถว่างได้' },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();

    const { error } = await supabase
      .from('users_profile')
      .update({ full_name: full_name.trim() })
      .eq('id', user.user.id);

    if (error) {
      console.error('Error updating profile:', error);
      return NextResponse.json(
        { error: 'ไม่สามารถอัปเดตชื่อได้' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      full_name: full_name.trim(),
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    );
  }
}
