import { supabase } from "@/lib/supabase";

export interface PricingPlanFeature {
  label: string;
  extra?: string;
}

export interface PricingPlan {
  slug: string;
  name: string;
  price: string;
  billingPeriod: string;
  description: string;
  ctaLabel: string;
  featured: boolean;
  badge?: string;
  features: PricingPlanFeature[];
}

interface PricingPlanRow {
  slug: string;
  name: string;
  price: number;
  billing_period: string;
  description: string;
  cta_label: string;
  featured: boolean;
  badge: string | null;
  pricing_plan_features: {
    label: string;
    extra_note: string | null;
  }[];
}

function mapPlan(row: PricingPlanRow): PricingPlan {
  return {
    slug: row.slug,
    name: row.name,
    price: `$${Number(row.price).toFixed(2)}`,
    billingPeriod: row.billing_period,
    description: row.description,
    ctaLabel: row.cta_label,
    featured: row.featured,
    badge: row.badge ?? undefined,
    features: row.pricing_plan_features.map((f) => ({
      label: f.label,
      extra: f.extra_note ?? undefined,
    })),
  };
}

export async function getPricingPlans(): Promise<PricingPlan[]> {
  const { data, error } = await supabase
    .from("pricing_plans")
    .select(
      "slug, name, price, billing_period, description, cta_label, featured, badge, sort_order, pricing_plan_features(label, extra_note, sort_order)"
    )
    .order("sort_order", { ascending: true })
    .order("sort_order", {
      ascending: true,
      referencedTable: "pricing_plan_features",
    });

  if (error) {
    throw new Error(`Failed to load pricing plans: ${error.message}`);
  }

  return (data ?? []).map((row) => mapPlan(row as unknown as PricingPlanRow));
}

/** A shorter version of each plan (fewer features, compact CTA) for reuse in
 * spots like the FAQ page's pricing snapshot, so plan data is defined once. */
export async function getPricingSnapshot(featureLimit = 4) {
  const plans = await getPricingPlans();
  return plans.map((plan) => ({
    ...plan,
    ctaLabel: `Get ${plan.name.replace(/\s*Plan$/i, "")}`,
    features: plan.features.slice(0, featureLimit),
  }));
}
