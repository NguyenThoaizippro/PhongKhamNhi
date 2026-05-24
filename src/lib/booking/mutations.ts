import "server-only";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import type { Booking } from "@/lib/firebase/types";

const VALID_STATUSES: Booking["status"][] = ["pending", "confirmed", "completed", "cancelled"];

export function isValidStatus(s: string): s is Booking["status"] {
  return (VALID_STATUSES as string[]).includes(s);
}

export async function updateBookingStatus(
  id: string,
  status: Booking["status"],
  doctorNote?: string
): Promise<void> {
  const updates: Record<string, unknown> = {
    status,
    updatedAt: FieldValue.serverTimestamp(),
  };
  if (typeof doctorNote === "string") {
    updates.doctorNote = doctorNote.slice(0, 1000);
  }
  await adminDb.collection("bookings").doc(id).update(updates);
}
