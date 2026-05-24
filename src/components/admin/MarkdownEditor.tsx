"use client";

import { useState } from "react";
import { MarkdownContent } from "@/components/blog/MarkdownContent";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export function MarkdownEditor({ value, onChange }: Props) {
  const [tab, setTab] = useState<"write" | "preview">("write");

  return (
    <div className="rounded-xl border border-[color:var(--color-border)] overflow-hidden bg-white">
      {/* Mobile tab toggle */}
      <div className="lg:hidden flex border-b border-[color:var(--color-border)] text-sm font-medium">
        <TabButton active={tab === "write"} onClick={() => setTab("write")}>
          ✏️ Soạn
        </TabButton>
        <TabButton active={tab === "preview"} onClick={() => setTab("preview")}>
          👁️ Xem trước
        </TabButton>
      </div>

      <div className="grid lg:grid-cols-2 min-h-[400px]">
        {/* Editor */}
        <div
          className={`${tab === "write" ? "block" : "hidden"} lg:block border-r border-[color:var(--color-border)]`}
        >
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Viết nội dung bằng Markdown...&#10;&#10;## Heading&#10;**Bold text**, *italic*&#10;- Bullet 1&#10;- Bullet 2&#10;&#10;> Lưu ý quan trọng"
            className="w-full h-[400px] lg:h-[500px] p-4 text-sm font-mono leading-relaxed resize-none focus:outline-none"
          />
        </div>

        {/* Preview */}
        <div
          className={`${tab === "preview" ? "block" : "hidden"} lg:block p-4 h-[400px] lg:h-[500px] overflow-auto bg-[color:var(--color-primary-bg)]/30`}
        >
          {value.trim() ? (
            <MarkdownContent markdown={value} />
          ) : (
            <p className="text-sm text-[color:var(--color-text-soft)] italic">
              Preview sẽ hiện ở đây khi bạn bắt đầu viết...
            </p>
          )}
        </div>
      </div>

      <div className="px-3 py-2 bg-[color:var(--color-primary-bg)]/50 border-t border-[color:var(--color-border)] text-xs text-[color:var(--color-text-soft)]">
        💡 Hỗ trợ Markdown: **bold**, *italic*, ## heading, [link](url), ! [alt](url ảnh), - bullet, &gt; quote, ``code``, bảng GFM.
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 px-4 py-2.5 transition ${
        active
          ? "bg-white text-[color:var(--color-primary-dark)] border-b-2 border-[color:var(--color-primary)]"
          : "bg-[color:var(--color-primary-bg)]/50 text-[color:var(--color-text-soft)]"
      }`}
    >
      {children}
    </button>
  );
}
