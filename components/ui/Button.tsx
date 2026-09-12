import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "outline" | "ghost";
type ButtonSize = "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-[#04121b] hover:shadow-[0_0_25px_rgba(0,242,254,0.45)] hover:brightness-110",
  outline:
    "border border-slate-700 bg-transparent text-white hover:border-accent/60 hover:bg-accent/5",
  ghost: "bg-transparent text-slate-300 hover:text-white",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 ease-out cursor-pointer",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
