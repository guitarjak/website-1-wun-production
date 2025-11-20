import { createSupabaseServerClient } from '@/lib/supabaseServer';

export default async function DebugPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div style={{ padding: '2rem' }}>
      {!user ? (
        <h1>ยังไม่ได้เข้าสู่ระบบ</h1>
      ) : (
        <h1>ยินดีต้อนรับ {user.email}</h1>
      )}
    </div>
  );
}
