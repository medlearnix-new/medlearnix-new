import { supabase } from "@/lib/supabase";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqCategory {
  name: string;
  items: FaqItem[];
}

interface FaqCategoryRow {
  name: string;
  sort_order: number;
  faqs: {
    question: string;
    answer: string;
    sort_order: number;
  }[];
}

export async function getFaqCategories(): Promise<FaqCategory[]> {
  const { data, error } = await supabase
    .from("faq_categories")
    .select("name, sort_order, faqs(question, answer, sort_order)")
    .order("sort_order", { ascending: true })
    .order("sort_order", { ascending: true, referencedTable: "faqs" });

  if (error) {
    throw new Error(`Failed to load FAQs: ${error.message}`);
  }

  return ((data ?? []) as unknown as FaqCategoryRow[]).map((row) => ({
    name: row.name,
    items: row.faqs.map((faq) => ({
      question: faq.question,
      answer: faq.answer,
    })),
  }));
}
