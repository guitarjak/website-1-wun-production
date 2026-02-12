import { isBrowser, createBrowserClient, createServerClient } from "@supabase/ssr";
import { P as PUBLIC_SUPABASE_URL, a as PUBLIC_SUPABASE_ANON_KEY } from "../../chunks/public.js";
const load = async ({ data, depends, fetch }) => {
  depends("supabase:auth");
  console.log("[LAYOUT] Environment:", isBrowser() ? "browser" : "server");
  console.log("[LAYOUT] Supabase URL configured:", true);
  console.log("[LAYOUT] Supabase key configured:", true);
  const supabase = isBrowser() ? createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    global: {
      fetch
    }
  }) : createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    global: {
      fetch
    },
    cookies: {
      getAll() {
        return data.cookies;
      }
    }
  });
  console.log("[LAYOUT] Supabase client created");
  const {
    data: { session }
  } = await supabase.auth.getSession();
  console.log("[LAYOUT] Session status:", session ? "active" : "none");
  return { ...data, supabase, session };
};
export {
  load
};
