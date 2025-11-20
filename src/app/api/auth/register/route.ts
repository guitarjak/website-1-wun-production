import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, password } = await request.json();

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: 'ข้อมูลไม่ครบถ้วน' },
        { status: 400 }
      );
    }

    // Create unauthenticated Supabase client for signup
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Sign up the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError || !authData.user) {
      console.error('Sign up error:', authError);
      return NextResponse.json(
        { error: authError?.message || 'ไม่สามารถสมัครสมาชิกได้' },
        { status: 400 }
      );
    }

    const userId = authData.user.id;

    // Check if this is the first user (count existing users)
    const { count, error: countError } = await supabase
      .from('users_profile')
      .select('id', { count: 'exact', head: true });

    if (countError) {
      console.error('Count error:', countError);
      // For now, default to 'student' if count fails (RLS issue)
      // This allows registration to proceed
    }

    const isFirstUser = !countError && count === 0;
    const role = isFirstUser ? 'admin' : 'student';

    console.log(`Creating profile for user ${userId} with role: ${role}`);

    // Create a server-side Supabase client with service role key for profile insertion
    // This bypasses RLS policies since the server has full access
    const supabaseServer = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Create profile in users_profile table using server client
    const { error: profileError } = await supabaseServer.from('users_profile').insert({
      id: userId,
      full_name: fullName,
      role,
    });

    if (profileError) {
      console.error('Profile insert error:', profileError);
      return NextResponse.json(
        { error: `ไม่สามารถสร้างโปรไฟล์ได้: ${profileError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'สมัครสมาชิกสำเร็จ' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    );
  }
}
