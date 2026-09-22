"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function DashboardShell({
  name,
  email,
  children,
}: {
  name: string;
  email: string;
  children: React.ReactNode;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header name={name} email={email} onOpenMobileNav={() => setMobileNavOpen(true)} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
