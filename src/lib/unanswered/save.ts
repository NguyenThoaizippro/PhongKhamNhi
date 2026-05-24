import "server-only";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import type { ChatMessage } from "@/lib/llm/types";

/**
 * Heuristic detect: bot trả lời dạng "không biết / chưa có thông tin"
 * → coi là unanswered, cần bác sĩ trả lời.
 */
const UNANSWERED_PATTERNS = [
  /chưa có thông tin/i,
  /không có thông tin/i,
  /chưa biết.*về việc/i,
  /vui lòng gọi.*0985.?350.?570.*bác sĩ/i,
];

export function isUnanswered(botReply: string): boolean {
  if (!botReply || botReply.length < 20) return false;
  return UNANSWERED_PATTERNS.some((p) => p.test(botReply));
}

interface SaveOptions {
  question: string;
  context?: ChatMessage[];
  parentPhone?: string;
}

/**
 * Ghi câu hỏi chưa trả lời vào Firestore.
 * Best-effort: nếu Firebase Admin chưa setup → silent fail (không crash chat flow).
 */
export async function saveUnanswered(opts: SaveOptions): Promise<void> {
  try {
    const contextText = opts.context
      ?.slice(-6)
      .map((m) => `${m.role}: ${m.content}`)
      .join("\n");

    await adminDb.collection("unanswered").add({
      question: opts.question.slice(0, 1000),
      context: contextText?.slice(0, 3000) ?? null,
      parentPhone: opts.parentPhone ?? null,
      createdAt: FieldValue.serverTimestamp(),
      reviewedBy: null,
      answer: null,
      mergedToKb: false,
    });
  } catch (err) {
    console.error("saveUnanswered failed (ignored):", err);
  }
}
