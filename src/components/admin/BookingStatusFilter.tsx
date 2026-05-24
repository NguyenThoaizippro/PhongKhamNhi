"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { BOOKING_STATUS_OPTIONS } from "./BookingStatusBadge";

const FILTERS = [
  { value: "", label: "Tất cả" },
  ...BOOKING_STATUS_OPTIONS.map((s) => ({ value: s.value, label: s.label })),
];

export function BookingStatusFilter({ active }: { active?: string }) {
  const router = useRouter();
  const params = useSearchParams();

  function setFilter(value: string) {
    const p = new URLSearchParams(params.toString());
    if (value) {
      p.set("status", value);
    } else {
      p.delete("status");
    }
    router.push(`/admin/bookings${p.toString() ? `?${p}` : ""}`);
  }

  return (
    <div
      role="tablist"
      aria-label="Lọc trạng thái booking"
      className="flex flex-wrap gap-1.5 rounded-full bg-slate-100 p-1"
    >
      {FILTERS.map((f) => {
        const selected = (active ?? "") === f.value;
        return (
          <button
            key={f.value}
            role="tab"
            aria-selected={selected}
            type="button"
            onClick={() => setFilter(f.value)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              selected
                ? "bg-white text-[color:var(--color-text)] shadow-sm ring-1 ring-[color:var(--color-border)]"
                : "text-[color:var(--color-text-soft)] hover:text-[color:var(--color-text)]"
            }`}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
