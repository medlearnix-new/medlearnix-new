import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { FeatureGrid } from "@/components/FeatureGrid";
import { AnalyticsSection } from "@/components/AnalyticsSection";
import { CoursesGrid } from "@/components/CoursesGrid";
import { Testimonials } from "@/components/Testimonials";
import { Pricing } from "@/components/Pricing";
import { FAQ } from "@/components/FAQ";
import { CTABanner } from "@/components/CTABanner";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <FeatureGrid />
      <AnalyticsSection />
      <CoursesGrid />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTABanner />
      <Footer />
    </main>
  );
}
