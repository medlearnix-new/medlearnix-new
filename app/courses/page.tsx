import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CTABanner } from "@/components/CTABanner";
import { CoursesHero } from "@/components/courses/CoursesHero";
import { SpecialtyTracks } from "@/components/courses/SpecialtyTracks";
import { StudyFeatures } from "@/components/courses/StudyFeatures";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { MyCoursesView } from "@/components/student-courses/MyCoursesView";
import { createClient } from "@/lib/supabase/server";
import { daysUntil } from "@/lib/dashboard-queries";
import { listAllPublishedCourses, listMyCourses, listCompletedCourses } from "@/lib/courses/queries";

export const metadata: Metadata = {
  title: "Courses — MedLearnix",
  description:
    "Explore MedLearnix's NCLEX-PN and NCLEX-RN specialty tracks, powered by AI simulations, adaptive testing, and personalized study tools.",
};

export default async function CoursesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, onboarding_completed, current_streak, nclex_exam_date")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.onboarding_completed) {
      const [allCourses, myCourses, completedCourses] = await Promise.all([
        listAllPublishedCourses(supabase, user.id),
        listMyCourses(supabase, user.id),
        listCompletedCourses(supabase, user.id),
      ]);

      const name = profile.full_name?.split(" ")[0] || user.email?.split("@")[0] || "there";

      return (
        <DashboardShell
          name={name}
          email={user.email ?? ""}
          streakDays={profile.current_streak}
          countdownDays={profile.nclex_exam_date ? daysUntil(profile.nclex_exam_date) : null}
        >
          <MyCoursesView myCourses={myCourses} allCourses={allCourses} completedCourses={completedCourses} />
        </DashboardShell>
      );
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <CoursesHero />
      <SpecialtyTracks />
      <StudyFeatures />
      <CTABanner />
      <Footer />
    </main>
  );
}
