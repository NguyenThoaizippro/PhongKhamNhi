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
 * 2. Lưu Firestore (nếu có credentials) hoặc log + skip (dev mode)
 * 3. (Phase sau) Gửi email confirmation
 */
export async function submitBooking(
  _prevState: BookingActionState,
  formData: FormData
): Promise<BookingActionState> {
  // 1. Parse + validate
  const raw = Object.fromEntries(formData.entries());
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

  try {
    const { adminDb } = await import("@/lib/firebase/admin");
    const docRef = await adminDb.collection("bookings").add({
      childName: data.childName,
      childBirthDate: data.childBirthDate,
      parentName: data.parentName,
      parentPhone: data.parentPhone,
      specialty: data.specialty,
      preferredDate: data.preferredDate,
      preferredTimeSlot: data.preferredTimeSlot,
      symptoms: data.symptoms ?? "",
      status: "pending",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      createdBy: null, // sẽ wire user uid ở Phase 6
    });

    // TODO Phase 10/12: gửi email confirmation cho parent + notification cho clinic
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
