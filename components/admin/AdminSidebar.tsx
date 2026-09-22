"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  HelpCircle,
  Users,
  ArrowLeftRight,
  ShieldCheck,
} from "lucide-react";
import { Logo } from "../Logo";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/courses", label: "Courses & Modules", icon: BookOpen },
  { href: "/admin/questions", label: "Question Bank", icon: HelpCircle },
  { href: "/admin/users", label: "Students", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-800/80 bg-slate-950/60 lg:flex">
      <div className="flex items-center gap-2 px-5 py-5">
        <Link href="/admin/dashboard">
          <Logo />
        </Link>
        <span className="ml-1 flex items-center gap-1 rounded-full border border-accent/20 bg-accent/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent">
          <ShieldCheck className="h-3 w-3" />
          Admin
        </span>
      </div>

      <nav className="flex-1 px-3">
        <div className="flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                isActive(link.href)
                  ? "bg-accent/10 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <link.icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  isActive(link.href) ? "text-accent" : "text-slate-500"
                )}
              />
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      <div className="border-t border-slate-800/80 p-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
        >
          <ArrowLeftRight className="h-4 w-4 shrink-0 text-slate-500" />
          Switch to Student View
        </Link>
      </div>
    </aside>
  );
}
