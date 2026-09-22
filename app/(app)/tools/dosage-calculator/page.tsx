import type { Metadata } from "next";
import { Calculator } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export const metadata: Metadata = { title: "Dosage Calculator — MedLearnix" };

export default function DosageCalculatorPage() {
  return (
    <ComingSoon
      icon={Calculator}
      title="Dosage Calculator"
      description="Practice dosage and IV drip-rate calculations with instant, step-by-step feedback — coming soon."
    />
  );
}
