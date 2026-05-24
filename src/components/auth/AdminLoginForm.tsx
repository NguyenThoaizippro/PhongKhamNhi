"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { adminLoginSchema } from "@/lib/validation/auth";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = adminLoginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, parsed.data.email, parsed.data.password);
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Email hoặc mật khẩu không đúng.");
    } finally {
      setLoading(false);
    }
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
        <label htmlFor="admin-email" className="block text-sm font-medium mb-1.5">
          Email
        </label>
        <input
          id="admin-email"
          type="email"
          autoComplete="email"
          placeholder="bacsi@demen.vn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-[color:var(--color-border)] px-3.5 py-2.5 text-sm focus:border-[color:var(--color-primary)] focus:ring-2 focus:ring-[color:var(--color-primary-soft)] focus:outline-none"
          required
        />
      </div>

      <div>
        <label htmlFor="admin-password" className="block text-sm font-medium mb-1.5">
          Mật khẩu
        </label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-[color:var(--color-border)] px-3.5 py-2.5 text-sm focus:border-[color:var(--color-primary)] focus:ring-2 focus:ring-[color:var(--color-primary-soft)] focus:outline-none"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--color-accent)] hover:bg-[color:var(--color-accent-dark)] text-white px-6 py-3 text-base font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading && (
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
            <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          </svg>
        )}
        {loading ? "Đang xử lý..." : "Đăng nhập"}
      </button>
    </form>
  );
}
