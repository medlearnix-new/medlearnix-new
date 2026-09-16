"use client";

import { Reveal } from "../ui/Reveal";

export function ContactHero() {
  return (
    <section className="relative bg-background pb-8 pt-24 lg:pt-32">
      <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
        <Reveal>
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            Get in Touch
          </h1>
          <p className="mt-5 text-lg text-slate-300">
            We&apos;re here to help you with anything you need.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
