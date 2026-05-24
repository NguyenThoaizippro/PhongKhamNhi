"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleAuthProvider, signInWithPopup, type AuthError } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

// Map Firebase Auth error codes → tiếng Việt thân thiện + gợi ý fix
function friendlyAuthError(code: string): string | null {
  switch (code) {
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
    case "auth/user-cancelled":
      return null; // user tự đóng, không hiển thị lỗi
    case "auth/popup-blocked":
      return "Trình duyệt chặn popup. Ba mẹ vui lòng cho phép popup từ trang này rồi thử lại.";
    case "auth/operation-not-allowed":
      return "Đăng nhập Google chưa được bật. Cần bật trong Firebase Console → Authentication → Sign-in method → Google.";
    case "auth/configuration-not-found":
      return "Firebase chưa cấu hình Google provider. Cần bật trong Firebase Console → Authentication → Sign-in method.";
    case "auth/unauthorized-domain":
      return "Domain này chưa được phép. Cần add vào Firebase → Authentication → Settings → Authorized domains.";
    case "auth/network-request-failed":
      return "Mất kết nối mạng. Ba mẹ kiểm tra Wi-Fi/4G rồi thử lại nhé.";
    case "auth/account-exists-with-different-credential":
      return "Email này đã đăng ký bằng phương thức khác. Vui lòng dùng đúng cách đã đăng ký lần đầu.";
    default:
      return `Không đăng nhập được (${code}). Ba mẹ thử lại sau hoặc liên hệ phòng khám.`;
  }
}

export function GoogleSignInButton({ redirectTo = "/" }: { redirectTo?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignIn() {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(auth, provider);
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      const code =
        typeof err === "object" && err && "code" in err
          ? (err as AuthError).code
          : "unknown";
      console.error("[GoogleSignIn] error code:", code, err);
      setError(friendlyAuthError(code));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleSignIn}
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2.5 rounded-full border-2 border-[color:var(--color-border)] hover:border-[color:var(--color-primary)] hover:bg-[color:var(--color-primary-bg)] bg-white px-6 py-3 text-base font-semibold text-[color:var(--color-text)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <GoogleIcon />
        {loading ? "Đang xử lý..." : "Tiếp tục với Google"}
      </button>
      {error && (
        <p className="mt-2 text-xs text-[color:var(--color-danger)] text-center" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
