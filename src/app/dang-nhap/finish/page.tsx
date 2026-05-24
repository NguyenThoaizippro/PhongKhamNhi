"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { Container } from "@/components/ui/Container";
import { LS_EMAIL_KEY, LS_REDIRECT_KEY } from "@/components/auth/MagicLinkForm";

type Phase = "loading" | "need-email" | "verifying" | "success" | "error";

export default function FinishSignInPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("loading");
  const [emailInput, setEmailInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isSignInWithEmailLink(auth, window.location.href)) {
      setPhase("error");
      setError("Link không hợp lệ hoặc đã hết hạn.");
      return;
    }
    const stored = window.localStorage.getItem(LS_EMAIL_KEY);
    if (stored) {
      void completeSignIn(stored);
    } else {
      setPhase("need-email");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function completeSignIn(email: string) {
    setPhase("verifying");
    setError(null);
    try {
      await signInWithEmailLink(auth, email, window.location.href);
      window.localStorage.removeItem(LS_EMAIL_KEY);
      const redirect = window.localStorage.getItem(LS_REDIRECT_KEY) ?? "/";
      window.localStorage.removeItem(LS_REDIRECT_KEY);
      setPhase("success");
      setTimeout(() => {
        router.push(redirect);
        router.refresh();
      }, 800);
    } catch {
      setPhase("error");
      setError("Email không khớp với link, hoặc link đã hết hạn.");
    }
  }

  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.trim())) {
      setError("Email không hợp lệ");
      return;
    }
    void completeSignIn(emailInput.trim());
  }

  return (
    <main className="py-16 sm:py-20 bg-[color:var(--color-primary-bg)] min-h-[calc(100vh-200px)]">
      <Container size="narrow" className="max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border border-[color:var(--color-border)] p-8 text-center">
          {phase === "loading" || phase === "verifying" ? (
            <>
              <Spinner />
              <p className="mt-3 text-sm text-[color:var(--color-text-soft)]">
                Đang xác thực đăng nhập...
              </p>
            </>
          ) : phase === "success" ? (
            <>
              <div className="text-5xl mb-3">✅</div>
              <h1 className="text-xl font-bold text-[color:var(--color-primary-dark)]">
                Đăng nhập thành công!
              </h1>
              <p className="mt-2 text-sm text-[color:var(--color-text-soft)]">
                Đang chuyển hướng...
              </p>
            </>
          ) : phase === "need-email" ? (
            <>
              <div className="text-4xl mb-3">📧</div>
              <h1 className="text-xl font-bold">Xác nhận email</h1>
              <p className="mt-2 text-sm text-[color:var(--color-text-soft)]">
                Vui lòng nhập lại email bạn đã dùng để nhận link (vì bạn mở link trên thiết bị
                khác).
              </p>
              <form onSubmit={handleEmailSubmit} className="mt-5 space-y-3 text-left">
                {error && (
                  <div className="rounded-lg bg-red-50 border border-[color:var(--color-danger)] p-2.5 text-xs text-[color:var(--color-danger)]">
                    {error}
                  </div>
                )}
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="email@gmail.com"
                  required
                  className="w-full rounded-lg border border-[color:var(--color-border)] px-3.5 py-2.5 text-sm focus:border-[color:var(--color-primary)] focus:ring-2 focus:ring-[color:var(--color-primary-soft)] focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full rounded-full bg-[color:var(--color-primary)] hover:bg-[color:var(--color-primary-dark)] text-white px-6 py-2.5 text-sm font-semibold"
                >
                  Xác nhận
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="text-5xl mb-3">⚠️</div>
              <h1 className="text-xl font-bold text-[color:var(--color-danger)]">Link không hợp lệ</h1>
              <p className="mt-2 text-sm text-[color:var(--color-text-soft)]">
                {error ?? "Vui lòng yêu cầu link mới."}
              </p>
              <Link
                href="/dang-nhap"
                className="mt-5 inline-block rounded-full bg-[color:var(--color-primary)] hover:bg-[color:var(--color-primary-dark)] text-white px-6 py-2.5 text-sm font-semibold"
              >
                Quay lại đăng nhập
              </Link>
            </>
          )}
        </div>
      </Container>
    </main>
  );
}

function Spinner() {
  return (
    <svg className="w-10 h-10 mx-auto animate-spin text-[color:var(--color-primary)]" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
      <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
