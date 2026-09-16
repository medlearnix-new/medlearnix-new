"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Stethoscope,
  HeartPulse,
  Pill,
  Baby,
  Brain,
  Heart,
  Calculator,
  ClipboardCheck,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "./ui/Reveal";

interface Course {
  icon: LucideIcon;
  title: string;
  description: string;
  iconGradient: string;
}

const COURSES: Course[] = [
  {
    icon: Stethoscope,
    title: "Fundamentals",
    description: "Build your nursing foundation",
    iconGradient: "from-cyan-400 to-blue-600",
  },
  {
    icon: HeartPulse,
    title: "Med-Surg",
    description: "Master high-yield content",
    iconGradient: "from-rose-400 to-red-600",
  },
  {
    icon: Pill,
    title: "Pharmacology",
    description: "Learn meds with confidence",
    iconGradient: "from-teal-400 to-emerald-600",
  },
  {
    icon: Baby,
    title: "Pediatrics",
    description: "Care for all ages",
    iconGradient: "from-amber-400 to-orange-600",
  },
  {
    icon: Brain,
    title: "Mental Health",
    description: "Understand and apply key concepts",
    iconGradient: "from-violet-400 to-purple-600",
  },
  {
    icon: Heart,
    title: "Maternal-Newborn",
    description: "Support moms and newborns",
    iconGradient: "from-pink-400 to-fuchsia-600",
  },
  {
    icon: Calculator,
    title: "Dosage Calculation",
    description: "Practice with realistic scenarios",
    iconGradient: "from-sky-400 to-indigo-600",
  },
  {
    icon: ClipboardCheck,
    title: "Clinical Judgment",
    description: "Strengthen your NGN skills",
    iconGradient: "from-indigo-400 to-purple-600",
  },
];

export function CoursesGrid() {
  return (
    <section id="courses" className="relative bg-background py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Explore Our NCLEX Review Courses
            </h2>
            <p className="mt-3 max-w-xl text-slate-400">
              Comprehensive, easy-to-follow courses covering all major NCLEX
              topics.
            </p>
          </div>
          <Link
            href="/courses"
            className="flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
          >
            View All Courses
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {COURSES.map((course, i) => (
            <Reveal key={course.title} delay={i * 0.05}>
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="h-full rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 transition-colors duration-300 hover:border-accent/40 hover:shadow-[0_0_25px_rgba(0,242,254,0.12)]"
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${course.iconGradient} shadow-lg`}
                >
                  <course.icon className="h-5 w-5 text-white" strokeWidth={2} />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-white">
                  {course.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                  {course.description}
                </p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
