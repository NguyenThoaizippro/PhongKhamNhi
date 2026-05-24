import { NextRequest } from "next/server";
import { z } from "zod";
import { getLLMProvider } from "@/lib/llm";

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

  const provider = getLLMProvider();
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of provider.chat(parsed.data.messages, { signal: req.signal })) {
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
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Provider": provider.name,
    },
  });
}
