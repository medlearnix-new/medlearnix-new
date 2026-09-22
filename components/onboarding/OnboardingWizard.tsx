"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { OnboardingProgress } from "./OnboardingProgress";
import { StepLevel } from "./StepLevel";
import { StepPreparation } from "./StepPreparation";
import { StepStruggles } from "./StepStruggles";
import { StepPlan } from "./StepPlan";
import { createClient } from "@/lib/supabase/client";
import type { Level, PreparationTarget } from "@/lib/onboarding-data";
import type { PricingPlan } from "@/lib/pricing-data";

const TOTAL_STEPS = 4;

const STEP_COPY = [
  {
    header: "What is your current level?",
    subtext: "Help us tailor your learning experience",
  },
  {
    header: "What are you preparing for?",
    subtext: "Help us customize your learning experience",
  },
  {
    header: "Which areas do you struggle with?",
    subtext: "Help us customize your learning experience",
  },
  {
    header: "Select subscription plan",
    subtext: "Choose the plan that fits your goals — you can change this anytime",
  },
];

export function OnboardingWizard({
  userId,
  plans,
}: {
  userId: string;
  plans: PricingPlan[];
}) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [level, setLevel] = useState<Level | null>(null);
  const [preparationTarget, setPreparationTarget] = useState<PreparationTarget | null>(null);
  const [struggleAreas, setStruggleAreas] = useState<string[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid =
    (step === 1 && level !== null) ||
    (step === 2 && preparationTarget !== null) ||
    (step === 3 && struggleAreas.length > 0) ||
    (step === 4 && selectedPlan !== null);

  function goTo(nextStep: number) {
    setDirection(nextStep > step ? 1 : -1);
    setError(null);
    setStep(nextStep);
  }

  function toggleStruggleArea(option: string) {
    setStruggleAreas((prev) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
    );
  }

  async function handleFinish() {
    if (!selectedPlan) return;
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const { error: saveError } = await supabase
      .from("profiles")
      .update({
        level,
        preparation_target: preparationTarget,
        struggle_areas: struggleAreas,
        selected_plan: selectedPlan,
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString(),
      })
      .eq("id", userId);

    setSaving(false);

    if (saveError) {
      setError(saveError.message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  function handleNext() {
    if (!isValid) return;
    if (step === TOTAL_STEPS) {
      handleFinish();
      return;
    }
    goTo(step + 1);
  }

  const copy = STEP_COPY[step - 1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/70 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-10"
    >
      <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,242,254,0.15),transparent_70%)] blur-2xl" />

      <div className="relative">
        <OnboardingProgress step={step} totalSteps={TOTAL_STEPS} />

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            initial={{ opacity: 0, x: 24 * direction }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 * direction }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7"
          >
            <h1 className="text-2xl font-bold text-white">{copy.header}</h1>
            <p className="mt-1.5 text-sm text-slate-400">{copy.subtext}</p>

            <div className="mt-6">
              {step === 1 && <StepLevel value={level} onChange={setLevel} />}
              {step === 2 && (
                <StepPreparation value={preparationTarget} onChange={setPreparationTarget} />
              )}
              {step === 3 && (
                <StepStruggles value={struggleAreas} onToggle={toggleStruggleArea} />
              )}
              {step === 4 && (
                <StepPlan plans={plans} value={selectedPlan} onChange={setSelectedPlan} />
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence initial={false}>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 flex items-center gap-3">
          {step > 1 && (
            <motion.button
              type="button"
              onClick={() => goTo(step - 1)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:border-accent/40 hover:bg-accent/5"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </motion.button>
          )}

          <motion.button
            type="button"
            onClick={handleNext}
            disabled={!isValid || saving}
            whileHover={{ scale: !isValid || saving ? 1 : 1.02 }}
            whileTap={{ scale: !isValid || saving ? 1 : 0.98 }}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent py-3.5 text-sm font-bold text-[#04121b] transition-all hover:shadow-[0_0_25px_rgba(0,242,254,0.45)] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : step === TOTAL_STEPS ? (
              "Finish"
            ) : (
              <>
                Next
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
