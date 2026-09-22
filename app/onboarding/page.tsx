import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";
import { createClient } from "@/lib/supabase/server";
import { getPricingPlans } from "@/lib/pricing-data";

export const metadata: Metadata = {
  title: "Set Up Your Account — MedLearnix",
  description: "Tell us about your study goals so we can personalize MedLearnix for you.",
};

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/onboarding");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.onboarding_completed) {
    redirect("/dashboard");
  }

  const plans = await getPricingPlans();

  return (
    <OnboardingLayout>
      <OnboardingWizard userId={user.id} plans={plans} />
    </OnboardingLayout>
  );
}
