import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock fetch toàn cục trước khi import gemini
const fetchMock = vi.fn();
beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockReset();
  process.env.GEMINI_API_KEY = "test-key";
});
afterEach(() => {
  vi.unstubAllGlobals();
});

// Helper: tạo Response với SSE streaming body
function sseResponse(events: string[], status = 200): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      for (const e of events) {
        controller.enqueue(encoder.encode(`data: ${e}\n\n`));
      }
      controller.close();
    },
  });
  return new Response(stream, { status });
}

async function collect(iterable: AsyncIterable<string>): Promise<string> {
  let out = "";
  for await (const chunk of iterable) out += chunk;
  return out;
}

describe("geminiProvider", () => {
  it("throw khi thiếu GEMINI_API_KEY", async () => {
    delete process.env.GEMINI_API_KEY;
    const { geminiProvider } = await import("./gemini");
    await expect(async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      for await (const _ of geminiProvider.chat([{ role: "user", content: "test" }])) {
        void _;
      }
    }).rejects.toThrow(/GEMINI_API_KEY/);
  });

  it("parse SSE chunks và yield text từ candidates", async () => {
    fetchMock.mockResolvedValueOnce(
      sseResponse([
        JSON.stringify({ candidates: [{ content: { parts: [{ text: "Xin " }] } }] }),
        JSON.stringify({ candidates: [{ content: { parts: [{ text: "chào" }] } }] }),
      ])
    );
    const { geminiProvider } = await import("./gemini");
    const out = await collect(geminiProvider.chat([{ role: "user", content: "hi" }]));
    expect(out).toBe("Xin chào");
  });

  it("bỏ qua chunk không parse được", async () => {
    fetchMock.mockResolvedValueOnce(
      sseResponse([
        "INVALID_JSON",
        JSON.stringify({ candidates: [{ content: { parts: [{ text: "OK" }] } }] }),
      ])
    );
    const { geminiProvider } = await import("./gemini");
    const out = await collect(geminiProvider.chat([{ role: "user", content: "hi" }]));
    expect(out).toBe("OK");
  });

  it("retry và throw GeminiOverloadError khi 503 liên tục", async () => {
    const errResp = new Response("overload", { status: 503 });
    fetchMock.mockResolvedValue(errResp);
    const { geminiProvider, GeminiOverloadError } = await import("./gemini");

    // Speed up backoff
    vi.useFakeTimers({ shouldAdvanceTime: true });

    const promise = (async () => {
      for await (const _ of geminiProvider.chat([{ role: "user", content: "hi" }])) {
        void _;
      }
    })();
    await expect(promise).rejects.toBeInstanceOf(GeminiOverloadError);
    expect(fetchMock).toHaveBeenCalledTimes(3); // 1 + 2 retries
    vi.useRealTimers();
  }, 15000);

  it("không retry với 400 (bad request)", async () => {
    fetchMock.mockResolvedValueOnce(new Response("bad", { status: 400 }));
    const { geminiProvider } = await import("./gemini");
    await expect(async () => {
      for await (const _ of geminiProvider.chat([{ role: "user", content: "hi" }])) {
        void _;
      }
    }).rejects.toThrow(/Gemini API 400/);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("inject KB context vào systemInstruction khi có opts.context", async () => {
    fetchMock.mockResolvedValueOnce(
      sseResponse([JSON.stringify({ candidates: [{ content: { parts: [{ text: "ok" }] } }] })])
    );
    const { geminiProvider } = await import("./gemini");
    await collect(
      geminiProvider.chat([{ role: "user", content: "hi" }], { context: "KB content xyz" })
    );
    const callArgs = fetchMock.mock.calls[0];
    const body = JSON.parse(callArgs[1].body as string);
    expect(body.systemInstruction.parts[0].text).toMatch(/KB content xyz/);
  });

  it("map role 'assistant' thành 'model' trong contents", async () => {
    fetchMock.mockResolvedValueOnce(
      sseResponse([JSON.stringify({ candidates: [{ content: { parts: [{ text: "ok" }] } }] })])
    );
    const { geminiProvider } = await import("./gemini");
    await collect(
      geminiProvider.chat([
        { role: "user", content: "hi" },
        { role: "assistant", content: "hello" },
      ])
    );
    const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(body.contents[1].role).toBe("model");
  });
});
