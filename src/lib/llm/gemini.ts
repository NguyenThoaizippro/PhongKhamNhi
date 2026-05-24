import {
  buildSystemPrompt,
  type ChatMessage,
  type ChatOptions,
  type LLMProvider,
} from "./types";

// Lỗi tạm thời (overload, rate limit, gateway) — nên retry
const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);
const MAX_RETRIES = 2;

/**
 * Custom error để route.ts có thể nhận biết overload và trả message phù hợp.
 */
export class GeminiOverloadError extends Error {
  constructor(public readonly status: number) {
    super(`Gemini API ${status}: high demand / rate limit`);
    this.name = "GeminiOverloadError";
  }
}

/**
 * Gemini provider — gọi trực tiếp REST API (không cần SDK, tránh lock-in version).
 * Endpoint: streamGenerateContent với SSE.
 * Tự retry 2 lần với exponential backoff khi gặp 429/500/502/503/504.
 */
export const geminiProvider: LLMProvider = {
  name: "gemini",

  async *chat(messages: ChatMessage[], opts: ChatOptions = {}): AsyncIterable<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Thiếu GEMINI_API_KEY trong .env.local");

    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${encodeURIComponent(apiKey)}`;

    const systemText = buildSystemPrompt({ kbContext: opts.context });

    const body = {
      contents: messages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
      systemInstruction: { parts: [{ text: systemText }] },
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 800,
        topP: 0.9,
      },
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
      ],
    };

    // Retry loop với exponential backoff: 0ms → 800ms → 2400ms
    let lastStatus = 0;
    let res: Response | null = null;
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      if (attempt > 0) {
        const wait = 800 * Math.pow(3, attempt - 1);
        await new Promise((r) => setTimeout(r, wait));
      }
      try {
        res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: opts.signal,
        });
        if (res.ok && res.body) break;
        lastStatus = res.status;
        if (!RETRYABLE_STATUS.has(res.status)) break;
        // 4xx khác (vd 400) → không retry
      } catch (err) {
        if (opts.signal?.aborted) throw err;
        lastStatus = 0; // network error
        if (attempt === MAX_RETRIES) throw err;
      }
    }

    if (!res || !res.ok || !res.body) {
      const errText = res ? await res.text().catch(() => "") : "";
      if (RETRYABLE_STATUS.has(lastStatus)) {
        throw new GeminiOverloadError(lastStatus);
      }
      throw new Error(`Gemini API ${lastStatus}: ${errText.slice(0, 300)}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;
          const payload = trimmed.slice(5).trim();
          if (!payload || payload === "[DONE]") continue;
          try {
            const json = JSON.parse(payload) as {
              candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
            };
            const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) yield text;
          } catch {
            // Bỏ qua chunk không parse được
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  },
};
