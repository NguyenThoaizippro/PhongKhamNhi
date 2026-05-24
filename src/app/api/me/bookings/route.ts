import { NextRequest } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import { getBookingsForUser } from "@/lib/booking/queries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/me/bookings — trả danh sách booking của user hiện tại.
 * Auth: Authorization: Bearer <Firebase ID token>
 */
export async function GET(req: NextRequest) {
  const header = req.headers.get("authorization") ?? "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let uid: string;
  try {
    const decoded = await adminAuth.verifyIdToken(match[1]);
    uid = decoded.uid;
  } catch {
    return Response.json({ error: "Token không hợp lệ" }, { status: 401 });
  }

  const bookings = await getBookingsForUser(uid);
  return Response.json({ bookings });
}
