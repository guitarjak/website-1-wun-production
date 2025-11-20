'use server';

import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { revalidatePath } from 'next/cache';

export async function updateHomeworkStatus(
  submissionId: string,
  newStatus: 'SUBMITTED' | 'REVIEWED' | 'APPROVED'
) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from('homework_submissions')
    .update({ status: newStatus })
    .eq('id', submissionId);

  if (error) {
    throw new Error(`Failed to update submission status: ${error.message}`);
  }

  revalidatePath('/admin/homework');
}

export async function updateHomeworkFeedback(
  submissionId: string,
  feedback: string
) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from('homework_submissions')
    .update({ feedback })
    .eq('id', submissionId);

  if (error) {
    throw new Error(`Failed to update homework feedback: ${error.message}`);
  }

  revalidatePath('/admin/homework');
}
