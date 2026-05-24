import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PostEditorForm } from "@/components/admin/PostEditorForm";

export const metadata = {
  title: "Viết bài mới — Dế Mèn Admin",
  robots: { index: false, follow: false },
};

export default function NewPostPage() {
  return (
    <main className="py-8 sm:py-10">
      <Container>
        <header className="mb-6">
          <Link href="/admin/blog" className="text-xs text-[color:var(--color-primary-dark)] hover:underline">
            ← Quản lý bài viết
          </Link>
          <h1 className="mt-1 text-3xl font-extrabold">Viết bài mới</h1>
          <p className="text-sm text-[color:var(--color-text-soft)] mt-1">
            Bài sẽ được lưu vào Firestore. Ảnh upload lên Cloudinary.
          </p>
        </header>

        <PostEditorForm />
      </Container>
    </main>
  );
}
