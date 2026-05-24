import { NextRequest } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/require-admin";
import { updateBookingStatus, isValidStatus } from "@/lib/booking/mutations";

export const runtime = "nodejs";

const patchSchema = z.object({
  status: z.string().refine(isValidStatus, "Status không hợp lệ"),
  doctorNote: z.string().max(1000, "Ghi chú tối đa 1000 ký tự").optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminUid = await requireAdmin(req);
  if (!adminUid) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!id || id.length > 200) {
    return Response.json({ error: "ID không hợp lệ" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "JSON không hợp lệ" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  try {
    await updateBookingStatus(id, parsed.data.status, parsed.data.doctorNote);
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[api/admin/bookings/PATCH] error:", err);
    return Response.json({ error: "Không thể update booking" }, { status: 500 });
  }
}
