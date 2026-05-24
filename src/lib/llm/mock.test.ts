import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mockProvider } from "./mock";

async function collect(iterable: AsyncIterable<string>): Promise<string> {
  let out = "";
  for await (const chunk of iterable) out += chunk;
  return out;
}

describe("mockProvider", () => {
  beforeEach(() => {
    // Stub setTimeout để không thực sự delay 25ms/word
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("trả lời cấp cứu khi có keyword 'sốt cao'", async () => {
    const out = await collect(
      mockProvider.chat([{ role: "user", content: "Bé sốt 40 độ co giật" }])
    );
    expect(out.toLowerCase()).toMatch(/115|cấp cứu|nhanh/);
  });

  it("trả lời giờ làm việc khi có keyword 'giờ' hoặc 'mở'", async () => {
    const out = await collect(
      mockProvider.chat([{ role: "user", content: "Phòng khám mở mấy giờ?" }])
    );
    expect(out).toMatch(/16h30/);
    expect(out).toMatch(/20h30/);
  });

  it("trả lời đặt lịch khi có keyword 'đặt lịch'", async () => {
    const out = await collect(
      mockProvider.chat([{ role: "user", content: "Tôi muốn đặt lịch khám" }])
    );
    expect(out).toMatch(/dang-ky-kham|đăng ký|0985/);
  });

  it("trả lời default greeting khi không match keyword", async () => {
    const out = await collect(
      mockProvider.chat([{ role: "user", content: "abc xyz random" }])
    );
    expect(out).toMatch(/demo|GEMINI_API_KEY|Dế Mèn/i);
  });

  it("có name = 'mock'", () => {
    expect(mockProvider.name).toBe("mock");
  });
});
