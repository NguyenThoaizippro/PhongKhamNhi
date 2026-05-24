import "server-only";
import { geminiProvider } from "./gemini";
import { mockProvider } from "./mock";
import type { LLMProvider } from "./types";

/**
 * Factory: chọn provider dựa vào env. Phase này chỉ có Gemini + Mock.
 * Sau này thêm OpenAI / Claude / Together... chỉ cần plug vào đây.
 */
export function getLLMProvider(): LLMProvider {
  return process.env.GEMINI_API_KEY ? geminiProvider : mockProvider;
}

export type { ChatMessage, LLMProvider, ChatOptions } from "./types";
