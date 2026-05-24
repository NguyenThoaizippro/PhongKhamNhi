import "server-only";
import { getSheetsClient } from "./client";

export interface KBEntry {
  question: string;
  answer: string;
  specialty?: string;
  tags?: string;
}

const CACHE_TTL_MS = 5 * 60 * 1000;
let cache: { entries: KBEntry[]; expiresAt: number } | null = null;

/**
 * Lấy toàn bộ Knowledge Base từ Google Sheet.
 * Sheet layout (Sheet1, từ row 2): A=Question, B=Answer, C=Specialty, D=Tags
 * Cache 5 phút trong memory để tránh rate limit.
 */
export async function getKBEntries(): Promise<KBEntry[]> {
  if (cache && cache.expiresAt > Date.now()) return cache.entries;

  const client = getSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEETS_KB_ID;
  if (!client || !spreadsheetId) return [];

  try {
    const res = await client.spreadsheets.values.get({
      spreadsheetId,
      range: "A2:D1000",
      valueRenderOption: "UNFORMATTED_VALUE",
    });
    const rows = res.data.values ?? [];

    const entries: KBEntry[] = rows
      .filter((r) => Array.isArray(r) && r[0] && r[1])
      .map((r) => ({
        question: String(r[0]).trim(),
        answer: String(r[1]).trim(),
        specialty: r[2] ? String(r[2]).trim() : undefined,
        tags: r[3] ? String(r[3]).trim() : undefined,
      }));

    cache = { entries, expiresAt: Date.now() + CACHE_TTL_MS };
    return entries;
  } catch (err) {
    console.error("Sheets KB fetch error:", err);
    return [];
  }
}

/**
 * Format KB entries thành text block đưa vào system prompt.
 * NotebookLM-style: AI chỉ trả lời dựa trên context này.
 */
export function formatKBForPrompt(entries: KBEntry[]): string {
  if (entries.length === 0) return "";
  return entries
    .map((e, i) => {
      const tags = e.tags ? ` [${e.tags}]` : "";
      const sp = e.specialty ? ` (Chuyên khoa: ${e.specialty})` : "";
      return `### KB #${i + 1}${sp}${tags}\nQ: ${e.question}\nA: ${e.answer}`;
    })
    .join("\n\n");
}

/** Cho phép admin invalidate cache (dùng khi update Sheet xong muốn áp dụng ngay) */
export function clearKBCache() {
  cache = null;
}
