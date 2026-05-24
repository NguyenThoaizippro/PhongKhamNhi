import { SYSTEM_PROMPT, type ChatMessage, type ChatOptions, type LLMProvider } from "./types";

/**
 * Gemini provider — gọi trực tiếp REST API (không cần SDK, tránh lock-in version).
 * Endpoint: streamGenerateContent với SSE.
 */
export const geminiProvider: LLMProvider = {
  name: "gemini",

  async *chat(messages: ChatMessage[], opts: ChatOptions = {}): AsyncIterable<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Thiếu GEMINI_API_KEY trong .env.local");

    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${encodeURIComponent(apiKey)}`;

    const systemText = opts.context
      ? `${SYSTEM_PROMPT}\n\n=== KIẾN THỨC PHÒNG KHÁM ===\n${opts.context}`
      : SYSTEM_PROMPT;

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

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: opts.signal,
    });

    if (!res.ok || !res.body) {
      const errText = await res.text().catch(() => "");
      throw new Error(`Gemini API ${res.status}: ${errText.slice(0, 300)}`);
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
