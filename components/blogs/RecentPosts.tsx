"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Reveal } from "../ui/Reveal";
import type { BlogPost } from "@/lib/blog-data";

export function RecentPosts({
  posts,
  title = "Recent Articles",
  description = "The latest insights from our clinical and AI teams.",
}: {
  posts: BlogPost[];
  title?: string;
  description?: string;
}) {
  return (
    <section className="relative bg-background py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white">{title}</h2>
            <p className="mt-2 text-slate-400">{description}</p>
          </div>
          <Link
            href="/blogs"
            className="text-sm font-semibold text-accent hover:underline"
          >
            View all articles →
          </Link>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -6 }}
                className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-700/80 bg-white/[0.02]"
              >
                <div className="relative h-52">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-4 p-6">
                  <span
                    className={`text-xs font-bold uppercase tracking-[0.08em] ${post.categoryColor}`}
                  >
                    {post.category}
                  </span>
                  <h3 className="text-lg font-bold leading-snug text-white">
                    {post.title}
                  </h3>
                  <p className="flex-1 text-sm leading-relaxed text-slate-400">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm text-slate-500">
                      {post.readTime}
                    </span>
                    <Link
                      href={`/blogs/${post.slug}`}
                      className="text-sm font-semibold text-accent hover:underline"
                    >
                      Read Article
                    </Link>
                  </div>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
