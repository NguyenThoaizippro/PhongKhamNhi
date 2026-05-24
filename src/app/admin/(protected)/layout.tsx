"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";

export default function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/admin/login");
    } else if (!isAdmin) {
      router.replace("/");
    }
  }, [user, loading, isAdmin, router]);

  if (loading || !user || !isAdmin) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-[color:var(--color-text-soft)]">
          <svg className="w-8 h-8 animate-spin text-[color:var(--color-primary)]" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
            <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          </svg>
          <p className="text-sm">Đang kiểm tra quyền truy cập...</p>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
