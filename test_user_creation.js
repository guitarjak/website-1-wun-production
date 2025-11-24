const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://dfisdvkipzycpvesynkx.supabase.co';
const serviceRoleKey = 'sb_secret_sTR4-2H_5rKh2FXqoad63Q_qOacJuqq';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function testUserCreation() {
  const timestamp = Math.floor(Math.random() * 1000000);
  const testEmail = `test_${timestamp}@example.com`;
  const testPassword = 'TestPassword123';

  console.log('Testing user creation with email:', testEmail);

  // Step 1: Create auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: testEmail,
    password: testPassword,
    email_confirm: true,
    user_metadata: {
      full_name: 'Test User',
      role: 'student',
    },
  });

  if (authError) {
    console.error('❌ Auth user creation failed:', authError.message);
    console.error('Error details:', JSON.stringify(authError, null, 2));
    return;
  }

  console.log('✅ Auth user created:', authData.user.id);

  // Step 2: Create profile via RPC
  const userId = authData.user.id;
  const { error: profileError, data: profileData } = await supabase.rpc('create_user_profile', {
    user_id: userId,
    user_full_name: 'Test User',
    user_role: 'student',
  });

  if (profileError) {
    console.error('❌ Profile creation failed:', profileError.message);
    console.error('Profile error details:', JSON.stringify(profileError, null, 2));
    return;
  }

  console.log('✅ Profile created successfully');
  console.log('Response:', profileData);
}

testUserCreation().catch(console.error);
