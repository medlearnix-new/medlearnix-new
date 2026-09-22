import type { Metadata } from "next";
import { Brain } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export const metadata: Metadata = { title: "Smart CAT — MedLearnix" };

export default function SmartCatPage() {
  return (
    <ComingSoon
      icon={Brain}
      title="Smart CAT"
      description="Our adaptive computerized testing engine is on its way — practice with item difficulty that adjusts to your performance in real time."
    />
  );
}
