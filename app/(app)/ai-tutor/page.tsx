import type { Metadata } from "next";
import { MessageSquareText } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export const metadata: Metadata = { title: "AI Tutor — MedLearnix" };

export default function AiTutorPage() {
  return (
    <ComingSoon
      icon={MessageSquareText}
      title="AI Tutor"
      description="Your 24/7 personalized AI tutor for nursing concepts and exam strategy is almost ready."
    />
  );
}
