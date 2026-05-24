import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Quản trị — Phòng Khám Dế Mèn",
  robots: { index: false, follow: false },
};

export default function AdminDashboardPage() {
  return (
    <main className="py-10 sm:py-14">
      <Container>
        <header className="mb-8">
          <p className="text-sm font-bold uppercase tracking-wider text-[color:var(--color-primary-dark)]">
            Quản trị
          </p>
          <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold">
            Chào mừng bác sĩ 👋
          </h1>
          <p className="mt-2 text-[color:var(--color-text-soft)]">
            Khu vực quản trị nội bộ. Chọn tác vụ bên dưới.
          </p>
        </header>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AdminCard
            href="/admin/bookings"
            icon="📅"
            title="Lịch khám"
            desc="Xem và xác nhận đặt lịch của phụ huynh"
          />
          <AdminCard
            href="/admin/blog"
            icon="📝"
            title="Viết blog"
            desc="Đăng bài chia sẻ kiến thức nhi khoa"
          />
          <AdminCard
            href="/admin/unanswered"
            icon="❓"
            title="Câu hỏi chờ duyệt"
            desc="Câu hỏi chatbot chưa trả lời được"
          />
        </div>
      </Container>
    </main>
  );
}

function AdminCard({
  href,
  icon,
  title,
  desc,
  todo,
}: {
  href: string;
  icon: string;
  title: string;
  desc: string;
  todo?: boolean;
}) {
  const cls =
    "block rounded-2xl border border-[color:var(--color-border)] bg-white p-5 hover:border-[color:var(--color-primary)] hover:shadow-md transition";
  const inner = (
    <>
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className="font-bold text-lg flex items-center gap-2">
        {title}
        {todo && (
          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[color:var(--color-primary-bg)] text-[color:var(--color-primary-dark)]">
            Sắp có
          </span>
        )}
      </h3>
      <p className="mt-1 text-sm text-[color:var(--color-text-soft)]">{desc}</p>
    </>
  );

  if (todo) {
    return (
      <div className={`${cls} opacity-70 cursor-not-allowed`} aria-disabled>
        {inner}
      </div>
    );
  }
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}
