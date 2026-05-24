import { describe, it, expect } from "vitest";
import { bookingSchema } from "./booking";

const validBooking = {
  childName: "Bé Nguyễn An",
  childBirthDate: "2022-06-15",
  parentName: "Nguyễn Văn Bố",
  parentPhone: "0985350570",
  specialty: "ho-hap",
  preferredDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10),
  preferredTimeSlot: "17h30-18h30",
  symptoms: "Bé ho 3 ngày",
  consent: "on",
};

describe("bookingSchema", () => {
  it("accepts valid booking payload", () => {
    const result = bookingSchema.safeParse(validBooking);
    expect(result.success).toBe(true);
  });

  it("rejects child name shorter than 2 chars", () => {
    const result = bookingSchema.safeParse({ ...validBooking, childName: "A" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path[0] === "childName")).toBe(true);
    }
  });

  it("rejects non-VN phone numbers", () => {
    const result = bookingSchema.safeParse({
      ...validBooking,
      parentPhone: "1234567890",
    });
    expect(result.success).toBe(false);
  });

  it.each([
    ["0985350570", true], // 09 mobile
    ["0312345678", true], // 03 mobile
    ["0521234567", true], // 05 mobile
    ["0712345678", true], // 07 mobile
    ["0812345678", true], // 08 mobile
    ["0212345678", true], // 02 landline
    ["0412345678", false], // 04 not valid prefix
    ["0985", false], // too short
    ["098535057012", false], // too long
  ])("phone %s validity = %s", (phone, valid) => {
    const result = bookingSchema.safeParse({
      ...validBooking,
      parentPhone: phone,
    });
    expect(result.success).toBe(valid);
  });

  it("rejects booking for child older than 18 years", () => {
    const tooOld = new Date();
    tooOld.setFullYear(tooOld.getFullYear() - 19);
    const result = bookingSchema.safeParse({
      ...validBooking,
      childBirthDate: tooOld.toISOString().slice(0, 10),
    });
    expect(result.success).toBe(false);
  });

  it("rejects future birth date", () => {
    const future = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);
    const result = bookingSchema.safeParse({
      ...validBooking,
      childBirthDate: future,
    });
    expect(result.success).toBe(false);
  });

  it("rejects appointment date in the past", () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);
    const result = bookingSchema.safeParse({
      ...validBooking,
      preferredDate: yesterday,
    });
    expect(result.success).toBe(false);
  });

  it("rejects appointment date beyond 60 days", () => {
    const tooFar = new Date(Date.now() + 70 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);
    const result = bookingSchema.safeParse({
      ...validBooking,
      preferredDate: tooFar,
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid specialty", () => {
    const result = bookingSchema.safeParse({
      ...validBooking,
      specialty: "phẫu-thuật",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid time slot", () => {
    const result = bookingSchema.safeParse({
      ...validBooking,
      preferredTimeSlot: "08h00-09h00",
    });
    expect(result.success).toBe(false);
  });

  it("requires consent checkbox", () => {
    const { consent, ...withoutConsent } = validBooking;
    void consent;
    const result = bookingSchema.safeParse(withoutConsent);
    expect(result.success).toBe(false);
  });

  it("accepts consent as 'true' string from form", () => {
    const result = bookingSchema.safeParse({ ...validBooking, consent: "true" });
    expect(result.success).toBe(true);
  });

  it("makes symptoms optional", () => {
    const { symptoms, ...withoutSymptoms } = validBooking;
    void symptoms;
    const result = bookingSchema.safeParse(withoutSymptoms);
    expect(result.success).toBe(true);
  });

  it("rejects symptoms longer than 500 chars", () => {
    const result = bookingSchema.safeParse({
      ...validBooking,
      symptoms: "x".repeat(501),
    });
    expect(result.success).toBe(false);
  });
});
