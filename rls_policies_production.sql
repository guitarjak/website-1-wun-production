-- ============================================================================
-- Row-Level Security (RLS) Policies - Production
-- ============================================================================
-- This file contains all tested and working RLS policies for the course platform.
-- These policies enforce access control at the database level.
--
-- Key Principles:
-- - Users can read public content (courses, modules, lessons)
-- - Users can only modify their own data (profile, progress, submissions)
-- - Admins can manage all content and user data
-- - Profile creation uses server-side insertion (bypasses RLS)
-- ============================================================================

-- ============================================================================
-- USERS_PROFILE TABLE POLICIES
-- ============================================================================
-- NOTE: SELECT/UPDATE/DELETE admin policies removed to avoid infinite recursion.
-- Admin operations should use the service role key (SUPABASE_SERVICE_ROLE_KEY)
-- on the server side, which bypasses RLS entirely.

-- Allow anyone to view all profiles (public read)
CREATE POLICY users_profile_select_public ON users_profile
  FOR SELECT
  USING (true);

-- Allow users to view their own profile
CREATE POLICY users_profile_select_own ON users_profile
  FOR SELECT
  USING (auth.uid() = id);

-- Allow users to insert their own profile (for registration)
-- Note: Profile creation uses server-side client with service role key to bypass RLS
CREATE POLICY users_profile_insert_self ON users_profile
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow authenticated users or admins to insert profiles
-- Note: The admin check here is safe for INSERT (doesn't cause recursion like SELECT does)
CREATE POLICY users_profile_insert_admin ON users_profile
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = id OR (
      SELECT users_profile_1.role = 'admin'
      FROM users_profile users_profile_1
      WHERE users_profile_1.id = auth.uid()
    )
  );

-- Allow users to update their own profile
CREATE POLICY users_profile_update_own ON users_profile
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- NOTE: Admin update/delete policies removed to prevent infinite recursion.
-- Use service role key on server side for admin profile management.

-- ============================================================================
-- COURSES TABLE POLICIES
-- ============================================================================
-- NOTE: Admin INSERT/UPDATE/DELETE policies use recursive checks.
-- These should be handled via server-side client with service role key to avoid recursion.

-- Allow anyone to view all courses (public read)
CREATE POLICY courses_select_all ON courses
  FOR SELECT
  USING (true);

-- NOTE: Admin create/update/delete operations should use service role key on server side
-- to bypass RLS entirely, preventing infinite recursion issues.

-- ============================================================================
-- MODULES TABLE POLICIES
-- ============================================================================

-- Allow anyone to view all modules (public read)
CREATE POLICY modules_select_all ON modules
  FOR SELECT
  USING (true);

-- NOTE: Admin create/update/delete operations should use service role key on server side
-- to bypass RLS entirely, preventing infinite recursion issues.

-- ============================================================================
-- LESSONS TABLE POLICIES
-- ============================================================================

-- Allow anyone to view all lessons (public read)
CREATE POLICY lessons_select_all ON lessons
  FOR SELECT
  USING (true);

-- NOTE: Admin create/update/delete operations should use service role key on server side
-- to bypass RLS entirely, preventing infinite recursion issues.

-- ============================================================================
-- LESSON_PROGRESS TABLE POLICIES
-- ============================================================================

-- Allow users to view their own progress
CREATE POLICY lesson_progress_select_own ON lesson_progress
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to record their own progress
CREATE POLICY lesson_progress_insert_own ON lesson_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own progress
CREATE POLICY lesson_progress_update_own ON lesson_progress
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- NOTE: Admin operations on lesson_progress should use service role key on server side
-- to bypass RLS entirely, preventing infinite recursion issues.

-- ============================================================================
-- HOMEWORK_SUBMISSIONS TABLE POLICIES
-- ============================================================================

-- Allow users to view their own submissions
CREATE POLICY homework_submissions_select_own ON homework_submissions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to submit their own homework
CREATE POLICY homework_submissions_insert_own ON homework_submissions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own submissions
CREATE POLICY homework_submissions_update_own ON homework_submissions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- NOTE: Admin operations (view all, grade, delete) should use service role key on server side
-- to bypass RLS entirely, preventing infinite recursion issues.

-- ============================================================================
-- CERTIFICATES TABLE POLICIES
-- ============================================================================

-- Allow users to view their own certificates
CREATE POLICY certificates_select_own ON certificates
  FOR SELECT
  USING (auth.uid() = user_id);

-- NOTE: Admin operations (issue, update, delete certificates) should use service role key on server side
-- to bypass RLS entirely, preventing infinite recursion issues.
