"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/client";
import { SPECIALTIES } from "@/lib/constants";
import { BookingStatusBadge, BOOKING_STATUS_OPTIONS } from "./BookingStatusBadge";
import type { BookingView } from "@/lib/booking/queries";
import type { Booking } from "@/lib/firebase/types";

function specialtyName(slug: string): string {
  return SPECIALTIES.find((s) => s.slug === slug)?.name ?? slug;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso + (iso.length === 10 ? "T00:00:00" : "")).toLocaleDateString(
      "vi-VN",
      { weekday: "short", day: "2-digit", month: "2-digit", year: "numeric" }
    );
  } catch {
    return iso;
  }
}

function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function ageFromBirthDate(birthDate: string): string {
  try {
    const b = new Date(birthDate);
    const now = new Date();
    const months =
      (now.getFullYear() - b.getFullYear()) * 12 + (now.getMonth() - b.getMonth());
    if (months < 12) return `${Math.max(0, months)} tháng`;
    const years = Math.floor(months / 12);
    return `${years} tuổi`;
  } catch {
    return "—";
  }
}

interface Props {
  booking: BookingView;
  /** Expanded inline để xem chi tiết + edit status */
  defaultExpanded?: boolean;
}

export function BookingCard({ booking, defaultExpanded = false }: Props) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [status, setStatus] = useState<Booking["status"]>(booking.status);
  const [doctorNote, setDoctorNote] = useState(booking.doctorNote ?? "");
  const [saving, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const isDirty = status !== booking.status || doctorNote !== (booking.doctorNote ?? "");

  async function handleSave() {
    setError(null);
    try {
      const user = auth.currentUser;
      if (!user) {
        setError("Phiên đăng nhập hết hạn — vui lòng đăng nhập lại");
        return;
      }
      const token = await user.getIdToken();
      const res = await fetch(`/api/admin/bookings/${booking.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, doctorNote }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Lưu thất bại");
        return;
      }
      setSavedAt(Date.now());
      startTransition(() => router.refresh());
    } catch (err) {
      console.error("[BookingCard] save error:", err);
      setError("Lỗi kết nối, thử lại sau");
    }
  }

  return (
    <article className="rounded-xl border border-[color:var(--color-border)] bg-white overflow-hidden">
      {/* Header — luôn hiện */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="w-full flex items-start gap-3 p-4 hover:bg-[color:var(--color-primary-bg)]/30 text-left transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <h3 className="font-bold text-[color:var(--color-text)] text-base">
                Bé {booking.childName}{" "}
                <span className="text-sm font-normal text-[color:var(--color-text-soft)]">
                  · {ageFromBirthDate(booking.childBirthDate)}
                </span>
              </h3>
              <p className="mt-0.5 text-sm text-[color:var(--color-text-soft)]">
                {specialtyName(booking.specialty)} · {formatDate(booking.preferredDate)} ·{" "}
                {booking.preferredTimeSlot.replace("-", " – ")}
              </p>
            </div>
            <BookingStatusBadge status={booking.status} />
          </div>
          <p className="mt-1.5 text-xs text-[color:var(--color-text-soft)] truncate">
            📞 {booking.parentPhone}
            {booking.parentEmail && (
              <>
                {" · "}✉ {booking.parentEmail}
              </>
            )}
            {booking.source && (
              <>
                {" · "}
                <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold rounded px-1.5 py-0.5 bg-slate-100 text-slate-600">
                  {booking.source === "chatbot" ? "🤖 Chatbot" : "📝 Web form"}
                </span>
              </>
            )}
          </p>
        </div>
        <svg
          className={`w-5 h-5 mt-1 text-[color:var(--color-text-soft)] transition-transform flex-shrink-0 ${
            expanded ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Body — chỉ expanded */}
      {expanded && (
        <div className="border-t border-[color:var(--color-border)] p-4 bg-slate-50/50">
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <DetailRow label="Tên bé" value={booking.childName} />
            <DetailRow
              label="Ngày sinh"
              value={`${formatDate(booking.childBirthDate)} (${ageFromBirthDate(
                booking.childBirthDate
              )})`}
            />
            <DetailRow label="Phụ huynh" value={booking.parentName} />
            <DetailRow
              label="SĐT"
              value={
                <a
                  href={`tel:${booking.parentPhone}`}
                  className="text-[color:var(--color-primary-dark)] hover:underline font-medium"
                >
                  {booking.parentPhone}
                </a>
              }
            />
            {booking.parentEmail && (
              <DetailRow
                label="Email"
                value={
                  <a
                    href={`mailto:${booking.parentEmail}`}
                    className="text-[color:var(--color-primary-dark)] hover:underline"
                  >
                    {booking.parentEmail}
                  </a>
                }
              />
            )}
            <DetailRow label="Chuyên khoa" value={specialtyName(booking.specialty)} />
            <DetailRow label="Ngày khám" value={formatDate(booking.preferredDate)} />
            <DetailRow
              label="Khung giờ"
              value={booking.preferredTimeSlot.replace("-", " – ")}
            />
            <DetailRow
              label="Đặt lúc"
              value={formatDateTime(booking.createdAt)}
              span2
            />
            {booking.symptoms && (
              <div className="sm:col-span-2 mt-1">
                <div className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-text-soft)] mb-1">
                  Triệu chứng / Lý do khám
                </div>
                <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-sm whitespace-pre-wrap">
                  {booking.symptoms}
                </div>
              </div>
            )}
          </div>

          {/* Action panel */}
          <div className="mt-5 pt-4 border-t border-[color:var(--color-border)]">
            <div className="grid sm:grid-cols-[1fr_auto] gap-3 items-end">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-[color:var(--color-text-soft)] mb-1.5">
                  Trạng thái
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Booking["status"])}
                  disabled={saving}
                  className="rounded-lg border border-[color:var(--color-border)] bg-white px-3 py-2 text-sm focus:border-[color:var(--color-primary)] focus:ring-2 focus:ring-[color:var(--color-primary-soft)] focus:outline-none"
                >
                  {BOOKING_STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-xs font-semibold uppercase tracking-wide text-[color:var(--color-text-soft)] mb-1.5">
                Ghi chú của bác sĩ
              </label>
              <textarea
                value={doctorNote}
                onChange={(e) => setDoctorNote(e.target.value)}
                rows={2}
                maxLength={1000}
                placeholder="VD: Đã gọi xác nhận. Hẹn đến đúng giờ. Có tiền sử hen suyễn..."
                disabled={saving}
                className="w-full rounded-lg border border-[color:var(--color-border)] bg-white px-3 py-2 text-sm focus:border-[color:var(--color-primary)] focus:ring-2 focus:ring-[color:var(--color-primary-soft)] focus:outline-none resize-y"
              />
            </div>

            <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
              <div className="text-xs text-[color:var(--color-text-soft)]">
                {savedAt && !isDirty && <span className="text-[color:var(--color-primary-dark)]">✓ Đã lưu</span>}
                {error && <span role="alert" className="text-red-600">{error}</span>}
              </div>
              <div className="flex gap-2">
                <a
                  href={`tel:${booking.parentPhone}`}
                  className="inline-flex items-center gap-1.5 rounded-full border-2 border-[color:var(--color-primary)] text-[color:var(--color-primary-dark)] px-4 py-1.5 text-sm font-semibold hover:bg-[color:var(--color-primary-bg)]"
                >
                  📞 Gọi PH
                </a>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!isDirty || saving}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-accent)] hover:bg-[color:var(--color-accent-dark)] text-white px-5 py-1.5 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {saving ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

function DetailRow({
  label,
  value,
  span2,
}: {
  label: string;
  value: React.ReactNode;
  span2?: boolean;
}) {
  return (
    <div className={span2 ? "sm:col-span-2" : undefined}>
      <div className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-text-soft)]">
        {label}
      </div>
      <div className="mt-0.5 text-[color:var(--color-text)]">{value}</div>
    </div>
  );
}
