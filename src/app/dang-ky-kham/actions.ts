"use server";

import { bookingSchema } from "@/lib/validation/booking";
import { FieldValue } from "firebase-admin/firestore";

export type BookingActionState =
  | { status: "idle" }
  | { status: "error"; message: string; fieldErrors?: Record<string, string> }
  | { status: "success"; bookingId: string };

/**
 * Server Action xử lý đăng ký khám.
 * 1. Validate input bằng zod
 * 2. Verify idToken (nếu có) để attach UID + email vào booking
 * 3. Lưu Firestore (nếu có credentials) hoặc log + skip (dev mode)
 * 4. Gửi email confirm cho PH + notify BS Đông (best-effort)
 */
export async function submitBooking(
  _prevState: BookingActionState,
  formData: FormData
): Promise<BookingActionState> {
  // 1. Parse + validate (loại idToken vì không thuộc schema)
  const raw = Object.fromEntries(formData.entries());
  const idToken = typeof raw.idToken === "string" ? raw.idToken : undefined;
  delete raw.idToken;
  const parsed = bookingSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && !fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }
    return {
      status: "error",
      message: "Vui lòng kiểm tra lại thông tin",
      fieldErrors,
    };
  }

  const data = parsed.data;

  // 2. Save to Firestore — graceful degrade nếu chưa cấu hình
  const hasFirebaseCredentials =
    !!process.env.FIREBASE_ADMIN_PROJECT_ID &&
    !!process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
    !!process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  if (!hasFirebaseCredentials) {
    console.warn(
      "[booking] Firebase credentials chưa cấu hình. Booking không được lưu. Dữ liệu:",
      data
    );
    // Trả về success giả để user test được UI flow
    return {
      status: "success",
      bookingId: `dev-${Date.now()}`,
    };
  }

  // 3. Verify idToken (nếu có) — extract UID + email từ Firebase Auth
  let uid: string | null = null;
  let verifiedEmail: string | null = null;
  if (idToken) {
    try {
      const { adminAuth } = await import("@/lib/firebase/admin");
      const decoded = await adminAuth.verifyIdToken(idToken);
      uid = decoded.uid;
      verifiedEmail = decoded.email ?? null;
    } catch (err) {
      console.warn("[booking] idToken không hợp lệ — fallback guest mode:", err);
    }
  }

  try {
    const { adminDb } = await import("@/lib/firebase/admin");
    const docRef = await adminDb.collection("bookings").add({
      childName: data.childName,
      childBirthDate: data.childBirthDate,
      parentName: data.parentName,
      parentPhone: data.parentPhone,
      parentEmail: data.parentEmail || verifiedEmail || null,
      specialty: data.specialty,
      preferredDate: data.preferredDate,
      preferredTimeSlot: data.preferredTimeSlot,
      symptoms: data.symptoms ?? "",
      status: "pending",
      source: "web-form",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      createdBy: uid,
    });

    // Best-effort: gửi email confirm cho PH + notify BS Đông (không block return)
    const { notifyBookingCreated } = await import("@/lib/email/booking-emails");
    void notifyBookingCreated({
      bookingId: docRef.id,
      childName: data.childName,
      childBirthDate: data.childBirthDate,
      parentName: data.parentName,
      parentPhone: data.parentPhone,
      parentEmail: data.parentEmail || verifiedEmail || undefined,
      specialty: data.specialty,
      preferredDate: data.preferredDate,
      preferredTimeSlot: data.preferredTimeSlot,
      symptoms: data.symptoms,
    });

    return { status: "success", bookingId: docRef.id };
  } catch (err) {
    console.error("[booking] Firestore error:", err);
    return {
      status: "error",
      message:
        "Không thể lưu đăng ký. Vui lòng thử lại hoặc gọi 0985.350.570 để đặt lịch trực tiếp.",
    };
  }
}
