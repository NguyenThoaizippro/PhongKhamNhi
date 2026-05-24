import { MarkdownContent } from "@/components/blog/MarkdownContent";

export interface ChatMsg {
  role: "user" | "assistant";
  content: string;
}

export function ChatMessage({ message }: { message: ChatMsg }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div
          aria-hidden
          className="flex-shrink-0 w-7 h-7 rounded-full bg-[color:var(--color-primary)] text-white inline-flex items-center justify-center text-sm"
        >
          🦗
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
          isUser
            ? "bg-[color:var(--color-accent)] text-white rounded-br-sm"
            : "bg-[color:var(--color-primary-bg)] text-[color:var(--color-text)] rounded-bl-sm border border-[color:var(--color-primary-soft)]"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : message.content ? (
          <div className="chat-md">
            <MarkdownContent markdown={message.content} />
          </div>
        ) : (
          <TypingDots />
        )}
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex gap-1 items-center py-1" aria-label="Đang nhập">
      <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--color-primary)] animate-bounce [animation-delay:-0.3s]" />
      <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--color-primary)] animate-bounce [animation-delay:-0.15s]" />
      <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--color-primary)] animate-bounce" />
    </span>
  );
}
