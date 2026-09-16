"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, Phone, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
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
                  <AnimatePresence initial={false}>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                      >
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

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
                    whileHover={{ scale: loading ? 1 : 1.01 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent py-3.5 text-sm font-bold text-[#0a0e14] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
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
