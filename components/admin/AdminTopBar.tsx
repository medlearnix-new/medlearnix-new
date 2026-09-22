"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function AdminTopBar({ name, email }: { name: string; email: string }) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const initial = name.charAt(0).toUpperCase();

  async function handleLogout() {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-background/80 backdrop-blur-xl">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-300 lg:hidden">
          <ShieldCheck className="h-4 w-4 text-accent" />
          Admin
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-2.5 rounded-xl border border-slate-800/80 py-1.5 pl-1.5 pr-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-xs font-bold text-white">
              {initial}
            </span>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold leading-tight text-white">{name}</p>
              <p className="text-xs leading-tight text-slate-500">{email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-3.5 py-2 text-sm font-semibold text-slate-300 transition-colors hover:border-red-500/40 hover:text-red-300 disabled:opacity-60"
          >
            {loggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
