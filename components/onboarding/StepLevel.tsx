"use client";

import { OptionCard } from "./OptionCard";
import { LEVEL_OPTIONS, type Level } from "@/lib/onboarding-data";

export function StepLevel({
  value,
  onChange,
}: {
  value: Level | null;
  onChange: (value: Level) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {LEVEL_OPTIONS.map((option) => (
        <OptionCard
          key={option.value}
          label={option.label}
          description={option.description}
          selected={value === option.value}
          onClick={() => onChange(option.value)}
        />
      ))}
    </div>
  );
}
