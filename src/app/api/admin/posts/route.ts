import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { requireAdmin } from "@/lib/auth/require-admin";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { postSchema } from "@/lib/validation/post";

export async function POST(req: NextRequest) {
  const adminUid = await requireAdmin(req);
  if (!adminUid) {
    return NextResponse.json({ error: "Không có quyền" }, { status: 401 });
  }

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

  const dup = await adminDb
    .collection("posts")
    .where("slug", "==", data.slug)
    .limit(1)
    .get();
  if (!dup.empty) {
    return NextResponse.json(
      { error: "Slug đã được dùng cho bài khác. Đổi slug khác.", fieldErrors: { slug: ["Slug đã tồn tại"] } },
      { status: 409 }
    );
  }

  const userRecord = await adminAuth.getUser(adminUid).catch(() => null);
  const authorName =
    userRecord?.displayName ||
    userRecord?.email?.split("@")[0] ||
    "BS. Phòng Khám Dế Mèn";

  const now = FieldValue.serverTimestamp();
  const doc = {
    ...data,
    coverImage: data.coverImage || null,
    specialty: data.specialty || null,
    authorUid: adminUid,
    authorName,
    viewCount: 0,
    createdAt: now,
    updatedAt: now,
    publishedAt: data.status === "published" ? now : null,
  };

  const ref = await adminDb.collection("posts").add(doc);
  return NextResponse.json({ id: ref.id }, { status: 201 });
}
