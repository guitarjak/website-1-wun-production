-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Create improved function with better metadata handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  full_name_value TEXT;
  role_value TEXT;
BEGIN
  -- Extract metadata - priority: user_metadata -> fallback to email prefix
  full_name_value := COALESCE(
    new.raw_user_meta_data->>'full_name',
    SPLIT_PART(new.email, '@', 1)  -- Use email prefix as last resort
  );

  role_value := COALESCE(
    new.raw_user_meta_data->>'role',
    'student'
  );

  -- Insert or update profile
  INSERT INTO public.users_profile (id, full_name, role, is_active, created_at)
  VALUES (new.id, full_name_value, role_value, true, NOW())
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    is_active = true;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
