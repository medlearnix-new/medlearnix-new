import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BlogsHero } from "@/components/blogs/BlogsHero";
import { FeaturedPost } from "@/components/blogs/FeaturedPost";
import { RecentPosts } from "@/components/blogs/RecentPosts";
import { BLOG_POSTS } from "@/lib/blog-data";

export const metadata: Metadata = {
  title: "Blog — MedLearnix",
  description:
    "High-yield study tips, NCLEX preparation strategies, and clinical judgment insights powered by AI — from the MedLearnix Pulse.",
};

export default function BlogsPage() {
  const featured = BLOG_POSTS.find((post) => post.featured) ?? BLOG_POSTS[0];
  const recent = BLOG_POSTS.filter((post) => post.slug !== featured.slug);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <BlogsHero />
      <FeaturedPost post={featured} />
      <RecentPosts posts={recent} />
      <Footer />
    </main>
  );
}
