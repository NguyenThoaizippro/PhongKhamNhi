import "server-only";
import { CLINIC, DOCTOR, SPECIALTIES } from "@/lib/constants";

/**
 * Resend REST API client — gọi trực tiếp không cần SDK npm.
 * Best-effort: nếu thiếu key hoặc Resend lỗi, log + return false (không throw).
 *
 * Docs: https://resend.com/docs/api-reference/emails/send-email
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  /** Plain-text fallback cho client không hỗ trợ HTML */
  text?: string;
  /** Reply-To header — nếu không set sẽ dùng EMAIL_FROM */
  replyTo?: string;
}

export async function sendEmail(opts: SendEmailOptions): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || `Dế Mèn <onboarding@resend.dev>`;

  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY chưa cấu hình — skip gửi:", opts.subject);
    return false;
  }

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: Array.isArray(opts.to) ? opts.to : [opts.to],
        subject: opts.subject,
        html: opts.html,
        text: opts.text,
        reply_to: opts.replyTo,
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error(
        `[email] Resend ${res.status}: ${errText.slice(0, 300)}`,
        { subject: opts.subject, to: opts.to }
      );
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] Network error:", err);
    return false;
  }
}

// ===== Format helpers =====

export function specialtyName(slug: string): string {
  const s = SPECIALTIES.find((sp) => sp.slug === slug);
  return s ? s.name : "Chưa rõ";
}

export function formatVnDate(iso: string): string {
  try {
    return new Date(iso + "T00:00:00").toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export const EMAIL_BRAND = {
  clinicName: CLINIC.name,
  doctorName: DOCTOR.name,
  phone: CLINIC.phoneDisplay,
  phoneRaw: CLINIC.phone,
  address: CLINIC.address,
  hours: CLINIC.hours,
  hoursLong: CLINIC.hoursLong,
  primaryColor: "#7CB342",
  primaryDark: "#558B2F",
  accentColor: "#E53935",
};
