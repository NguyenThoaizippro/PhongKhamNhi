import "server-only";
import { adminAuth } from "@/lib/firebase/admin";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.toLowerCase().trim() ?? "";

/**
 * Server-side: verify Firebase ID token và check email match ADMIN_EMAIL.
 * Dùng trong Server Action / API route trước khi cho phép thao tác nhạy cảm.
 *
 * @param idToken — token lấy từ `await user.getIdToken()` ở client
 * @returns uid nếu là admin, null nếu không
 */
export async function verifyAdminToken(idToken: string): Promise<string | null> {
  if (!ADMIN_EMAIL) return null;
  try {
    const decoded = await adminAuth.verifyIdToken(idToken);
    if (!decoded.email) return null;
    return decoded.email.toLowerCase() === ADMIN_EMAIL ? decoded.uid : null;
  } catch {
    return null;
  }
}
