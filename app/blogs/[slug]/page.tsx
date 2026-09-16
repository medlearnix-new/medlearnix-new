import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CTABanner } from "@/components/CTABanner";
import { BlogPostContent } from "@/components/blogs/BlogPostContent";
import { RecentPosts } from "@/components/blogs/RecentPosts";
import { BLOG_POSTS, getBlogPost, getRelatedPosts } from "@/lib/blog-data";

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return { title: "Article not found — MedLearnix" };
  }

  return {
    title: `${post.title} — MedLearnix`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const related = getRelatedPosts(post.slug, 3);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <BlogPostContent post={post} />
      <RecentPosts
        posts={related}
        title="Related Articles"
        description="Keep exploring high-yield content from our clinical and AI teams."
      />
      <CTABanner />
      <Footer />
    </main>
  );
}
