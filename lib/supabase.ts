import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
      "Set them in .env.local (and in your Vercel project's environment variables)."
  );
}

// Public, read-only content (blog posts, pricing plans, FAQs) is fetched with
// the anon key, which is safe to use here because every table exposed to it
// only has a "Public read access" RLS policy — no writes are possible with
// this key. Fetched on the server inside React Server Components.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});
