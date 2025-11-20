import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServer';

interface UpdateModuleBody {
  title: string;
  description?: string;
  order?: number;
}

/**
 * PUT /api/admin/modules/[moduleId]
 * Update a module
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  try {
    const { moduleId } = await params;
    const body: UpdateModuleBody = await request.json();

    if (!body.title) {
      return NextResponse.json(
        { error: 'ชื่อโมดูลเป็นสิ่งจำเป็น' },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();

    const updateData: any = {
      title: body.title,
      description: body.description !== undefined ? body.description : null,
      updated_at: new Date().toISOString(),
    };

    // Include order if provided
    if (body.order !== undefined) {
      updateData.order = body.order;
    }

    const { error } = await supabase
      .from('modules')
      .update(updateData)
      .eq('id', moduleId);

    if (error) {
      console.error('Error updating module:', error);
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการอัปเดตโมดูล' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error in modules PUT:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/modules/[moduleId]
 * Delete a module
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  try {
    const { moduleId } = await params;

    const supabase = await createSupabaseServerClient();

    const { error } = await supabase
      .from('modules')
      .delete()
      .eq('id', moduleId);

    if (error) {
      console.error('Error deleting module:', error);
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการลบโมดูล' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error in modules DELETE:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    );
  }
}
