import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BlogsHero } from "@/components/blogs/BlogsHero";
import { FeaturedPost } from "@/components/blogs/FeaturedPost";
import { RecentPosts } from "@/components/blogs/RecentPosts";
import { getAllBlogPosts, getFeaturedBlogPost } from "@/lib/blog-data";

export const metadata: Metadata = {
  title: "Blog — MedLearnix",
  description:
    "High-yield study tips, NCLEX preparation strategies, and clinical judgment insights powered by AI — from the MedLearnix Pulse.",
};

export const revalidate = 300;

export default async function BlogsPage() {
  const [posts, featuredFromDb] = await Promise.all([
    getAllBlogPosts(),
    getFeaturedBlogPost(),
  ]);

  const featured = featuredFromDb ?? posts[0];
  const recent = posts.filter((post) => post.slug !== featured?.slug);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <BlogsHero />
      {featured && <FeaturedPost post={featured} />}
      <RecentPosts posts={recent} />
      <Footer />
    </main>
  );
}
