import type { LucideIcon } from "lucide-react";

export function ComingSoon({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-6 py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10">
        <Icon className="h-8 w-8 text-accent" />
      </div>
      <h1 className="mt-6 text-2xl font-bold text-white">{title}</h1>
      <p className="mt-3 max-w-md text-slate-400">{description}</p>
      <span className="mt-6 inline-flex items-center rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-accent">
        Coming Soon
      </span>
    </div>
  );
}
