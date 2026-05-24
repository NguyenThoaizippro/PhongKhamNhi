import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { PostEditorForm } from "@/components/admin/PostEditorForm";
import { getPostByIdForAdmin } from "@/lib/blog/queries";

export const metadata = {
  title: "Sửa bài viết — Dế Mèn Admin",
  robots: { index: false, follow: false },
};

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPostByIdForAdmin(id);
  if (!post) notFound();

  return (
    <main className="py-8 sm:py-10">
      <Container>
        <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <Link href="/admin/blog" className="text-xs text-[color:var(--color-primary-dark)] hover:underline">
              ← Quản lý bài viết
            </Link>
            <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold">Sửa bài viết</h1>
          </div>
          <Link
            href={`/blog/${post.slug}`}
            target="_blank"
            rel="noopener"
            className="text-xs font-semibold text-[color:var(--color-primary-dark)] hover:underline"
          >
            Xem bài public ↗
          </Link>
        </header>

        <PostEditorForm
          initial={{
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            content: post.content,
            coverImage: post.coverImage ?? "",
            specialty: post.specialty ?? "",
            tags: post.tags,
            status: post.status,
          }}
        />
      </Container>
    </main>
  );
}
