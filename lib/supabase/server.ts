import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
      "Set them in .env.local (and in your Vercel project's environment variables)."
  );
}

/** Server client for use in Server Components, Server Actions, and Route
 * Handlers. Reads/writes the session via the request's cookies so it stays
 * in sync with the browser client. Call this fresh on every request — it
 * captures `cookies()` at call time. */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl as string, supabaseAnonKey as string, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component (not a Server Action/Route
          // Handler) — cookies can't be written here. Safe to ignore as
          // long as proxy.ts is refreshing the session on every request.
        }
      },
    },
  });
}
