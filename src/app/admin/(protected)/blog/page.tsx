import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { getAllPostsForAdmin } from "@/lib/blog/queries";
import { SPECIALTIES } from "@/lib/constants";

export const metadata = {
  title: "Quản lý bài viết — Dế Mèn Admin",
  robots: { index: false, follow: false },
};

const SPECIALTY_LOOKUP = new Map(SPECIALTIES.map((s) => [s.slug, s]));

export default async function AdminBlogListPage() {
  const posts = await getAllPostsForAdmin();

  return (
    <main className="py-10">
      <Container>
        <header className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <Link href="/admin" className="text-xs text-[color:var(--color-primary-dark)] hover:underline">
              ← Trang quản trị
            </Link>
            <h1 className="mt-1 text-3xl font-extrabold">Quản lý bài viết</h1>
            <p className="text-sm text-[color:var(--color-text-soft)] mt-1">
              Tổng: {posts.length} bài
            </p>
          </div>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-accent)] hover:bg-[color:var(--color-accent-dark)] text-white px-5 py-2.5 text-sm font-semibold"
          >
            ✏️ Viết bài mới
          </Link>
        </header>

        {posts.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-[color:var(--color-border)] py-16 text-center">
            <p className="text-4xl mb-3">📝</p>
            <p className="text-[color:var(--color-text-soft)]">
              Chưa có bài viết nào. Bấm <strong>&quot;Viết bài mới&quot;</strong> để bắt đầu.
            </p>
            <p className="mt-2 text-xs text-[color:var(--color-text-soft)]">
              (Nếu Firebase Admin chưa cấu hình, list sẽ trống. 3 mock posts vẫn hiện ở /blog public.)
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-white">
            <table className="w-full text-sm">
              <thead className="bg-[color:var(--color-primary-bg)] text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold">Tiêu đề</th>
                  <th className="px-4 py-3 font-semibold hidden sm:table-cell">Chuyên khoa</th>
                  <th className="px-4 py-3 font-semibold">Trạng thái</th>
                  <th className="px-4 py-3 font-semibold hidden md:table-cell">Cập nhật</th>
                  <th className="px-4 py-3 font-semibold text-right">Sửa</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((p) => {
                  const sp = p.specialty ? SPECIALTY_LOOKUP.get(p.specialty) : undefined;
                  return (
                    <tr key={p.id} className="border-t border-[color:var(--color-border)] hover:bg-[color:var(--color-primary-bg)]/30">
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/blog/${p.id}/edit`}
                          className="font-semibold hover:text-[color:var(--color-primary-dark)]"
                        >
                          {p.title}
                        </Link>
                        <p className="text-xs text-[color:var(--color-text-soft)] mt-0.5">/blog/{p.slug}</p>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell text-xs">
                        {sp ? `${sp.icon} ${sp.name}` : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-xs text-[color:var(--color-text-soft)]">
                        {new Date(p.publishedAt).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/blog/${p.id}/edit`}
                          className="text-xs font-semibold text-[color:var(--color-primary-dark)] hover:underline"
                        >
                          Sửa →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Container>
    </main>
  );
}

function StatusBadge({ status }: { status: "draft" | "published" }) {
  if (status === "published") {
    return (
      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[color:var(--color-primary-bg)] text-[color:var(--color-primary-dark)]">
        Đã đăng
      </span>
    );
  }
  return (
    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-gray-100 text-gray-600">
      Nháp
    </span>
  );
}
