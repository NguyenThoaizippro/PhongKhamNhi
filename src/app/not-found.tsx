import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Không tìm thấy trang",
  description: "Trang ba mẹ tìm không tồn tại hoặc đã được di chuyển.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        <div className="text-7xl mb-4" aria-hidden>
          🦗
        </div>
        <h1 className="text-3xl font-bold text-[color:var(--color-primary-dark)]">
          Ối, Dế Mèn không tìm thấy trang này
        </h1>
        <p className="mt-3 text-[color:var(--color-text-soft)]">
          Đường dẫn không tồn tại hoặc đã được di chuyển. Ba mẹ thử về trang chủ
          hoặc xem các bài viết sức khoẻ nhé.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="rounded-full bg-[color:var(--color-primary)] hover:bg-[color:var(--color-primary-dark)] text-white font-semibold px-5 py-2.5 text-sm"
          >
            Về trang chủ
          </Link>
          <Link
            href="/dang-ky-kham"
            className="rounded-full border border-[color:var(--color-primary)] text-[color:var(--color-primary-dark)] hover:bg-[color:var(--color-primary-bg)] font-semibold px-5 py-2.5 text-sm"
          >
            Đặt lịch khám
          </Link>
        </div>
        <p className="mt-6 text-xs text-[color:var(--color-text-soft)]">
          Hoặc gọi <strong>0985.350.570</strong> để được hỗ trợ.
        </p>
      </div>
    </main>
  );
}
