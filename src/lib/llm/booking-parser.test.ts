import { describe, it, expect } from "vitest";
import { extractBookingDraft } from "./booking-parser";

const completeDraft = {
  childName: "Bé Mai",
  childBirthDate: "2022-06-15",
  parentName: "Mẹ Lan",
  parentPhone: "0985350570",
  specialty: "ho-hap",
  preferredDate: "2026-06-01",
  preferredTimeSlot: "17h30-18h30",
  symptoms: "Bé ho 3 ngày",
};

describe("extractBookingDraft", () => {
  it("returns null draft + original content khi không có marker", () => {
    const content = "Bé sốt nhẹ thì ba mẹ theo dõi tại nhà nhé.";
    const { cleaned, draft } = extractBookingDraft(content);
    expect(draft).toBeNull();
    expect(cleaned).toBe(content);
  });

  it("parses complete draft và strip marker khỏi cleaned content", () => {
    const content = `Mình đã ghi nhận thông tin của bé Mai. Cảm ơn ba mẹ!\n\n<<BOOKING_DRAFT>>${JSON.stringify(completeDraft)}<</BOOKING_DRAFT>>`;
    const { cleaned, draft } = extractBookingDraft(content);
    expect(draft).not.toBeNull();
    expect(draft?.childName).toBe("Bé Mai");
    expect(draft?.parentPhone).toBe("0985350570");
    expect(draft?.specialty).toBe("ho-hap");
    expect(cleaned).toContain("Cảm ơn ba mẹ");
    expect(cleaned).not.toContain("BOOKING_DRAFT");
    expect(cleaned).not.toContain("childName");
  });

  it("ẩn marker khi đang stream (chỉ có start, chưa có end)", () => {
    const content = "Cảm ơn ba mẹ!\n\n<<BOOKING_DRAFT>>{\"childName\":\"Bé";
    const { cleaned, draft } = extractBookingDraft(content);
    expect(draft).toBeNull();
    expect(cleaned).toBe("Cảm ơn ba mẹ!");
    expect(cleaned).not.toContain("BOOKING_DRAFT");
  });

  it("returns null draft khi JSON malformed", () => {
    const content = `OK<<BOOKING_DRAFT>>{not valid json<</BOOKING_DRAFT>>`;
    const { cleaned, draft } = extractBookingDraft(content);
    expect(draft).toBeNull();
    expect(cleaned).toBe("OK");
  });

  it("returns null draft khi thiếu field bắt buộc", () => {
    const incomplete = { childName: "Bé X" }; // missing rest
    const content = `<<BOOKING_DRAFT>>${JSON.stringify(incomplete)}<</BOOKING_DRAFT>>`;
    const { draft } = extractBookingDraft(content);
    expect(draft).toBeNull();
  });

  it("default symptoms thành empty string nếu thiếu", () => {
    const { symptoms, ...noSymptoms } = completeDraft;
    void symptoms;
    const content = `<<BOOKING_DRAFT>>${JSON.stringify(noSymptoms)}<</BOOKING_DRAFT>>`;
    const { draft } = extractBookingDraft(content);
    expect(draft).not.toBeNull();
    expect(draft?.symptoms).toBe("");
  });

  it("xử lý đúng khi có nhiều text trước và sau marker", () => {
    const content = `Trước marker.\n<<BOOKING_DRAFT>>${JSON.stringify(completeDraft)}<</BOOKING_DRAFT>>\nSau marker.`;
    const { cleaned, draft } = extractBookingDraft(content);
    expect(draft).not.toBeNull();
    expect(cleaned).toContain("Trước marker.");
    expect(cleaned).toContain("Sau marker.");
  });
});
