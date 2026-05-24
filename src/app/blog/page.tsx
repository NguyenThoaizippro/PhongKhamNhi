import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { BlogCard } from "@/components/blog/BlogCard";
import { SpecialtyFilter } from "@/components/blog/SpecialtyFilter";
import { getPublishedPosts } from "@/lib/blog/queries";
import { SPECIALTIES, CLINIC } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Blog — Kiến thức nhi khoa | Phòng Khám Dế Mèn",
  description: `Bài viết chia sẻ kiến thức chăm sóc trẻ từ bác sĩ ${CLINIC.name}. Hô hấp, tiêu hoá, dinh dưỡng, da liễu...`,
};

const SPECIALTY_SLUGS = new Set(SPECIALTIES.map((s) => s.slug));

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ specialty?: string }>;
}) {
  const params = await searchParams;
  const specialty = params.specialty && SPECIALTY_SLUGS.has(params.specialty as never)
    ? params.specialty
    : undefined;

  const posts = await getPublishedPosts(specialty);
  const activeSpecialty = SPECIALTIES.find((s) => s.slug === specialty);

  return (
    <main className="py-10 sm:py-14">
      <Container>
        <header className="mb-8 sm:mb-10">
          <p className="text-sm font-bold uppercase tracking-wider text-[color:var(--color-primary-dark)]">
            Blog · Kiến thức nhi khoa
          </p>
          <h1 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
            {activeSpecialty ? (
              <>
                Bài viết về{" "}
                <span className="text-[color:var(--color-accent)]">
                  {activeSpecialty.icon} {activeSpecialty.name}
                </span>
              </>
            ) : (
              <>
                Cẩm nang chăm sóc bé từ{" "}
                <span className="text-[color:var(--color-accent)]">Dế Mèn</span>
              </>
            )}
          </h1>
          <p className="mt-3 text-[color:var(--color-text-soft)] max-w-2xl">
            Bài viết được bác sĩ kiểm duyệt nội dung — chỉ mang tính tham khảo, không thay thế khám
            trực tiếp.
          </p>
        </header>

        <div className="mb-8 sm:mb-10">
          <SpecialtyFilter active={specialty} />
        </div>

        {posts.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-[color:var(--color-border)] py-16 text-center">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-[color:var(--color-text-soft)]">
              Chưa có bài viết nào cho chuyên khoa này.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {posts.map((post, i) => (
              <BlogCard key={post.id} post={post} priority={i < 3} />
            ))}
          </div>
        )}
      </Container>
    </main>
  );
}
