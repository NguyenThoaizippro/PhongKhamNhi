import "server-only";
import { adminDb } from "@/lib/firebase/admin";

export interface UnansweredItem {
  id: string;
  question: string;
  context?: string;
  parentPhone?: string;
  createdAt: string;
  answer?: string;
  reviewedBy?: string;
  mergedToKb: boolean;
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

export async function getUnansweredForAdmin(): Promise<UnansweredItem[]> {
  try {
    const snap = await adminDb
      .collection("unanswered")
      .orderBy("createdAt", "desc")
      .limit(100)
      .get();

    return snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        question: String(data.question ?? ""),
        context: data.context ? String(data.context) : undefined,
        parentPhone: data.parentPhone ? String(data.parentPhone) : undefined,
        createdAt: toIso(data.createdAt),
        answer: data.answer ? String(data.answer) : undefined,
        reviewedBy: data.reviewedBy ? String(data.reviewedBy) : undefined,
        mergedToKb: !!data.mergedToKb,
      };
    });
  } catch (err) {
    console.error("getUnansweredForAdmin error:", err);
    return [];
  }
}
