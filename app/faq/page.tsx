import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FaqHero } from "@/components/faq/FaqHero";
import { FaqSections } from "@/components/faq/FaqSections";

export const metadata: Metadata = {
  title: "FAQ — MedLearnix",
  description:
    "Answers about MedLearnix's AI-powered study tools, NGN exam prep, Smart CAT, and subscription options.",
};

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <FaqHero />
      <FaqSections />
      <Footer />
    </main>
  );
}
