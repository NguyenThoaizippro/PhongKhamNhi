import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { BookingForm } from "./BookingForm";
import { CLINIC } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Đăng ký khám — Phòng Khám Nhi Đồng Dế Mèn",
  description: `Đăng ký lịch khám cho bé tại Phòng Khám Dế Mèn. Giờ hoạt động ${CLINIC.hours}, hotline ${CLINIC.phoneDisplay}.`,
};

export default function BookingPage() {
  return (
    <main className="py-12 sm:py-16 bg-[color:var(--color-primary-bg)]">
      <Container size="narrow">
        <header className="text-center mb-10">
          <span className="inline-block text-sm font-bold uppercase tracking-wider text-[color:var(--color-primary-dark)]">
            Đăng ký khám
          </span>
          <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-[color:var(--color-text)]">
            Đặt lịch cho bé tại{" "}
            <span className="text-[color:var(--color-accent)]">Dế Mèn</span>
          </h1>
          <p className="mt-3 text-[color:var(--color-text-soft)]">
            Điền thông tin bên dưới, phòng khám sẽ gọi xác nhận trong 24 giờ.
          </p>
        </header>

        <div className="bg-white rounded-2xl shadow-lg border border-[color:var(--color-border)] p-6 sm:p-8 lg:p-10">
          <BookingForm />
        </div>

        <aside className="mt-6 text-center text-sm text-[color:var(--color-text-soft)]">
          Cần hỗ trợ?{" "}
          <a
            href={`tel:${CLINIC.phone}`}
            className="text-[color:var(--color-primary-dark)] font-semibold hover:underline"
          >
            Gọi {CLINIC.phoneDisplay}
          </a>{" "}
          (từ {CLINIC.hours} mỗi ngày)
        </aside>
      </Container>
    </main>
  );
}
