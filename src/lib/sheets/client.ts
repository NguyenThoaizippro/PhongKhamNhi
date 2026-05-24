import "server-only";
import { google, type sheets_v4 } from "googleapis";
import { JWT } from "google-auth-library";

let _client: sheets_v4.Sheets | null = null;

/**
 * Lấy Sheets client với service account credentials.
 * Trả về null nếu env chưa setup (graceful degrade).
 */
export function getSheetsClient(): sheets_v4.Sheets | null {
  if (_client) return _client;

  const email = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!email || !privateKey) return null;

  try {
    const auth = new JWT({
      email,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    _client = google.sheets({ version: "v4", auth });
    return _client;
  } catch (err) {
    console.error("Sheets client init error:", err);
    return null;
  }
}
