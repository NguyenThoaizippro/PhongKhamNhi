"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Email admin được expose ra client để hiển thị UI (badge, menu).
 * Quyền thực sự được enforce server-side qua Firestore rules + admin-check.ts.
 */
const ADMIN_EMAIL_PUBLIC = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase().trim() ?? "";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Graceful degrade: nếu Firebase config thiếu, auth sẽ throw khi gọi
    // onAuthStateChanged. Try/catch để không crash app.
    try {
      const unsub = onAuthStateChanged(
        auth,
        (u) => {
          setUser(u);
          setLoading(false);
        },
        () => setLoading(false)
      );
      return unsub;
    } catch {
      setLoading(false);
    }
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  const isAdmin =
    !!user?.email && ADMIN_EMAIL_PUBLIC.length > 0 && user.email.toLowerCase() === ADMIN_EMAIL_PUBLIC;

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth phải dùng bên trong <AuthProvider>");
  return ctx;
}
