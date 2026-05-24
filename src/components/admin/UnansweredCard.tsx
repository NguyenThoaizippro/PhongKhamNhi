"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/client";
import type { UnansweredItem } from "@/lib/unanswered/queries";

export function UnansweredCard({ item }: { item: UnansweredItem }) {
  const router = useRouter();
  const [answer, setAnswer] = useState(item.answer ?? "");
  const [expanded, setExpanded] = useState(!item.answer);
  const [saving, setSaving] = useState(false);
  const [merged, setMerged] = useState(item.mergedToKb);
  const [error, setError] = useState<string | null>(null);

  const date = new Date(item.createdAt).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  async function callAPI(payload: Record<string, unknown>, method: "PATCH" | "DELETE" = "PATCH") {
    const token = await auth.currentUser?.getIdToken();
    if (!token) throw new Error("Phiên đăng nhập đã hết");
    const res = await fetch(`/api/admin/unanswered/${item.id}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(method === "PATCH" ? { "Content-Type": "application/json" } : {}),
      },
      body: method === "PATCH" ? JSON.stringify(payload) : undefined,
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error ?? "Lưu thất bại");
    }
  }

  async function saveAnswer() {
    setError(null);
    setSaving(true);
    try {
      await callAPI({ answer });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi");
    } finally {
      setSaving(false);
    }
  }

  async function toggleMerged() {
    setError(null);
    setSaving(true);
    try {
      const next = !merged;
      await callAPI({ mergedToKb: next });
      setMerged(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Xoá câu hỏi này?")) return;
    setSaving(true);
    try {
      await callAPI({}, "DELETE");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi");
      setSaving(false);
    }
  }

  const status = item.answer ? (merged ? "merged" : "answered") : "pending";

  return (
    <article className="rounded-2xl border border-[color:var(--color-border)] bg-white overflow-hidden">
      <header className="px-4 py-3 flex flex-wrap items-start gap-3 border-b border-[color:var(--color-border)] bg-[color:var(--color-primary-bg)]/30">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-[color:var(--color-text-soft)]">{date}</p>
          <p className="font-semibold text-sm mt-0.5 line-clamp-2">{item.question}</p>
        </div>
        <StatusBadge status={status} />
      </header>

      {expanded ? (
        <div className="p-4 space-y-3">
          {item.context && (
            <details className="text-xs">
              <summary className="cursor-pointer text-[color:var(--color-text-soft)] hover:text-[color:var(--color-text)]">
                Xem hội thoại trước đó
              </summary>
              <pre className="mt-2 p-3 bg-[color:var(--color-primary-bg)]/40 rounded-lg whitespace-pre-wrap text-[11px] font-mono leading-relaxed">
                {item.context}
              </pre>
            </details>
          )}

          <div>
            <label htmlFor={`ans-${item.id}`} className="block text-xs font-semibold mb-1.5">
              Câu trả lời từ bác sĩ
            </label>
            <textarea
              id={`ans-${item.id}`}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={4}
              placeholder="Viết câu trả lời. Sau đó copy sang Google Sheet KB để chatbot tự học."
              className="w-full rounded-lg border border-[color:var(--color-border)] px-3 py-2 text-sm focus:border-[color:var(--color-primary)] focus:ring-2 focus:ring-[color:var(--color-primary-soft)] focus:outline-none"
            />
          </div>

          {error && (
            <p className="text-xs text-[color:var(--color-danger)]" role="alert">
              {error}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={saveAnswer}
              disabled={saving || answer.trim().length < 10}
              className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[color:var(--color-primary)] hover:bg-[color:var(--color-primary-dark)] text-white disabled:opacity-50"
            >
              {saving ? "Đang lưu..." : "💾 Lưu câu trả lời"}
            </button>
            {item.answer && (
              <button
                type="button"
                onClick={toggleMerged}
                disabled={saving}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border-2 ${
                  merged
                    ? "border-[color:var(--color-primary)] bg-[color:var(--color-primary-bg)] text-[color:var(--color-primary-dark)]"
                    : "border-[color:var(--color-border)] hover:border-[color:var(--color-primary)]"
                }`}
              >
                {merged ? "✓ Đã merge vào KB" : "Đánh dấu đã merge KB"}
              </button>
            )}
            <button
              type="button"
              onClick={handleDelete}
              disabled={saving}
              className="ml-auto text-xs text-[color:var(--color-danger)] hover:underline"
            >
              🗑 Xoá
            </button>
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="text-xs text-[color:var(--color-text-soft)] hover:underline"
            >
              Thu gọn
            </button>
          </div>
        </div>
      ) : (
        <div className="px-4 py-3 flex items-center justify-between">
          {item.answer ? (
            <p className="text-xs text-[color:var(--color-text-soft)] line-clamp-1 flex-1 mr-3">
              {item.answer}
            </p>
          ) : (
            <p className="text-xs italic text-[color:var(--color-text-soft)]">Chưa có câu trả lời</p>
          )}
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="text-xs font-semibold text-[color:var(--color-primary-dark)] hover:underline"
          >
            Trả lời →
          </button>
        </div>
      )}
    </article>
  );
}

function StatusBadge({ status }: { status: "pending" | "answered" | "merged" }) {
  const map = {
    pending: { label: "Chờ duyệt", cls: "bg-yellow-100 text-yellow-700" },
    answered: { label: "Đã trả lời", cls: "bg-blue-100 text-blue-700" },
    merged: { label: "Đã merge KB", cls: "bg-green-100 text-green-700" },
  } as const;
  const cfg = map[status];
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}
