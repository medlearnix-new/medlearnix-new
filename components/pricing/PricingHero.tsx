"use client";

import Image from "next/image";
import { Reveal } from "../ui/Reveal";
import { SectionTag } from "../ui/SectionTag";

export function PricingHero() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="absolute inset-0">
        <Image
          src="/images/pricing-hero.png"
          alt=""
          fill
          priority
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/85 to-background" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 pb-16 pt-24 text-center lg:px-8 lg:pt-32">
        <Reveal className="flex flex-col items-center">
          <SectionTag>Flexible Learning Plans</SectionTag>
          <h1 className="mt-6 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Invest in Your Nursing &amp; Medical Exam Success
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-300">
            Gain full access to high-yield question banks, real-world AI
            diagnostic simulations, and instant clinical decision tools.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
