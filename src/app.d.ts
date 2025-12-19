import { SupabaseClient, Session } from '@supabase/supabase-js';

declare global {
  namespace App {
    interface Locals {
      supabase: SupabaseClient;
      safeGetSession: () => Promise<{ session: Session | null; profile: Profile | null }>;
      session: Session | null;
      profile: Profile | null;
    }
    interface PageData {
      session: Session | null;
      profile: Profile | null;
      course?: Course;
      modules?: Module[];
    }
    // interface Error {}
    // interface Platform {}
  }
}

export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string;
  created_at?: string | null;
  avatar_url?: string | null;
  is_active?: boolean | null;
};

export type Lesson = {
  id: string;
  title: string;
  slug: string;
  position: number;
  video_embed_html: string | null;
  content_json: any | null;
};

export type Module = {
  id: string;
  title: string;
  description: string | null;
  position: number;
  lessons: Lesson[];
};

export type Course = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  slug: string;
};

export {};
