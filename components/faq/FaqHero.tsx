"use client";

import { HelpCircle } from "lucide-react";
import { Reveal } from "../ui/Reveal";
import { SectionTag } from "../ui/SectionTag";

export function FaqHero() {
  return (
    <section className="relative bg-background pb-8 pt-24 lg:pt-32">
      <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
        <Reveal className="flex flex-col items-center">
          <SectionTag>
            <HelpCircle className="h-3.5 w-3.5" />
            Support Center
          </SectionTag>
          <h1 className="mt-6 text-4xl font-bold text-white sm:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-6 text-lg text-slate-300">
            Everything you need to know about MedLearnix, our AI-powered
            study tools, NGN exam prep, and subscription options.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
