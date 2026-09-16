"use client";

import { FaqAccordionGroup } from "./FaqAccordionGroup";
import { FaqPricingSnapshot } from "./FaqPricingSnapshot";
import type { FaqCategory } from "@/lib/faq-data";
import type { PricingPlan } from "@/lib/pricing-data";

const PRICING_CATEGORY_NAME = "Pricing & Subscriptions";

export function FaqSections({
  categories,
  pricingPlans,
}: {
  categories: FaqCategory[];
  pricingPlans: PricingPlan[];
}) {
  return (
    <section className="relative bg-background pb-24">
      <div className="mx-auto flex max-w-3xl flex-col gap-14 px-6 lg:px-8">
        {categories.map((group, i) => {
          const isPricingCategory = group.name === PRICING_CATEGORY_NAME;

          if (!isPricingCategory) {
            return (
              <FaqAccordionGroup
                key={group.name}
                category={group.name}
                items={group.items}
                delay={i * 0.05}
              />
            );
          }

          return (
            <div key={group.name}>
              <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-accent">
                {group.name}
              </h3>
              <div className="mt-4">
                <FaqPricingSnapshot plans={pricingPlans} />
                <FaqAccordionGroup items={group.items} delay={0.1} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
