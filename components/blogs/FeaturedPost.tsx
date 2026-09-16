"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Reveal } from "../ui/Reveal";
import type { BlogPost } from "@/lib/blog-data";

export function FeaturedPost({ post }: { post: BlogPost }) {
  return (
    <section className="relative bg-background pb-16 pt-8">
      <Reveal className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-0 overflow-hidden rounded-3xl border border-slate-700/80 bg-white/[0.03] lg:grid-cols-2">
          <div className="relative h-64 lg:h-auto">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex flex-col justify-center gap-6 p-8 sm:p-12">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-[#0b121d]">
                Featured
              </span>
              <span className="text-sm text-slate-400">
                {post.date} • {post.readTime}
              </span>
            </div>

            <h2 className="text-2xl font-bold leading-tight text-white sm:text-3xl">
              {post.title}
            </h2>

            <p className="text-slate-300">{post.excerpt}</p>

            <motion.div whileHover={{ x: 4 }} className="w-fit">
              <Link
                href={`/blogs/${post.slug}`}
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-sm font-bold text-[#1f2937] transition-all hover:brightness-110"
              >
                Read Full Guide
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
