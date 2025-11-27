import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate input
    if (!email) {
      return NextResponse.json(
        { error: 'กรุณาใส่อีเมล' },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();

    // Build redirect URL: prefer explicit env, then Vercel host, then localhost for dev
    const host =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    const redirectUrl = `${host}/auth/reset-password`;

    // Send password reset email using Supabase
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    if (error) {
      console.error('Error sending reset password email:', error);
      // Don't reveal whether email exists or not for security reasons
      return NextResponse.json(
        { message: 'ถ้าอีเมลของคุณมีในระบบ คุณจะได้รับอีเมลพร้อมคำแนะนำการตั้งรหัสผ่านใหม่' },
        { status: 200 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'ส่งลิงค์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณแล้ว กรุณาตรวจสอบอีเมลของคุณ',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    );
  }
}
