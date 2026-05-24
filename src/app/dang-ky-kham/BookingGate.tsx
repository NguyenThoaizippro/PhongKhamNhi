"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { BookingForm } from "./BookingForm";

/**
 * Auth wall cho trang đăng ký khám:
 * - Loading → spinner
 * - Chưa login → CTA Google sign-in / link tới /dang-nhap với redirect
 * - Đã login → render form, prefill tên + email từ profile Firebase Auth
 *
 * UID + email được pass xuống form qua hidden input để server action verify.
 */
export function BookingGate() {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const [idToken, setIdToken] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setIdToken(null);
      return;
    }
    let cancelled = false;
    void user.getIdToken().then((t) => {
      if (!cancelled) setIdToken(t);
    });
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-10 text-[color:var(--color-text-soft)]">
        <svg
          className="w-7 h-7 animate-spin text-[color:var(--color-primary)]"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
          <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        </svg>
        <p className="text-sm">Đang kiểm tra phiên đăng nhập...</p>
      </div>
    );
  }

  if (!user) {
    const loginHref = `/dang-nhap?redirect=${encodeURIComponent(pathname)}`;
    return (
      <div className="text-center py-4">
        <div className="text-5xl mb-3" aria-hidden>
          🔐
        </div>
        <h2 className="text-xl font-bold text-[color:var(--color-text)]">
          Vui lòng đăng nhập để đặt lịch
        </h2>
        <p className="mt-2 text-sm text-[color:var(--color-text-soft)] max-w-md mx-auto">
          Đăng nhập giúp ba mẹ theo dõi lịch sử khám, nhận email xác nhận và đỡ phải nhập
          lại thông tin lần sau.
        </p>

        <div className="mt-6 max-w-sm mx-auto space-y-3">
          <GoogleSignInButton redirectTo={pathname} />

          <div className="flex items-center gap-3 text-xs text-[color:var(--color-text-soft)] py-1">
            <span className="flex-1 h-px bg-[color:var(--color-border)]" />
            HOẶC
            <span className="flex-1 h-px bg-[color:var(--color-border)]" />
          </div>

          <Link
            href={loginHref}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full border-2 border-[color:var(--color-primary)] text-[color:var(--color-primary-dark)] hover:bg-[color:var(--color-primary-bg)] px-6 py-3 text-base font-semibold"
          >
            ✉ Nhận link đăng nhập qua email
          </Link>
        </div>

        <p className="mt-6 text-xs text-[color:var(--color-text-soft)]">
          Cần gấp? Gọi <strong>0985.350.570</strong> để đặt lịch trực tiếp.
        </p>
      </div>
    );
  }

  return (
    <BookingForm
      prefillName={user.displayName ?? ""}
      prefillEmail={user.email ?? ""}
      idToken={idToken}
    />
  );
}
