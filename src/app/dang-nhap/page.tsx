import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { MagicLinkForm } from "@/components/auth/MagicLinkForm";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { CLINIC } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Đăng nhập — Phòng Khám Nhi Đồng Dế Mèn",
  description: `Đăng nhập tài khoản phụ huynh tại ${CLINIC.name} để theo dõi lịch khám và lịch sử khám của bé.`,
};

export default function LoginPage() {
  return (
    <main className="py-12 sm:py-16 bg-[color:var(--color-primary-bg)] min-h-[calc(100vh-200px)]">
      <Container size="narrow">
        <header className="text-center mb-8">
          <span className="inline-block text-sm font-bold uppercase tracking-wider text-[color:var(--color-primary-dark)]">
            Phụ huynh
          </span>
          <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-[color:var(--color-text)]">
            Đăng nhập <span className="text-[color:var(--color-accent)]">Dế Mèn</span>
          </h1>
          <p className="mt-3 text-[color:var(--color-text-soft)]">
            Đăng nhập để theo dõi lịch khám và lịch sử của bé.
          </p>
        </header>

        <div className="bg-white rounded-2xl shadow-lg border border-[color:var(--color-border)] p-6 sm:p-8">
          <GoogleSignInButton redirectTo="/" />

          <div className="my-6 flex items-center gap-3 text-xs text-[color:var(--color-text-soft)]">
            <span className="flex-1 h-px bg-[color:var(--color-border)]" />
            HOẶC NHẬN LINK QUA EMAIL
            <span className="flex-1 h-px bg-[color:var(--color-border)]" />
          </div>

          <MagicLinkForm redirectTo="/" />
        </div>

        <p className="mt-6 text-center text-xs text-[color:var(--color-text-soft)]">
          Bạn là bác sĩ?{" "}
          <Link href="/admin/login" className="text-[color:var(--color-primary-dark)] font-semibold hover:underline">
            Đăng nhập tại đây
          </Link>
        </p>

        <p className="mt-2 text-center text-xs text-[color:var(--color-text-soft)]">
          Bằng việc đăng nhập, bạn đồng ý với{" "}
          <Link href="/chinh-sach-bao-mat" className="underline">
            chính sách bảo mật
          </Link>{" "}
          của phòng khám.
        </p>
      </Container>
    </main>
  );
}
