"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Reveal } from "../ui/Reveal";
import { FacebookIcon, LinkedinIcon, XIcon } from "../icons/SocialIcons";
import type { BlogPost } from "@/lib/blog-data";

export function BlogPostContent({ post }: { post: BlogPost }) {
  return (
    <article className="relative bg-background pb-16 pt-24 lg:pt-32">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <Reveal>
          <Link
            href="/blogs"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all articles
          </Link>

          <div className="mt-6 flex items-center gap-3">
            <span
              className={`text-xs font-bold uppercase tracking-[0.08em] ${post.categoryColor}`}
            >
              {post.category}
            </span>
            <span className="text-sm text-slate-500">
              {post.date} • {post.readTime}
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>
        </Reveal>

        <Reveal delay={0.1} className="relative mt-10 h-64 overflow-hidden rounded-2xl sm:h-96">
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            className="object-cover"
          />
        </Reveal>

        <Reveal delay={0.15} className="mt-10 flex flex-col gap-6">
          {post.content.map((paragraph, i) => (
            <p key={i} className="text-lg leading-relaxed text-slate-300">
              {paragraph}
            </p>
          ))}
        </Reveal>

        <Reveal delay={0.2} className="mt-12 flex items-center gap-4 border-t border-slate-800/80 pt-8">
          <span className="text-sm font-semibold text-slate-400">Share:</span>
          {[XIcon, FacebookIcon, LinkedinIcon].map((Icon, i) => (
            <motion.a
              key={i}
              href="#"
              whileHover={{ y: -2 }}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-800/80 text-slate-400 transition-colors hover:border-accent/40 hover:text-accent"
            >
              <Icon className="h-4 w-4" />
            </motion.a>
          ))}
        </Reveal>
      </div>
    </article>
  );
}
