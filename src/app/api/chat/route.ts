import { NextRequest } from "next/server";
import { z } from "zod";
import { getLLMProvider } from "@/lib/llm";
import { getKBEntries, formatKBForPrompt } from "@/lib/sheets/kb";
import { isUnanswered, saveUnanswered } from "@/lib/unanswered/save";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const chatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1, "Tin nhắn trống").max(2000, "Tin nhắn quá dài"),
      })
    )
    .min(1, "Cần ít nhất 1 tin nhắn")
    .max(40, "Hội thoại quá dài, vui lòng làm mới"),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "JSON không hợp lệ" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const parsed = chatSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(
      JSON.stringify({ error: parsed.error.issues[0].message }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const messages = parsed.data.messages;
  const lastUserMessage =
    [...messages].reverse().find((m) => m.role === "user")?.content ?? "";

  // Fetch KB (cached 5 min). Silent fail nếu Sheets chưa setup.
  const kbEntries = await getKBEntries();
  const kbContext = formatKBForPrompt(kbEntries);

  const provider = getLLMProvider();
  const encoder = new TextEncoder();
  let accumulated = "";

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of provider.chat(messages, {
          signal: req.signal,
          context: kbContext || undefined,
        })) {
          accumulated += chunk;
          controller.enqueue(encoder.encode(chunk));
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Lỗi không xác định";
        console.error("Chat error:", msg);
        controller.enqueue(
          encoder.encode(
            "\n\n⚠️ Xin lỗi, trợ lý đang gặp sự cố. Ba mẹ vui lòng gọi 0985.350.570 để được hỗ trợ trực tiếp."
          )
        );
      } finally {
        controller.close();

        // Sau khi stream xong: nếu bot không trả lời được → ghi unanswered.
        // Best-effort, không await để không chặn close.
        if (accumulated && lastUserMessage && isUnanswered(accumulated)) {
          void saveUnanswered({ question: lastUserMessage, context: messages });
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Provider": provider.name,
      "X-KB-Size": String(kbEntries.length),
    },
  });
}
