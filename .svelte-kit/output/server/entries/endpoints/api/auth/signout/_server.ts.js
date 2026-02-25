import { json } from "@sveltejs/kit";
const POST = async ({ locals }) => {
  const { error } = await locals.supabase.auth.signOut();
  if (error) {
    return json({ ok: false, error: error.message }, { status: 500 });
  }
  return json({ ok: true });
};
export {
  POST
};
