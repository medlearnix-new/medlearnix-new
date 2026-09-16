"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Loader2,
  AlertCircle,
  ArrowRight,
  MailCheck,
} from "lucide-react";
import { AuthField } from "./AuthField";
import { AuthCard } from "./AuthCard";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

const STRENGTH_LABELS = ["Too short", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLORS = [
  "bg-red-500",
  "bg-orange-500",
  "bg-amber-400",
  "bg-lime-400",
  "bg-emerald-400",
];

function getPasswordStrength(password: string) {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return Math.min(score, 4);
}

export function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    if (!agreed) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (data.session) {
      router.push("/");
      router.refresh();
      return;
    }

    setAwaitingConfirmation(true);
  }

  if (awaitingConfirmation) {
    return (
      <AuthCard
        title="Check Your Email"
        subtitle="You're almost there"
        footer={
          <p className="text-slate-400">
            Already confirmed?{" "}
            <Link href="/login" className="font-semibold text-accent hover:underline">
              Login
            </Link>
          </p>
        }
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-4 py-2 text-center"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
            <MailCheck className="h-8 w-8 text-accent" />
          </div>
          <p className="text-sm text-slate-400">
            We sent a confirmation link to{" "}
            <span className="font-semibold text-white">{email}</span>. Click
            it to activate your account and start studying.
          </p>
        </motion.div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Create Your Account"
      subtitle="Start your journey to NCLEX success"
      footer={
        <p className="text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-accent hover:underline">
            Login
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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

        <AuthField
          id="name"
          label="Full Name"
          icon={User}
          type="text"
          autoComplete="name"
          placeholder="Jane Doe"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <AuthField
          id="email"
          label="Email"
          icon={Mail}
          type="email"
          autoComplete="email"
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div>
          <AuthField
            id="password"
            label="Password"
            icon={Lock}
            isPassword
            autoComplete="new-password"
            placeholder="Create a password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {password && (
            <div className="mt-2.5">
              <div className="flex gap-1.5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-slate-800">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: i < strength ? "100%" : "0%" }}
                      transition={{ duration: 0.3 }}
                      className={cn("h-full", STRENGTH_COLORS[strength])}
                    />
                  </div>
                ))}
              </div>
              <p className="mt-1.5 text-xs text-slate-500">
                {STRENGTH_LABELS[strength]}
              </p>
            </div>
          )}
        </div>

        <AuthField
          id="confirmPassword"
          label="Confirm Password"
          icon={Lock}
          isPassword
          autoComplete="new-password"
          placeholder="Re-enter your password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <label className="flex items-start gap-2.5 text-sm text-slate-400">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-600 bg-black/20 accent-accent"
          />
          I agree to the{" "}
          <span className="text-slate-300">Terms of Service</span> and{" "}
          <span className="text-slate-300">Privacy Policy</span>.
        </label>

        <motion.button
          whileHover={{ scale: loading ? 1 : 1.01 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          type="submit"
          disabled={loading}
          className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-accent py-3.5 text-sm font-bold text-[#04121b] transition-all hover:shadow-[0_0_25px_rgba(0,242,254,0.45)] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            <>
              Create Account
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </motion.button>
      </form>
    </AuthCard>
  );
}
