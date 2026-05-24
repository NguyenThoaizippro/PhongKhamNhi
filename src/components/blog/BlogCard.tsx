import Link from "next/link";
import Image from "next/image";
import type { BlogPostView } from "@/lib/blog/types";
import { SPECIALTIES } from "@/lib/constants";

const SPECIALTY_LOOKUP = new Map(SPECIALTIES.map((s) => [s.slug, s]));

export function BlogCard({ post, priority = false }: { post: BlogPostView; priority?: boolean }) {
  const specialty = post.specialty ? SPECIALTY_LOOKUP.get(post.specialty) : undefined;
  const date = new Date(post.publishedAt).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white border border-[color:var(--color-border)] hover:border-[color:var(--color-primary)] hover:shadow-lg transition">
      <Link href={`/blog/${post.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-[color:var(--color-primary-bg)]">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            priority={priority}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-30">
            {specialty?.icon ?? "📖"}
          </div>
        )}
        {specialty && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur text-xs font-bold text-[color:var(--color-primary-dark)]">
            {specialty.icon} {specialty.name}
          </span>
        )}
      </Link>

      <div className="flex-1 flex flex-col p-5">
        <h3 className="text-lg sm:text-xl font-bold leading-snug">
          <Link
            href={`/blog/${post.slug}`}
            className="text-[color:var(--color-text)] hover:text-[color:var(--color-accent)] transition-colors"
          >
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 text-sm text-[color:var(--color-text-soft)] line-clamp-3">{post.excerpt}</p>
        <div className="mt-4 pt-3 border-t border-[color:var(--color-border)] flex items-center justify-between text-xs text-[color:var(--color-text-soft)]">
          <span className="font-medium">{post.authorName}</span>
          <span>
            {date} · {post.readingMinutes} phút đọc
          </span>
        </div>
      </div>
    </article>
  );
}
