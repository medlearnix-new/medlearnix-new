import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FaqHero } from "@/components/faq/FaqHero";
import { FaqSections } from "@/components/faq/FaqSections";
import { getFaqCategories } from "@/lib/faq-data";
import { getPricingSnapshot } from "@/lib/pricing-data";

export const metadata: Metadata = {
  title: "FAQ — MedLearnix",
  description:
    "Answers about MedLearnix's AI-powered study tools, NGN exam prep, Smart CAT, and subscription options.",
};

export const revalidate = 300;

export default async function FaqPage() {
  const [categories, pricingPlans] = await Promise.all([
    getFaqCategories(),
    getPricingSnapshot(4),
  ]);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <FaqHero />
      <FaqSections categories={categories} pricingPlans={pricingPlans} />
      <Footer />
    </main>
  );
}
