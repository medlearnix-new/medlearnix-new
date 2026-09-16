import Image from "next/image";
import { cn } from "@/lib/utils";
import logoMark from "./logoo.png";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="relative flex h-9 w-9 items-center justify-center rounded-full">
        <div className="absolute inset-0 scale-110 rounded-full bg-accent/40 blur-md" />
        <Image
          src={logoMark}
          alt="MedLearnix"
          className="relative h-9 w-9 rounded-full object-cover drop-shadow-[0_0_10px_rgba(0,242,254,0.55)]"
          priority
        />
      </div>
      <span className="text-lg font-bold tracking-tight text-white">
        Med<span className="text-accent">Learnix</span>
      </span>
    </div>
  );
}
