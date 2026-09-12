import { cn } from "@/lib/utils";

export function SectionTag({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent",
        className
      )}
    >
      {children}
    </span>
  );
}
