import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { BookingCard } from "@/components/admin/BookingCard";
import { BookingStatusFilter } from "@/components/admin/BookingStatusFilter";
import { getBookingsForAdmin, getBookingStats } from "@/lib/booking/queries";
import type { Booking } from "@/lib/firebase/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Quản lý đặt lịch",
  description: "Dashboard quản lý booking dành cho Bác sĩ Đông.",
  robots: { index: false, follow: false },
};

const VALID: Booking["status"][] = ["pending", "confirmed", "completed", "cancelled"];

function isValidStatus(s: string | undefined): s is Booking["status"] {
  return !!s && (VALID as string[]).includes(s);
}

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const statusFilter = isValidStatus(params.status) ? params.status : undefined;

  const [bookings, stats] = await Promise.all([
    getBookingsForAdmin({ status: statusFilter, limit: 200 }),
    getBookingStats(),
  ]);
  const total = stats.pending + stats.confirmed + stats.completed + stats.cancelled;

  return (
    <main className="py-8 sm:py-10 min-h-screen bg-slate-50">
      <Container>
        <header className="mb-6">
          <p className="text-xs font-bold uppercase tracking-wider text-[color:var(--color-primary-dark)]">
            Admin · Bác sĩ Đông
          </p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[color:var(--color-text)]">
            Quản lý đặt lịch khám
          </h1>
          <p className="mt-1 text-sm text-[color:var(--color-text-soft)]">
            Theo dõi từng booking, gọi xác nhận, cập nhật trạng thái và ghi chú khám.
          </p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatCard
            label="Chờ xác nhận"
            value={stats.pending}
            tone="amber"
            href="/admin/bookings?status=pending"
          />
          <StatCard
            label="Đã xác nhận"
            value={stats.confirmed}
            tone="primary"
            href="/admin/bookings?status=confirmed"
          />
          <StatCard
            label="Đã khám"
            value={stats.completed}
            tone="slate"
            href="/admin/bookings?status=completed"
          />
          <StatCard
            label="Đã huỷ"
            value={stats.cancelled}
            tone="red"
            href="/admin/bookings?status=cancelled"
          />
        </div>

        {/* Filter */}
        <div className="mb-5 flex items-center justify-between gap-3 flex-wrap">
          <BookingStatusFilter active={statusFilter} />
          <p className="text-xs text-[color:var(--color-text-soft)]">
            Hiển thị {bookings.length} / {total} booking
          </p>
        </div>

        {/* List */}
        {bookings.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-[color:var(--color-border)] py-16 text-center bg-white">
            <p className="text-4xl mb-3" aria-hidden>
              📭
            </p>
            <p className="text-[color:var(--color-text-soft)]">
              {statusFilter
                ? `Chưa có booking nào ở trạng thái này.`
                : `Chưa có booking nào. Khi phụ huynh đặt lịch, danh sách sẽ hiện ở đây.`}
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {bookings.map((b, i) => (
              <BookingCard key={b.id} booking={b} defaultExpanded={i === 0 && !!statusFilter} />
            ))}
          </div>
        )}
      </Container>
    </main>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  tone: "amber" | "primary" | "slate" | "red";
  href: string;
}

function StatCard({ label, value, tone, href }: StatCardProps) {
  const toneStyles: Record<StatCardProps["tone"], string> = {
    amber: "border-amber-200 hover:border-amber-300",
    primary: "border-[color:var(--color-primary-soft)] hover:border-[color:var(--color-primary)]",
    slate: "border-slate-200 hover:border-slate-300",
    red: "border-red-200 hover:border-red-300",
  };
  const toneText: Record<StatCardProps["tone"], string> = {
    amber: "text-amber-700",
    primary: "text-[color:var(--color-primary-dark)]",
    slate: "text-slate-700",
    red: "text-red-700",
  };
  return (
    <a
      href={href}
      className={`block rounded-xl bg-white border-2 ${toneStyles[tone]} p-4 transition-colors`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-text-soft)]">
        {label}
      </p>
      <p className={`mt-1 text-3xl font-extrabold ${toneText[tone]}`}>{value}</p>
    </a>
  );
}
