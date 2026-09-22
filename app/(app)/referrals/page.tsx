import type { Metadata } from "next";
import { Users } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export const metadata: Metadata = { title: "My Referrals — MedLearnix" };

export default function ReferralsPage() {
  return (
    <ComingSoon
      icon={Users}
      title="My Referrals"
      description="Invite classmates to MedLearnix and track your referral rewards here soon."
    />
  );
}
