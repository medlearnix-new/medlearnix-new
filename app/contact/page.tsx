import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactSection } from "@/components/contact/ContactSection";

export const metadata: Metadata = {
  title: "Contact Us — MedLearnix",
  description:
    "Get in touch with the MedLearnix team — we're here to help with anything you need.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <ContactHero />
      <ContactSection />
      <Footer />
    </main>
  );
}
