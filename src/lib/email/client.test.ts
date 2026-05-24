import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const fetchMock = vi.fn();

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockReset();
  process.env.RESEND_API_KEY = "test-key";
  process.env.EMAIL_FROM = "Dế Mèn <onboarding@resend.dev>";
});
afterEach(() => {
  vi.unstubAllGlobals();
});

describe("sendEmail", () => {
  it("returns false khi thiếu RESEND_API_KEY", async () => {
    delete process.env.RESEND_API_KEY;
    const { sendEmail } = await import("./client");
    const ok = await sendEmail({ to: "a@b.com", subject: "x", html: "<p>x</p>" });
    expect(ok).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("POST tới Resend với headers + body đúng", async () => {
    fetchMock.mockResolvedValueOnce(new Response("{}", { status: 200 }));
    const { sendEmail } = await import("./client");
    await sendEmail({
      to: "ph@example.com",
      subject: "Test",
      html: "<p>hi</p>",
      text: "hi",
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    expect(opts.method).toBe("POST");
    expect(opts.headers.Authorization).toBe("Bearer test-key");
    const body = JSON.parse(opts.body);
    expect(body.to).toEqual(["ph@example.com"]);
    expect(body.subject).toBe("Test");
    expect(body.from).toContain("Dế Mèn");
  });

  it("returns false khi Resend trả non-2xx", async () => {
    fetchMock.mockResolvedValueOnce(new Response("err", { status: 422 }));
    const { sendEmail } = await import("./client");
    const ok = await sendEmail({ to: "a@b.com", subject: "x", html: "<p>x</p>" });
    expect(ok).toBe(false);
  });

  it("returns false khi network error", async () => {
    fetchMock.mockRejectedValueOnce(new Error("network"));
    const { sendEmail } = await import("./client");
    const ok = await sendEmail({ to: "a@b.com", subject: "x", html: "<p>x</p>" });
    expect(ok).toBe(false);
  });
});

describe("specialtyName + formatVnDate", () => {
  it("specialtyName map slug → tên VN", async () => {
    const { specialtyName } = await import("./client");
    expect(specialtyName("ho-hap")).toBe("Hô hấp");
    expect(specialtyName("tieu-hoa")).toBe("Tiêu hoá");
    expect(specialtyName("unknown-slug")).toBe("Chưa rõ");
  });

  it("formatVnDate render ISO date → tiếng Việt", async () => {
    const { formatVnDate } = await import("./client");
    const out = formatVnDate("2026-06-15");
    expect(out).toMatch(/15\/06\/2026|2026/);
  });
});
