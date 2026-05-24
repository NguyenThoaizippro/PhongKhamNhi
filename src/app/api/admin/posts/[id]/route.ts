import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { requireAdmin } from "@/lib/auth/require-admin";
import { adminDb } from "@/lib/firebase/admin";
import { postSchema } from "@/lib/validation/post";

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

  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message, fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const data = parsed.data;

  const ref = adminDb.collection("posts").doc(id);
  const existing = await ref.get();
  if (!existing.exists) {
    return NextResponse.json({ error: "Bài không tồn tại" }, { status: 404 });
  }

  // Check trùng slug (bỏ qua chính bài này)
  const dup = await adminDb
    .collection("posts")
    .where("slug", "==", data.slug)
    .limit(2)
    .get();
  if (dup.docs.some((d) => d.id !== id)) {
    return NextResponse.json(
      { error: "Slug đã được dùng cho bài khác", fieldErrors: { slug: ["Slug đã tồn tại"] } },
      { status: 409 }
    );
  }

  const wasPublished = existing.data()?.status === "published";
  const nowPublishing = data.status === "published" && !wasPublished;

  await ref.update({
    ...data,
    coverImage: data.coverImage || null,
    specialty: data.specialty || null,
    updatedAt: FieldValue.serverTimestamp(),
    ...(nowPublishing ? { publishedAt: FieldValue.serverTimestamp() } : {}),
  });

  return NextResponse.json({ id });
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const adminUid = await requireAdmin(req);
  if (!adminUid) return NextResponse.json({ error: "Không có quyền" }, { status: 401 });

  const { id } = await params;
  await adminDb.collection("posts").doc(id).delete();
  return NextResponse.json({ ok: true });
}
