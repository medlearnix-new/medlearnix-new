"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, Lock, Loader2, AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import { AuthField } from "./AuthField";
import { AuthCard } from "./AuthCard";
import { supabase } from "@/lib/supabase";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetState, setResetState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setLoading(false);
      setError(error.message);
      return;
    }

    router.push("/");
    router.refresh();
  }

  async function handleForgotPassword() {
    if (!email) {
      setError("Enter your email above first, then click “Forgot Password?” again.");
      return;
    }
    setResetState("sending");
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    setResetState(error ? "error" : "sent");
  }

  return (
    <AuthCard
      title="Welcome Back"
      subtitle="Login to continue your learning journey"
      footer={
        <p className="text-slate-400">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-accent hover:underline">
            Sign Up
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
          {resetState === "sent" && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-start gap-2 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              Password reset link sent — check your inbox.
            </motion.div>
          )}
        </AnimatePresence>

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
            autoComplete="current-password"
            placeholder="Enter your password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="mt-2 text-right">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm font-medium text-accent hover:underline disabled:opacity-60"
              disabled={resetState === "sending"}
            >
              {resetState === "sending" ? "Sending..." : "Forgot Password?"}
            </button>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: loading ? 1 : 1.01 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          type="submit"
          disabled={loading}
          className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-accent py-3.5 text-sm font-bold text-[#04121b] transition-all hover:shadow-[0_0_25px_rgba(0,242,254,0.45)] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            <>
              Login
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </motion.button>
      </form>
    </AuthCard>
  );
}
