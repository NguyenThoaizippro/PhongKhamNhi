"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";

export function LogoutButton({ className = "" }: { className?: string }) {
  const { logout } = useAuth();
  const router = useRouter();

  async function handleClick() {
    await logout();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className || "text-sm font-medium text-[color:var(--color-danger)] hover:underline"}
    >
      Đăng xuất
    </button>
  );
}
