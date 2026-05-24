import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { MarkdownContent } from "@/components/blog/MarkdownContent";
import { getPostBySlug, getAllPublishedSlugs } from "@/lib/blog/queries";
import { SPECIALTIES, CLINIC } from "@/lib/constants";

const SPECIALTY_LOOKUP = new Map(SPECIALTIES.map((s) => [s.slug, s]));

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Không tìm thấy bài viết" };

  return {
    title: `${post.title} — Blog Dế Mèn`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.authorName],
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const specialty = post.specialty ? SPECIALTY_LOOKUP.get(post.specialty) : undefined;
  const date = new Date(post.publishedAt).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="pb-16">
      {/* Hero cover */}
      {post.coverImage && (
        <div className="relative w-full aspect-[21/9] sm:aspect-[21/8] bg-[color:var(--color-primary-bg)]">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/40" />
        </div>
      )}

      <Container size="narrow" as="article" className="pt-8 sm:pt-12">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm font-medium text-[color:var(--color-primary-dark)] hover:underline mb-6"
        >
          ← Quay lại danh sách bài viết
        </Link>

        <header className="mb-8">
          {specialty && (
            <Link
              href={`/blog?specialty=${specialty.slug}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[color:var(--color-primary-bg)] text-sm font-semibold text-[color:var(--color-primary-dark)] hover:bg-[color:var(--color-primary-soft)] transition"
            >
              {specialty.icon} {specialty.name}
            </Link>
          )}
          <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-[color:var(--color-text)]">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-[color:var(--color-text-soft)] leading-relaxed">
            {post.excerpt}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[color:var(--color-text-soft)] border-y border-[color:var(--color-border)] py-3">
            <span className="inline-flex items-center gap-1.5 font-medium text-[color:var(--color-text)]">
              <span className="w-6 h-6 rounded-full bg-[color:var(--color-primary)] text-white inline-flex items-center justify-center text-xs">
                {post.authorName[0]}
              </span>
              {post.authorName}
            </span>
            <span>·</span>
            <time dateTime={post.publishedAt}>{date}</time>
            <span>·</span>
            <span>{post.readingMinutes} phút đọc</span>
          </div>
        </header>

        <MarkdownContent markdown={post.content} />

        {post.tags.length > 0 && (
          <div className="mt-10 pt-6 border-t border-[color:var(--color-border)] flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full bg-[color:var(--color-primary-bg)] text-xs font-medium text-[color:var(--color-primary-dark)]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* CTA box */}
        <aside className="mt-12 rounded-2xl bg-[color:var(--color-primary-bg)] border-2 border-[color:var(--color-primary-soft)] p-6 sm:p-8 text-center">
          <p className="text-2xl mb-2">🩺</p>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[color:var(--color-text)]">
            Bé cần được khám trực tiếp?
          </h2>
          <p className="mt-2 text-[color:var(--color-text-soft)]">
            Bài viết chỉ mang tính tham khảo. Đặt lịch để bác sĩ thăm khám và tư vấn cụ thể.
          </p>
          <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center">
            <Button href="/dang-ky-kham" variant="primary" size="md">
              Đăng ký khám
            </Button>
            <Button href={`tel:${CLINIC.phone}`} variant="outline" size="md">
              Gọi {CLINIC.phoneDisplay}
            </Button>
          </div>
        </aside>
      </Container>
    </main>
  );
}
