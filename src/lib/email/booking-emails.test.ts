import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock sendEmail từ client trước khi import booking-emails
const sendEmailMock = vi.fn();
vi.mock("./client", async () => {
  const actual = await vi.importActual<typeof import("./client")>("./client");
  return {
    ...actual,
    sendEmail: (...args: unknown[]) => sendEmailMock(...args),
  };
});

beforeEach(() => {
  sendEmailMock.mockReset();
  sendEmailMock.mockResolvedValue(true);
  process.env.DOCTOR_EMAIL = "doc@example.com";
});
afterEach(() => {
  vi.unstubAllEnvs();
});

const data = {
  bookingId: "BK123",
  childName: "Bé Mai",
  childBirthDate: "2022-06-15",
  parentName: "Mẹ Lan",
  parentPhone: "0985350570",
  parentEmail: "ph@example.com",
  specialty: "ho-hap",
  preferredDate: "2026-06-15",
  preferredTimeSlot: "17h30-18h30",
  symptoms: "Bé ho 2 ngày",
};

describe("sendParentConfirmation", () => {
  it("gửi email cho parentEmail với subject chứa tên bé", async () => {
    const { sendParentConfirmation } = await import("./booking-emails");
    await sendParentConfirmation(data);
    expect(sendEmailMock).toHaveBeenCalledTimes(1);
    const call = sendEmailMock.mock.calls[0][0];
    expect(call.to).toBe("ph@example.com");
    expect(call.subject).toContain("Bé Mai");
    expect(call.html).toContain("Mẹ Lan");
    expect(call.html).toContain("0985350570");
    expect(call.html).toContain("Hô hấp");
  });

  it("skip khi không có parentEmail", async () => {
    const { sendParentConfirmation } = await import("./booking-emails");
    const noEmail = { ...data, parentEmail: undefined };
    const ok = await sendParentConfirmation(noEmail);
    expect(ok).toBe(false);
    expect(sendEmailMock).not.toHaveBeenCalled();
  });

  it("escape HTML — XSS protection", async () => {
    const { sendParentConfirmation } = await import("./booking-emails");
    const evil = { ...data, childName: '<script>alert(1)</script>' };
    await sendParentConfirmation(evil);
    const html = sendEmailMock.mock.calls[0][0].html;
    expect(html).not.toContain("<script>alert");
    expect(html).toContain("&lt;script&gt;");
  });
});

describe("sendDoctorNotification", () => {
  it("gửi tới DOCTOR_EMAIL với subject + triệu chứng", async () => {
    const { sendDoctorNotification } = await import("./booking-emails");
    await sendDoctorNotification(data);
    expect(sendEmailMock).toHaveBeenCalledTimes(1);
    const call = sendEmailMock.mock.calls[0][0];
    expect(call.to).toBe("doc@example.com");
    expect(call.subject).toMatch(/Bé Mai/);
    expect(call.html).toContain("Bé ho 2 ngày");
    expect(call.replyTo).toBe("ph@example.com");
  });

  it("skip khi DOCTOR_EMAIL chưa set", async () => {
    delete process.env.DOCTOR_EMAIL;
    const { sendDoctorNotification } = await import("./booking-emails");
    const ok = await sendDoctorNotification(data);
    expect(ok).toBe(false);
    expect(sendEmailMock).not.toHaveBeenCalled();
  });
});

describe("notifyBookingCreated", () => {
  it("gọi cả 2 email song song", async () => {
    const { notifyBookingCreated } = await import("./booking-emails");
    await notifyBookingCreated(data);
    expect(sendEmailMock).toHaveBeenCalledTimes(2);
  });

  it("không throw khi 1 email fail", async () => {
    sendEmailMock.mockResolvedValueOnce(true).mockResolvedValueOnce(false);
    const { notifyBookingCreated } = await import("./booking-emails");
    await expect(notifyBookingCreated(data)).resolves.toBeUndefined();
  });
});
