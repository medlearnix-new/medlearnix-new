import { cn } from "@/lib/utils";

const GRADIENTS = [
  "from-cyan-400 to-blue-600",
  "from-fuchsia-400 to-purple-600",
  "from-amber-400 to-orange-600",
  "from-emerald-400 to-teal-600",
];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Avatar({
  name,
  index = 0,
  className,
}: {
  name: string;
  index?: number;
  className?: string;
}) {
  const gradient = GRADIENTS[index % GRADIENTS.length];
  return (
    <div
      className={cn(
        "flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white ring-2 ring-slate-800",
        gradient,
        className
      )}
      aria-hidden
    >
      {initials(name)}
    </div>
  );
}
