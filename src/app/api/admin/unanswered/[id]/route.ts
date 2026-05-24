import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/require-admin";
import { adminDb } from "@/lib/firebase/admin";

const patchSchema = z.object({
  answer: z.string().trim().min(10, "Câu trả lời tối thiểu 10 ký tự").max(3000).optional(),
  mergedToKb: z.boolean().optional(),
});

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const adminUid = await requireAdmin(req);
  if (!adminUid) return NextResponse.json({ error: "Không có quyền" }, { status: 401 });

  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON không hợp lệ" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};
  if (parsed.data.answer !== undefined) {
    updates.answer = parsed.data.answer;
    updates.reviewedBy = adminUid;
    updates.reviewedAt = FieldValue.serverTimestamp();
  }
  if (parsed.data.mergedToKb !== undefined) {
    updates.mergedToKb = parsed.data.mergedToKb;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Không có gì để cập nhật" }, { status: 400 });
  }

  await adminDb.collection("unanswered").doc(id).update(updates);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const adminUid = await requireAdmin(req);
  if (!adminUid) return NextResponse.json({ error: "Không có quyền" }, { status: 401 });

  const { id } = await params;
  await adminDb.collection("unanswered").doc(id).delete();
  return NextResponse.json({ ok: true });
}
