import "server-only";
import { NextRequest } from "next/server";
import { verifyAdminToken } from "@/lib/auth/admin-check";

/**
 * Extract Bearer token từ Authorization header và verify là admin.
 * Trả về adminUid hoặc null.
 */
export async function requireAdmin(req: NextRequest): Promise<string | null> {
  const header = req.headers.get("authorization") ?? "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) return null;
  return verifyAdminToken(match[1]);
}
