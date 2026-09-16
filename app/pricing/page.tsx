import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PricingHero } from "@/components/pricing/PricingHero";
import { PricingPlans } from "@/components/pricing/PricingPlans";

export const metadata: Metadata = {
  title: "Pricing — MedLearnix",
  description:
    "Compare MedLearnix's Pro and Elite plans — full-length practice exams, AI patient simulations, dosage calculators, and 24/7 AI assistant support.",
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <PricingHero />
      <PricingPlans />
      <Footer />
    </main>
  );
}
