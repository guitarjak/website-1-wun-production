'use server';

import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function loginAction(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      success: false,
      error: error.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
    };
  }

  // Revalidate all paths to update the navbar immediately
  revalidatePath('/', 'layout');

  // Only redirect if login was successful
  redirect('/course');
}
