'use server';

import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { revalidatePath } from 'next/cache';

export async function updateUserRole(userId: string, newRole: 'admin' | 'student') {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from('users_profile')
    .update({ role: newRole })
    .eq('id', userId);

  if (error) {
    throw new Error(`Failed to update user role: ${error.message}`);
  }

  revalidatePath('/admin/users');
}

export async function updateUserActiveStatus(userId: string, isActive: boolean) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from('users_profile')
    .update({ is_active: isActive })
    .eq('id', userId);

  if (error) {
    throw new Error(`Failed to update user active status: ${error.message}`);
  }

  revalidatePath('/admin/users');
}
