/**
 * Test cho POST /api/chat — stream LLM reply với mock provider.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock KB (Sheets) — không gọi network thật
vi.mock("@/lib/sheets/kb", () => ({
  getKBEntries: vi.fn().mockResolvedValue([]),
  formatKBForPrompt: vi.fn().mockReturnValue(""),
}));

// Mock unanswered saving — fire-and-forget
const saveUnansweredMock = vi.fn().mockResolvedValue(undefined);
vi.mock("@/lib/unanswered/save", async () => {
  const actual = await vi.importActual<typeof import("@/lib/unanswered/save")>(
    "@/lib/unanswered/save"
  );
  return {
    ...actual,
    saveUnanswered: (...args: unknown[]) => saveUnansweredMock(...args),
  };
});

// Mock LLM provider factory — luôn dùng mockProvider
vi.mock("@/lib/llm", async () => {
  return {
    getLLMProvider: () => ({
      name: "test-mock",
      async *chat() {
        yield "Xin ";
        yield "chào ";
        yield "ba mẹ";
      },
    }),
  };
});

function jsonRequest(body: unknown): Request {
  return new Request("http://localhost/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

async function readStream(res: Response): Promise<string> {
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let out = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    out += decoder.decode(value);
  }
  return out;
}

describe("POST /api/chat", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("trả 400 khi body không phải JSON hợp lệ", async () => {
    const { POST } = await import("./route");
    const req = jsonRequest("notjson{") as unknown as Parameters<typeof POST>[0];
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/JSON/i);
  });

  it("trả 400 khi messages rỗng", async () => {
    const { POST } = await import("./route");
    const req = jsonRequest({ messages: [] }) as unknown as Parameters<typeof POST>[0];
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("trả 400 khi message content trống", async () => {
    const { POST } = await import("./route");
    const req = jsonRequest({
      messages: [{ role: "user", content: "   " }],
    }) as unknown as Parameters<typeof POST>[0];
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("happy path: stream reply từ mock provider + set X-Provider header", async () => {
    const { POST } = await import("./route");
    const req = jsonRequest({
      messages: [{ role: "user", content: "Phòng khám mở mấy giờ?" }],
    }) as unknown as Parameters<typeof POST>[0];

    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(res.headers.get("X-Provider")).toBe("test-mock");
    expect(res.headers.get("X-KB-Size")).toBe("0");
    expect(res.headers.get("Content-Type")).toMatch(/text\/plain/);

    const text = await readStream(res);
    expect(text).toBe("Xin chào ba mẹ");
  });
});
