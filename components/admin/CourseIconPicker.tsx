import {
  Stethoscope,
  HeartPulse,
  Pill,
  Baby,
  Brain,
  Heart,
  Calculator,
  ClipboardCheck,
  BookOpen,
  type LucideIcon,
} from "lucide-react";

export const COURSE_ICONS: Record<string, LucideIcon> = {
  stethoscope: Stethoscope,
  "heart-pulse": HeartPulse,
  pill: Pill,
  baby: Baby,
  brain: Brain,
  heart: Heart,
  calculator: Calculator,
  "clipboard-check": ClipboardCheck,
  "book-open": BookOpen,
};

export function getCourseIcon(iconName: string | null): LucideIcon {
  return (iconName && COURSE_ICONS[iconName]) || BookOpen;
}
