"use client";

import { OptionCard } from "./OptionCard";
import { PREPARATION_TARGET_OPTIONS, type PreparationTarget } from "@/lib/onboarding-data";

export function StepPreparation({
  value,
  onChange,
}: {
  value: PreparationTarget | null;
  onChange: (value: PreparationTarget) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {PREPARATION_TARGET_OPTIONS.map((option) => (
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
