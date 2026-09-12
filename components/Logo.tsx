import { Atom } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10">
        <div className="absolute inset-0 rounded-xl bg-accent/20 blur-md" />
        <Atom className="relative h-5 w-5 text-accent" strokeWidth={2.25} />
      </div>
      <span className="text-lg font-bold tracking-tight text-white">
        Med<span className="text-accent">Learnix</span>
      </span>
    </div>
  );
}
