import type { Booking } from "@/lib/firebase/types";

const STATUS_CONFIG: Record<
  Booking["status"],
  { label: string; bg: string; text: string; ring: string }
> = {
  pending: {
    label: "Chờ xác nhận",
    bg: "bg-amber-50",
    text: "text-amber-800",
    ring: "ring-amber-200",
  },
  confirmed: {
    label: "Đã xác nhận",
    bg: "bg-[color:var(--color-primary-bg)]",
    text: "text-[color:var(--color-primary-dark)]",
    ring: "ring-[color:var(--color-primary-soft)]",
  },
  completed: {
    label: "Đã khám",
    bg: "bg-slate-100",
    text: "text-slate-700",
    ring: "ring-slate-200",
  },
  cancelled: {
    label: "Đã huỷ",
    bg: "bg-red-50",
    text: "text-red-700",
    ring: "ring-red-200",
  },
};

export function BookingStatusBadge({ status }: { status: Booking["status"] }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${cfg.bg} ${cfg.text} ${cfg.ring}`}
    >
      <span
        aria-hidden
        className={`w-1.5 h-1.5 rounded-full ${cfg.text.replace("text-", "bg-")}`}
      />
      {cfg.label}
    </span>
  );
}

export const BOOKING_STATUS_OPTIONS: Array<{ value: Booking["status"]; label: string }> = [
  { value: "pending", label: "Chờ xác nhận" },
  { value: "confirmed", label: "Đã xác nhận" },
  { value: "completed", label: "Đã khám" },
  { value: "cancelled", label: "Đã huỷ" },
];
