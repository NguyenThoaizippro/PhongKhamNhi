import {
  BOOKING_MARKER_START,
  BOOKING_MARKER_END,
  type BookingDraft,
} from "@/lib/llm/types";

/**
 * Tách khối <<BOOKING_DRAFT>>{...json...}<</BOOKING_DRAFT>> ra khỏi nội dung message của bot.
 * Trả về { cleaned, draft } — cleaned là content đã strip marker để hiển thị,
 * draft là object parsed (hoặc null nếu chưa hợp lệ).
 */
export function extractBookingDraft(content: string): {
  cleaned: string;
  draft: BookingDraft | null;
} {
  const startIdx = content.indexOf(BOOKING_MARKER_START);
  if (startIdx === -1) return { cleaned: content, draft: null };

  const afterStart = startIdx + BOOKING_MARKER_START.length;
  const endIdx = content.indexOf(BOOKING_MARKER_END, afterStart);

  // Marker chưa đóng (đang stream) → ẩn phần từ marker trở đi để user không thấy JSON raw.
  if (endIdx === -1) {
    return { cleaned: content.slice(0, startIdx).trimEnd(), draft: null };
  }

  const jsonRaw = content.slice(afterStart, endIdx).trim();
  const cleaned = (content.slice(0, startIdx) + content.slice(endIdx + BOOKING_MARKER_END.length))
    .trim();

  let draft: BookingDraft | null = null;
  try {
    const parsed = JSON.parse(jsonRaw) as Partial<BookingDraft>;
    if (
      parsed &&
      typeof parsed.childName === "string" &&
      typeof parsed.childBirthDate === "string" &&
      typeof parsed.parentName === "string" &&
      typeof parsed.parentPhone === "string" &&
      typeof parsed.specialty === "string" &&
      typeof parsed.preferredDate === "string" &&
      typeof parsed.preferredTimeSlot === "string"
    ) {
      draft = {
        childName: parsed.childName,
        childBirthDate: parsed.childBirthDate,
        parentName: parsed.parentName,
        parentPhone: parsed.parentPhone,
        parentEmail:
          typeof parsed.parentEmail === "string" ? parsed.parentEmail : "",
        specialty: parsed.specialty,
        preferredDate: parsed.preferredDate,
        preferredTimeSlot: parsed.preferredTimeSlot,
        symptoms: typeof parsed.symptoms === "string" ? parsed.symptoms : "",
      };
    }
  } catch {
    // JSON xấu — bỏ qua, chỉ trả về cleaned content
  }

  return { cleaned, draft };
}
