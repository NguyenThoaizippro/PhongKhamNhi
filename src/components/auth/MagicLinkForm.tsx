"use client";

import { useState } from "react";
import { sendSignInLinkToEmail } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

const LS_EMAIL_KEY = "demen_emailForSignIn";
const LS_REDIRECT_KEY = "demen_redirectAfterSignIn";

export function MagicLinkForm({ redirectTo = "/" }: { redirectTo?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Email không hợp lệ");
      return;
    }

    setStatus("sending");
    try {
      await sendSignInLinkToEmail(auth, trimmed, {
        url: `${window.location.origin}/dang-nhap/finish`,
        handleCodeInApp: true,
      });
      window.localStorage.setItem(LS_EMAIL_KEY, trimmed);
      window.localStorage.setItem(LS_REDIRECT_KEY, redirectTo);
      setStatus("sent");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Không gửi được email";
      setError(
        msg.includes("auth/unauthorized-continue-uri")
          ? "Domain chưa được phép. Liên hệ phòng khám."
          : "Không gửi được email. Thử lại sau."
      );
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-lg bg-[color:var(--color-primary-bg)] border border-[color:var(--color-primary-soft)] p-5 text-center">
        <div className="text-3xl mb-2">📬</div>
        <h3 className="font-bold text-[color:var(--color-primary-dark)]">Đã gửi link đăng nhập!</h3>
        <p className="mt-2 text-sm text-[color:var(--color-text)]">
          Mở email <strong>{email}</strong> và click vào link để đăng nhập. Link có hiệu lực
          trong vòng 1 giờ.
        </p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setEmail("");
          }}
          className="mt-3 text-xs text-[color:var(--color-primary-dark)] hover:underline"
        >
          ← Gửi cho email khác
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {error && (
        <div
          role="alert"
          className="rounded-lg bg-red-50 border border-[color:var(--color-danger)] p-3 text-sm text-[color:var(--color-danger)]"
        >
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1.5">
          Email của bạn
        </label>
        <input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="phuhuynh@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-[color:var(--color-border)] px-3.5 py-2.5 text-sm focus:border-[color:var(--color-primary)] focus:ring-2 focus:ring-[color:var(--color-primary-soft)] focus:outline-none"
          required
        />
        <p className="mt-1.5 text-xs text-[color:var(--color-text-soft)]">
          Chúng tôi sẽ gửi link đăng nhập đến email của bạn. Không cần mật khẩu.
        </p>
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--color-primary)] hover:bg-[color:var(--color-primary-dark)] text-white px-6 py-3 text-base font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "sending" && (
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
            <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          </svg>
        )}
        {status === "sending" ? "Đang gửi..." : "Gửi link đăng nhập"}
      </button>
    </form>
  );
}

export { LS_EMAIL_KEY, LS_REDIRECT_KEY };
