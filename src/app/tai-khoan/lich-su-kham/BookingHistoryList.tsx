"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthProvider";
import { SPECIALTIES } from "@/lib/constants";
import { BookingStatusBadge } from "@/components/admin/BookingStatusBadge";
import { Button } from "@/components/ui/Button";
import type { BookingView } from "@/lib/booking/queries";

function specialtyName(slug: string): string {
  return SPECIALTIES.find((s) => s.slug === slug)?.name ?? slug;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso + (iso.length === 10 ? "T00:00:00" : "")).toLocaleDateString(
      "vi-VN",
      { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" }
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

type LoadState =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "ready"; bookings: BookingView[] };

export function BookingHistoryList() {
  const { user, loading } = useAuth();
  const [state, setState] = useState<LoadState>({ kind: "loading" });

  useEffect(() => {
    if (loading) return;
    if (!user) {
      setState({ kind: "ready", bookings: [] });
      return;
    }

    let cancelled = false;
    void (async () => {
      try {
        const token = await user.getIdToken();
        const res = await fetch("/api/me/bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          if (cancelled) return;
          setState({ kind: "error", message: "Không tải được lịch sử đặt lịch" });
          return;
        }
        const data = (await res.json()) as { bookings: BookingView[] };
        if (!cancelled) setState({ kind: "ready", bookings: data.bookings });
      } catch {
        if (!cancelled) {
          setState({ kind: "error", message: "Lỗi kết nối, ba mẹ thử lại sau" });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, loading]);

  if (loading || state.kind === "loading") {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-[color:var(--color-text-soft)]">
        <svg
          className="w-7 h-7 animate-spin text-[color:var(--color-primary)]"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
          <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        </svg>
        <p className="text-sm">Đang tải lịch sử...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-3" aria-hidden>
          🔐
        </div>
        <h2 className="text-xl font-bold">Vui lòng đăng nhập</h2>
        <p className="mt-2 text-sm text-[color:var(--color-text-soft)]">
          Đăng nhập để xem lịch sử đặt lịch khám của bé.
        </p>
        <div className="mt-5">
          <Button
            href={`/dang-nhap?redirect=${encodeURIComponent("/tai-khoan/lich-su-kham")}`}
            variant="primary"
            size="md"
          >
            Đăng nhập
          </Button>
        </div>
      </div>
    );
  }

  if (state.kind === "error") {
    return (
      <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-6 text-center" role="alert">
        <p className="font-semibold text-red-700">{state.message}</p>
      </div>
    );
  }

  if (state.bookings.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-[color:var(--color-border)] py-16 text-center bg-white">
        <div className="text-4xl mb-3" aria-hidden>
          📭
        </div>
        <p className="text-[color:var(--color-text-soft)] mb-5">
          Ba mẹ chưa có lịch khám nào. Đặt lịch đầu tiên cho bé nhé!
        </p>
        <Button href="/dang-ky-kham" variant="primary" size="md">
          Đặt lịch khám
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {state.bookings.map((b) => (
        <article
          key={b.id}
          className="rounded-xl border border-[color:var(--color-border)] bg-white p-4 sm:p-5"
        >
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <h3 className="font-bold text-lg">
                Bé {b.childName}
                <span className="ml-2 text-sm font-normal text-[color:var(--color-text-soft)]">
                  · {specialtyName(b.specialty)}
                </span>
              </h3>
              <p className="mt-1 text-sm text-[color:var(--color-text)]">
                📅 {formatDate(b.preferredDate)} ·{" "}
                <strong>{b.preferredTimeSlot.replace("-", " – ")}</strong>
              </p>
            </div>
            <BookingStatusBadge status={b.status} />
          </div>

          {b.symptoms && (
            <div className="mt-3 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-sm">
              <span className="text-xs font-semibold text-amber-800 uppercase tracking-wide block mb-0.5">
                Triệu chứng
              </span>
              <span className="whitespace-pre-wrap">{b.symptoms}</span>
            </div>
          )}

          {b.doctorNote && b.status !== "pending" && (
            <div className="mt-3 rounded-lg bg-[color:var(--color-primary-bg)] border border-[color:var(--color-primary-soft)] px-3 py-2 text-sm">
              <span className="text-xs font-semibold text-[color:var(--color-primary-dark)] uppercase tracking-wide block mb-0.5">
                Ghi chú từ bác sĩ
              </span>
              <span className="whitespace-pre-wrap">{b.doctorNote}</span>
            </div>
          )}

          <div className="mt-3 flex items-center justify-between gap-3 flex-wrap text-xs text-[color:var(--color-text-soft)]">
            <span>Đặt lúc: {formatDateTime(b.createdAt)}</span>
            <code className="font-mono">#{b.id.slice(0, 8)}</code>
          </div>
        </article>
      ))}

      <div className="pt-3 text-center">
        <Link
          href="/dang-ky-kham"
          className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-accent)] hover:bg-[color:var(--color-accent-dark)] text-white px-5 py-2.5 text-sm font-semibold"
        >
          + Đặt lịch mới
        </Link>
      </div>
    </div>
  );
}
