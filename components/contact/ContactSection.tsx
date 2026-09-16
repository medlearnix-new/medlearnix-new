"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, CheckCircle2 } from "lucide-react";
import { Reveal } from "../ui/Reveal";

const CONTACT_DETAILS = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@medlearnix.com",
    href: "mailto:hello@medlearnix.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+1 (800) 555-0199",
    href: "tel:+18005550199",
  },
];

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section className="relative bg-background pb-24">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_1.5fr]">
          <Reveal>
            <div className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-8">
              <h2 className="text-3xl font-bold text-white">Contact Us</h2>

              <div className="mt-8 flex flex-col gap-6">
                {CONTACT_DETAILS.map((detail) => (
                  <a
                    key={detail.label}
                    href={detail.href}
                    className="flex items-center gap-4 group"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent">
                      <detail.icon className="h-5 w-5 text-[#0a0e14]" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-white">
                        {detail.label}
                      </p>
                      <p className="text-slate-400 transition-colors group-hover:text-accent">
                        {detail.value}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="h-full rounded-3xl border border-slate-700/80 bg-white/[0.03] p-8">
              {submitted ? (
                <div className="flex h-full min-h-[380px] flex-col items-center justify-center gap-4 text-center">
                  <CheckCircle2 className="h-12 w-12 text-accent" />
                  <h3 className="text-xl font-bold text-white">
                    Message sent!
                  </h3>
                  <p className="max-w-xs text-slate-400">
                    Thanks for reaching out — our team will get back to you
                    shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-medium text-slate-300"
                    >
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Jane Doe"
                      className="w-full rounded-lg border border-slate-600 bg-transparent px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition-colors focus:border-accent/60"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-slate-300"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="jane@example.com"
                      className="w-full rounded-lg border border-slate-600 bg-transparent px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition-colors focus:border-accent/60"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="mb-2 block text-sm font-medium text-slate-300"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      placeholder="How can we help?"
                      className="w-full resize-none rounded-lg border border-slate-600 bg-transparent px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition-colors focus:border-accent/60"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="rounded-lg bg-accent py-3.5 text-sm font-bold text-[#0a0e14] transition-all hover:brightness-110"
                  >
                    Send Message
                  </motion.button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
