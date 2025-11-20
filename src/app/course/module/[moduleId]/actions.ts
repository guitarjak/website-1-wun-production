'use server';

import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { revalidatePath } from 'next/cache';

export async function updateHomeworkInstructions(
  moduleId: string,
  instructions: string
) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from('modules')
    .update({ homework_instructions: instructions })
    .eq('id', moduleId);

  if (error) {
    throw new Error(`Failed to update homework instructions: ${error.message}`);
  }

  revalidatePath(`/course/module/${moduleId}`);
}
