import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kyozizqyzelkuybqozkl.supabase.co';
const supabaseKey = 'sb_publishable_mIlNgJdqq4zib8BjOBvriQ_8JXqb4tj';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('Testing Supabase connection...\n');

  // Test 1: List all profiles
  console.log('1. Fetching all profiles:');
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('*');

  if (profilesError) {
    console.error('Error:', profilesError);
  } else {
    console.log('Profiles found:', profiles);
  }

  console.log('\n---\n');

  // Test 2: Check auth users
  console.log('2. Getting current session:');
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    console.error('Session error:', sessionError);
  } else {
    console.log('Session:', session ? 'Exists' : 'No session');
  }
}

testConnection();
