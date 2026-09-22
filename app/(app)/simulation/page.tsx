import type { Metadata } from "next";
import { FlaskConical } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export const metadata: Metadata = { title: "AI Simulation — MedLearnix" };

export default function SimulationPage() {
  return (
    <ComingSoon
      icon={FlaskConical}
      title="AI Simulation"
      description="Full clinical patient simulations with AI-driven scenarios are coming soon — practice real-world decision-making before you hit the floor."
    />
  );
}
