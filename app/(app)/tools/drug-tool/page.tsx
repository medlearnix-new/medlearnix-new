import type { Metadata } from "next";
import { Pill } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export const metadata: Metadata = { title: "Drug Tool — MedLearnix" };

export default function DrugToolPage() {
  return (
    <ComingSoon
      icon={Pill}
      title="Drug Tool"
      description="A searchable medication reference with dosing, interactions, and nursing considerations is on its way."
    />
  );
}
