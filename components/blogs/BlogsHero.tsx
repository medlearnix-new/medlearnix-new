"use client";

import { Search } from "lucide-react";
import { Reveal } from "../ui/Reveal";

export function BlogsHero() {
  return (
    <section className="relative bg-background pb-8 pt-24 lg:pt-32">
      <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
        <Reveal>
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            The MedLearnix Pulse
          </h1>
          <p className="mt-6 text-lg text-slate-300">
            High-yield study tips, NCLEX preparation strategies, and clinical
            judgment insights powered by AI.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-8">
          <div className="relative mx-auto max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full rounded-xl border border-slate-700 bg-slate-900/80 py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-slate-500 outline-none transition-colors focus:border-accent/60"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
