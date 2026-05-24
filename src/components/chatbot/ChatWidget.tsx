"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChatMessage, type ChatMsg } from "./ChatMessage";
import { BookingConfirmCard } from "./BookingConfirmCard";
import { extractBookingDraft } from "@/lib/llm/booking-parser";
import type { BookingDraft } from "@/lib/llm/types";
import { cn } from "@/lib/utils";

const INITIAL_GREETING: ChatMsg = {
  role: "assistant",
  content:
    "Chào ba mẹ! 👋 Mình là **Dế Mèn AI** — trợ lý ảo của phòng khám.\n\nMình có thể giúp ba mẹ về:\n- Giờ làm việc, địa chỉ\n- Triệu chứng phổ biến ở bé\n- Đặt lịch khám\n\nBa mẹ cứ hỏi nhé!",
};

const QUICK_PROMPTS = [
  "Bé sốt 38.5°C, có cần đi khám không?",
  "Phòng khám mở cửa lúc mấy giờ?",
  "Bé bị tiêu chảy 2 ngày",
  "Mình muốn đặt lịch khám cho bé",
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([INITIAL_GREETING]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [pendingBooking, setPendingBooking] = useState<BookingDraft | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Auto-scroll xuống bài mới
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  // ESC để đóng
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Focus textarea khi mở
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || sending) return;

      setInput("");
      // Auto-resize textarea reset
      if (inputRef.current) inputRef.current.style.height = "auto";

      const userMsg: ChatMsg = { role: "user", content: trimmed };
      const conversation = [...messages, userMsg];
      setMessages([...conversation, { role: "assistant", content: "" }]);
      setSending(true);

      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: conversation }),
          signal: ctrl.signal,
        });

        if (!res.ok || !res.body) {
          throw new Error(`HTTP ${res.status}`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          const { cleaned } = extractBookingDraft(accumulated);
          setMessages((prev) => {
            const copy = [...prev];
            copy[copy.length - 1] = { role: "assistant", content: cleaned };
            return copy;
          });
        }

        // Stream done — parse booking draft (nếu có) sau khi đã có full content
        const { draft } = extractBookingDraft(accumulated);
        if (draft) setPendingBooking(draft);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = {
            role: "assistant",
            content:
              "⚠️ Xin lỗi, mình đang gặp sự cố. Ba mẹ vui lòng gọi **0985.350.570** để được bác sĩ tư vấn trực tiếp.",
          };
          return copy;
        });
      } finally {
        setSending(false);
        abortRef.current = null;
      }
    },
    [messages, sending]
  );

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send(input);
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Mở trò chuyện với Dế Mèn AI"
        className={cn(
          "fixed bottom-5 right-5 z-40 group transition-all",
          open && "opacity-0 pointer-events-none scale-90"
        )}
      >
        <span className="absolute inset-0 rounded-full bg-[color:var(--color-primary)] animate-ping opacity-30" />
        <span className="relative flex items-center gap-2 pl-2 pr-4 py-2 rounded-full bg-[color:var(--color-primary)] hover:bg-[color:var(--color-primary-dark)] text-white shadow-lg shadow-green-900/30">
          <span className="w-9 h-9 rounded-full bg-white overflow-hidden ring-2 ring-white inline-flex items-center justify-center">
            <Image
              src="/images/mascot/de-men-pointing.png"
              alt=""
              width={36}
              height={36}
              className="object-cover scale-125"
            />
          </span>
          <span className="text-sm font-semibold">Hỏi Dế Mèn</span>
        </span>
      </button>

      {/* Backdrop trên mobile */}
      {open && (
        <button
          type="button"
          aria-label="Đóng"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/30 sm:bg-transparent sm:pointer-events-none"
        />
      )}

      {/* Panel */}
      <div
        role="dialog"
        aria-label="Chatbot Dế Mèn AI"
        aria-modal="true"
        className={cn(
          "fixed z-50 flex flex-col bg-white shadow-2xl border border-[color:var(--color-border)] transition-all",
          "inset-x-0 bottom-0 top-16 rounded-t-2xl",
          "sm:inset-auto sm:bottom-5 sm:right-5 sm:top-auto sm:w-[400px] sm:h-[600px] sm:max-h-[80vh] sm:rounded-2xl",
          open ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
        )}
      >
        {/* Header */}
        <header className="flex items-center gap-3 px-4 py-3 border-b border-[color:var(--color-border)] bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-primary-dark)] text-white rounded-t-2xl">
          <div className="w-10 h-10 rounded-full bg-white overflow-hidden ring-2 ring-white/50 inline-flex items-center justify-center">
            <Image
              src="/images/mascot/de-men-pointing.png"
              alt="Mascot Dế Mèn"
              width={40}
              height={40}
              className="object-cover scale-125"
            />
          </div>
          <div className="flex-1 leading-tight">
            <p className="font-bold text-sm">Dế Mèn AI</p>
            <p className="text-[11px] text-white/80">Trợ lý ảo · Phản hồi nhanh</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Đóng cửa sổ trò chuyện"
            className="w-8 h-8 rounded-full hover:bg-white/20 inline-flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        {/* Messages */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[color:var(--color-primary-bg)]/30"
          aria-live="polite"
          aria-busy={sending}
        >
          {messages.map((m, i) => (
            <ChatMessage key={i} message={m} />
          ))}

          {/* Booking confirm card — render khi LLM emit draft */}
          {pendingBooking && (
            <BookingConfirmCard
              draft={pendingBooking}
              onConfirmed={(bookingId) => {
                setPendingBooking(null);
                setMessages((prev) => [
                  ...prev,
                  {
                    role: "assistant",
                    content: `🎉 Đã ghi nhận đặt lịch khám. Mã đặt lịch: **${bookingId}**.\n\nPhòng khám sẽ gọi xác nhận trong 24h. Cảm ơn ba mẹ đã tin tưởng Dế Mèn!`,
                  },
                ]);
              }}
              onCancel={() => {
                setPendingBooking(null);
                setMessages((prev) => [
                  ...prev,
                  {
                    role: "assistant",
                    content:
                      "Đã huỷ đặt lịch. Nếu ba mẹ cần hỗ trợ thêm cứ nhắn mình nhé. Hoặc gọi **0985.350.570** để được tư vấn trực tiếp.",
                  },
                ]);
              }}
            />
          )}

          {/* Quick prompts (chỉ hiện khi chưa chat gì) */}
          {messages.length === 1 && (
            <div className="pt-2 space-y-1.5">
              <p className="text-[11px] uppercase tracking-wider font-bold text-[color:var(--color-text-soft)] px-1">
                Câu hỏi gợi ý
              </p>
              {QUICK_PROMPTS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => void send(q)}
                  disabled={sending}
                  className="block w-full text-left text-sm px-3 py-2 rounded-xl bg-white border border-[color:var(--color-border)] hover:border-[color:var(--color-primary)] hover:bg-[color:var(--color-primary-bg)] transition disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[color:var(--color-border)] p-3 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
            className="flex items-end gap-2"
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Hỏi Dế Mèn..."
              rows={1}
              maxLength={2000}
              className="flex-1 resize-none rounded-2xl border border-[color:var(--color-border)] px-3.5 py-2 text-sm leading-snug focus:border-[color:var(--color-primary)] focus:ring-2 focus:ring-[color:var(--color-primary-soft)] focus:outline-none max-h-[120px]"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              aria-label="Gửi"
              className="flex-shrink-0 w-10 h-10 rounded-full bg-[color:var(--color-accent)] hover:bg-[color:var(--color-accent-dark)] text-white inline-flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m0 0l-7 7m7-7l7 7" />
              </svg>
            </button>
          </form>
          <p className="mt-1.5 text-[10px] text-center text-[color:var(--color-text-soft)]">
            ⚠️ Thông tin tham khảo, không thay thế khám trực tiếp. Cấp cứu gọi <strong>115</strong>.
          </p>
        </div>
      </div>
    </>
  );
}
