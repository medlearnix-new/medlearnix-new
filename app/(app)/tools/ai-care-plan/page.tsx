import type { Metadata } from "next";
import { ClipboardCheck } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export const metadata: Metadata = { title: "AI Care Plan — MedLearnix" };

export default function AiCarePlanPage() {
  return (
    <ComingSoon
      icon={ClipboardCheck}
      title="AI Care Plan"
      description="Generate individualized nursing care plans from a patient scenario in seconds — this tool is currently in development."
    />
  );
}
