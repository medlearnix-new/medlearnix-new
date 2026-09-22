import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
      "Set them in .env.local (and in your Vercel project's environment variables)."
  );
}

/** Browser client for use in "use client" components (auth forms,
 * onboarding). Persists the session in cookies (not localStorage) so the
 * server — Server Components, Route Handlers, proxy.ts — can read the same
 * session on the next request. Create a fresh instance per component; the
 * underlying auth state is still shared via cookies. */
export function createClient() {
  return createBrowserClient(supabaseUrl as string, supabaseAnonKey as string);
}
