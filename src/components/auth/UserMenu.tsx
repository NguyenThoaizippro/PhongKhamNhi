"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";
import { formatPhone } from "@/lib/utils";

export function UserMenu() {
  const { user, isAdmin, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  if (!user) return null;

  const label =
    user.displayName ||
    user.email ||
    (user.phoneNumber ? formatPhone(user.phoneNumber.replace(/^\+84/, "0")) : "Tài khoản");
  const initial = (user.displayName?.[0] || user.email?.[0] || "🦗").toUpperCase();

  async function handleLogout() {
    await logout();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 hover:bg-[color:var(--color-primary-bg)] transition"
      >
        <span className="w-8 h-8 rounded-full bg-[color:var(--color-primary)] text-white inline-flex items-center justify-center text-sm font-bold">
          {initial}
        </span>
        <span className="hidden sm:inline text-sm font-medium max-w-[160px] truncate">
          {label}
        </span>
        <svg className="w-4 h-4 text-[color:var(--color-text-soft)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-lg border border-[color:var(--color-border)] py-2 z-50"
        >
          <div className="px-4 py-2 border-b border-[color:var(--color-border)]">
            <p className="text-xs text-[color:var(--color-text-soft)]">Đăng nhập với</p>
            <p className="text-sm font-medium truncate">{label}</p>
            {isAdmin && (
              <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[color:var(--color-accent-soft)] text-[color:var(--color-accent-dark)]">
                Bác sĩ
              </span>
            )}
          </div>
          {isAdmin && (
            <Link
              role="menuitem"
              href="/admin"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm hover:bg-[color:var(--color-primary-bg)]"
            >
              🩺 Trang quản trị
            </Link>
          )}
          <Link
            role="menuitem"
            href="/dang-ky-kham"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm hover:bg-[color:var(--color-primary-bg)]"
          >
            📅 Đăng ký khám
          </Link>
          <Link
            role="menuitem"
            href="/tai-khoan/lich-su-kham"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm hover:bg-[color:var(--color-primary-bg)]"
          >
            📋 Lịch sử đặt lịch
          </Link>
          <button
            role="menuitem"
            type="button"
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-[color:var(--color-danger)] hover:bg-red-50"
          >
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}
