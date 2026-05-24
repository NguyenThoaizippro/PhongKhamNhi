import { NextRequest } from "next/server";
import { bookingSchema } from "@/lib/validation/booking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "JSON không hợp lệ" }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse({
    ...(body as Record<string, unknown>),
    consent: "on",
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && !fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }
    return Response.json(
      { error: "Vui lòng kiểm tra lại thông tin", fieldErrors },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const hasFirebaseCredentials =
    !!process.env.FIREBASE_ADMIN_PROJECT_ID &&
    !!process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
    !!process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  if (!hasFirebaseCredentials) {
    console.warn("[booking/api] Firebase chưa cấu hình. Booking không lưu:", data);
    return Response.json({ bookingId: `dev-${Date.now()}`, source: "chatbot" });
  }

  try {
    const { adminDb } = await import("@/lib/firebase/admin");
    const { FieldValue } = await import("firebase-admin/firestore");
    const docRef = await adminDb.collection("bookings").add({
      childName: data.childName,
      childBirthDate: data.childBirthDate,
      parentName: data.parentName,
      parentPhone: data.parentPhone,
      parentEmail: data.parentEmail || null,
      specialty: data.specialty,
      preferredDate: data.preferredDate,
      preferredTimeSlot: data.preferredTimeSlot,
      symptoms: data.symptoms ?? "",
      status: "pending",
      source: "chatbot",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      createdBy: null,
    });

    // Best-effort email notify — không block response
    const { notifyBookingCreated } = await import("@/lib/email/booking-emails");
    void notifyBookingCreated({
      bookingId: docRef.id,
      childName: data.childName,
      childBirthDate: data.childBirthDate,
      parentName: data.parentName,
      parentPhone: data.parentPhone,
      parentEmail: data.parentEmail || undefined,
      specialty: data.specialty,
      preferredDate: data.preferredDate,
      preferredTimeSlot: data.preferredTimeSlot,
      symptoms: data.symptoms,
    });

    return Response.json({ bookingId: docRef.id, source: "chatbot" });
  } catch (err) {
    console.error("[booking/api] Firestore error:", err);
    return Response.json(
      {
        error:
          "Không thể lưu đăng ký. Vui lòng thử lại hoặc gọi 0985.350.570 để đặt lịch trực tiếp.",
      },
      { status: 500 }
    );
  }
}
