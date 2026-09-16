import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CTABanner } from "@/components/CTABanner";
import { CoursesHero } from "@/components/courses/CoursesHero";
import { SpecialtyTracks } from "@/components/courses/SpecialtyTracks";
import { StudyFeatures } from "@/components/courses/StudyFeatures";

export const metadata: Metadata = {
  title: "Courses — MedLearnix",
  description:
    "Explore MedLearnix's NCLEX-PN and NCLEX-RN specialty tracks, powered by AI simulations, adaptive testing, and personalized study tools.",
};

export default function CoursesPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <CoursesHero />
      <SpecialtyTracks />
      <StudyFeatures />
      <CTABanner />
      <Footer />
    </main>
  );
}
