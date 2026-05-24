import "server-only";
import { adminDb } from "@/lib/firebase/admin";
import type { Booking } from "@/lib/firebase/types";

export interface BookingView {
  id: string;
  childName: string;
  childBirthDate: string;
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  specialty: string;
  preferredDate: string;
  preferredTimeSlot: string;
  symptoms?: string;
  status: Booking["status"];
  source?: Booking["source"];
  doctorNote?: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  createdBy?: string;
}

function toIso(value: unknown): string {
  if (!value) return new Date().toISOString();
  if (typeof value === "object" && value !== null && "toDate" in value) {
    try {
      return (value as { toDate: () => Date }).toDate().toISOString();
    } catch {
      return new Date().toISOString();
    }
  }
  return new Date().toISOString();
}

function mapDoc(d: FirebaseFirestore.QueryDocumentSnapshot): BookingView {
  const data = d.data();
  return {
    id: d.id,
    childName: String(data.childName ?? ""),
    childBirthDate: String(data.childBirthDate ?? ""),
    parentName: String(data.parentName ?? ""),
    parentPhone: String(data.parentPhone ?? ""),
    parentEmail: data.parentEmail ? String(data.parentEmail) : undefined,
    specialty: String(data.specialty ?? ""),
    preferredDate: String(data.preferredDate ?? ""),
    preferredTimeSlot: String(data.preferredTimeSlot ?? ""),
    symptoms: data.symptoms ? String(data.symptoms) : undefined,
    status: (data.status ?? "pending") as Booking["status"],
    source: data.source as Booking["source"],
    doctorNote: data.doctorNote ? String(data.doctorNote) : undefined,
    createdAt: toIso(data.createdAt),
    updatedAt: toIso(data.updatedAt),
    createdBy: data.createdBy ? String(data.createdBy) : undefined,
  };
}

/** Lấy danh sách booking cho admin — có filter status optional */
export async function getBookingsForAdmin(opts?: {
  status?: Booking["status"];
  limit?: number;
}): Promise<BookingView[]> {
  try {
    let query = adminDb
      .collection("bookings")
      .orderBy("createdAt", "desc")
      .limit(opts?.limit ?? 200);
    if (opts?.status) {
      query = adminDb
        .collection("bookings")
        .where("status", "==", opts.status)
        .orderBy("createdAt", "desc")
        .limit(opts?.limit ?? 200);
    }
    const snap = await query.get();
    return snap.docs.map(mapDoc);
  } catch (err) {
    console.error("[bookings/queries] getBookingsForAdmin failed:", err);
    return [];
  }
}

/** Đếm theo status — dashboard stats */
export async function getBookingStats(): Promise<Record<Booking["status"], number>> {
  const counts: Record<Booking["status"], number> = {
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
  };
  try {
    const snap = await adminDb.collection("bookings").select("status").get();
    for (const d of snap.docs) {
      const status = (d.data().status ?? "pending") as Booking["status"];
      if (status in counts) counts[status]++;
    }
  } catch (err) {
    console.error("[bookings/queries] getBookingStats failed:", err);
  }
  return counts;
}

/** Lấy booking của 1 user (PH login) — sort desc theo createdAt */
export async function getBookingsForUser(uid: string): Promise<BookingView[]> {
  try {
    const snap = await adminDb
      .collection("bookings")
      .where("createdBy", "==", uid)
      .orderBy("createdAt", "desc")
      .limit(50)
      .get();
    return snap.docs.map(mapDoc);
  } catch (err) {
    console.error("[bookings/queries] getBookingsForUser failed:", err);
    return [];
  }
}
