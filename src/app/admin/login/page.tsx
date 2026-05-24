import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { AdminLoginForm } from "@/components/auth/AdminLoginForm";

export const metadata: Metadata = {
  title: "Đăng nhập quản trị — Phòng Khám Dế Mèn",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="py-12 sm:py-16 bg-[color:var(--color-primary-bg)] min-h-[calc(100vh-200px)]">
      <Container size="narrow" className="max-w-md">
        <header className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[color:var(--color-accent-soft)] mb-3">
            <span className="text-2xl">🩺</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[color:var(--color-text)]">
            Đăng nhập quản trị
          </h1>
          <p className="mt-2 text-sm text-[color:var(--color-text-soft)]">
            Khu vực dành cho bác sĩ và quản trị viên.
          </p>
        </header>

        <div className="bg-white rounded-2xl shadow-lg border border-[color:var(--color-border)] p-6 sm:p-8">
          <AdminLoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-[color:var(--color-text-soft)]">
          Bạn là phụ huynh?{" "}
          <Link href="/dang-nhap" className="text-[color:var(--color-primary-dark)] font-semibold hover:underline">
            Đăng nhập tại đây
          </Link>
        </p>
      </Container>
    </main>
  );
}
