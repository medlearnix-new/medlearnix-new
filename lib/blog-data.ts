import { supabase } from "@/lib/supabase";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categoryColor: string;
  date: string;
  readTime: string;
  image: string;
  featured?: boolean;
  content: string[];
}

interface BlogPostRow {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  category_color: string;
  published_at: string;
  read_minutes: number;
  image_url: string;
  featured: boolean;
  content: string[];
}

function mapPost(row: BlogPostRow): BlogPost {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    categoryColor: row.category_color,
    date: new Date(`${row.published_at}T00:00:00Z`).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }),
    readTime: `${row.read_minutes} min read`,
    image: row.image_url,
    featured: row.featured,
    content: row.content,
  };
}

const SELECT_COLUMNS =
  "slug, title, excerpt, category, category_color, published_at, read_minutes, image_url, featured, content";

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select(SELECT_COLUMNS)
    .order("published_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load blog posts: ${error.message}`);
  }

  return (data ?? []).map(mapPost);
}

export async function getAllBlogSlugs(): Promise<string[]> {
  const { data, error } = await supabase.from("blog_posts").select("slug");

  if (error) {
    throw new Error(`Failed to load blog slugs: ${error.message}`);
  }

  return (data ?? []).map((row) => row.slug);
}

export async function getFeaturedBlogPost(): Promise<BlogPost | undefined> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select(SELECT_COLUMNS)
    .eq("featured", true)
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load featured blog post: ${error.message}`);
  }

  return data ? mapPost(data) : undefined;
}

export async function getBlogPost(slug: string): Promise<BlogPost | undefined> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select(SELECT_COLUMNS)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load blog post "${slug}": ${error.message}`);
  }

  return data ? mapPost(data) : undefined;
}

export async function getRelatedPosts(
  slug: string,
  count = 3
): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select(SELECT_COLUMNS)
    .neq("slug", slug)
    .order("published_at", { ascending: false })
    .limit(count);

  if (error) {
    throw new Error(`Failed to load related posts for "${slug}": ${error.message}`);
  }

  return (data ?? []).map(mapPost);
}
