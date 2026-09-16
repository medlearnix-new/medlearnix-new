import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CTABanner } from "@/components/CTABanner";
import { BlogPostContent } from "@/components/blogs/BlogPostContent";
import { RecentPosts } from "@/components/blogs/RecentPosts";
import { getAllBlogSlugs, getBlogPost, getRelatedPosts } from "@/lib/blog-data";

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

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
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const related = await getRelatedPosts(post.slug, 3);

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
