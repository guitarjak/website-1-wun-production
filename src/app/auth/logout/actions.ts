'use server';

import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function logoutAction() {
  const supabase = await createSupabaseServerClient();

  // Sign out the user (clears auth cookies)
  await supabase.auth.signOut();

  // Revalidate all paths to update the navbar immediately
  revalidatePath('/', 'layout');

  // Redirect to login page
  redirect('/auth/login');
}
