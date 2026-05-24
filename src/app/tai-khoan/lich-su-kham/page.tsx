import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { BookingHistoryList } from "./BookingHistoryList";

export const metadata: Metadata = {
  title: "Lịch sử đặt lịch khám",
  description: "Theo dõi các lần đặt lịch khám của bé tại Phòng Khám Dế Mèn.",
  robots: { index: false, follow: false },
};

export default function BookingHistoryPage() {
  return (
    <main className="py-10 sm:py-14 min-h-screen bg-[color:var(--color-primary-bg)]/40">
      <Container size="narrow">
        <header className="mb-6 sm:mb-8">
          <p className="text-xs font-bold uppercase tracking-wider text-[color:var(--color-primary-dark)]">
            Tài khoản phụ huynh
          </p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[color:var(--color-text)]">
            Lịch sử đặt lịch khám
          </h1>
          <p className="mt-1 text-sm text-[color:var(--color-text-soft)]">
            Tất cả các lần ba mẹ đặt lịch cho bé tại phòng khám.
          </p>
        </header>

        <BookingHistoryList />
      </Container>
    </main>
  );
}
