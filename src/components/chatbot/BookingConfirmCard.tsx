"use client";

import { useState } from "react";
import {
  SPECIALTY_OPTIONS,
  TIME_SLOT_OPTIONS,
} from "@/lib/validation/booking";
import type { BookingDraft } from "@/lib/llm/types";

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; bookingId: string }
  | { status: "error"; message: string; fieldErrors?: Record<string, string> };

interface Props {
  draft: BookingDraft;
  onConfirmed: (bookingId: string) => void;
  onCancel: () => void;
}

export function BookingConfirmCard({ draft, onConfirmed, onCancel }: Props) {
  const [form, setForm] = useState<BookingDraft>(draft);
  const [state, setState] = useState<SubmitState>({ status: "idle" });

  const today = new Date().toISOString().slice(0, 10);
  const maxDate = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const fieldErrors =
    state.status === "error" ? state.fieldErrors ?? {} : {};

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState({ status: "submitting" });
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setState({
          status: "error",
          message: data.error ?? "Có lỗi xảy ra",
          fieldErrors: data.fieldErrors,
        });
        return;
      }
      setState({ status: "success", bookingId: data.bookingId });
      onConfirmed(data.bookingId);
    } catch {
      setState({
        status: "error",
        message: "Không kết nối được. Ba mẹ gọi 0985.350.570 nhé.",
      });
    }
  }

  function update<K extends keyof BookingDraft>(key: K, value: BookingDraft[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  if (state.status === "success") {
    return (
      <div className="rounded-2xl border-2 border-[color:var(--color-primary)] bg-[color:var(--color-primary-bg)] p-4 text-sm">
        <div className="flex items-center gap-2 font-bold text-[color:var(--color-primary-dark)]">
          <span className="text-lg">✅</span> Đã ghi nhận đặt lịch
        </div>
        <p className="mt-2 text-[color:var(--color-text)]">
          Phòng khám sẽ gọi xác nhận trong vòng 24h qua SĐT{" "}
          <strong>{form.parentPhone}</strong>.
        </p>
        <p className="mt-1 text-xs text-[color:var(--color-text-soft)]">
          Mã đặt lịch: <code className="font-mono">{state.bookingId}</code>
        </p>
      </div>
    );
  }

  const submitting = state.status === "submitting";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border-2 border-[color:var(--color-primary)] bg-white p-4 text-sm space-y-3"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-[color:var(--color-primary-dark)] flex items-center gap-1.5">
          <span>📅</span> Xác nhận đặt lịch khám
        </h3>
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="text-xs text-[color:var(--color-text-soft)] hover:text-[color:var(--color-text)] underline"
        >
          Huỷ
        </button>
      </div>

      <p className="text-xs text-[color:var(--color-text-soft)]">
        Ba mẹ kiểm tra lại thông tin. Có thể chỉnh sửa trực tiếp trước khi xác
        nhận.
      </p>

      {state.status === "error" && (
        <div
          role="alert"
          className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700"
        >
          {state.message}
        </div>
      )}

      <Row label="Tên bé" error={fieldErrors.childName}>
        <input
          required
          value={form.childName}
          onChange={(e) => update("childName", e.target.value)}
          className={inputCn}
          disabled={submitting}
        />
      </Row>

      <div className="grid grid-cols-2 gap-2">
        <Row label="Ngày sinh bé" error={fieldErrors.childBirthDate}>
          <input
            required
            type="date"
            value={form.childBirthDate}
            onChange={(e) => update("childBirthDate", e.target.value)}
            className={inputCn}
            disabled={submitting}
          />
        </Row>
        <Row label="SĐT ba/mẹ" error={fieldErrors.parentPhone}>
          <input
            required
            type="tel"
            value={form.parentPhone}
            onChange={(e) => update("parentPhone", e.target.value)}
            className={inputCn}
            disabled={submitting}
          />
        </Row>
      </div>

      <Row label="Tên ba/mẹ" error={fieldErrors.parentName}>
        <input
          required
          value={form.parentName}
          onChange={(e) => update("parentName", e.target.value)}
          className={inputCn}
          disabled={submitting}
        />
      </Row>

      <Row label="Chuyên khoa" error={fieldErrors.specialty}>
        <select
          required
          value={form.specialty}
          onChange={(e) => update("specialty", e.target.value)}
          className={inputCn}
          disabled={submitting}
        >
          {SPECIALTY_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </Row>

      <div className="grid grid-cols-2 gap-2">
        <Row label="Ngày khám" error={fieldErrors.preferredDate}>
          <input
            required
            type="date"
            min={today}
            max={maxDate}
            value={form.preferredDate}
            onChange={(e) => update("preferredDate", e.target.value)}
            className={inputCn}
            disabled={submitting}
          />
        </Row>
        <Row label="Khung giờ" error={fieldErrors.preferredTimeSlot}>
          <select
            required
            value={form.preferredTimeSlot}
            onChange={(e) => update("preferredTimeSlot", e.target.value)}
            className={inputCn}
            disabled={submitting}
          >
            {TIME_SLOT_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </Row>
      </div>

      <Row label="Triệu chứng (tuỳ chọn)" error={fieldErrors.symptoms}>
        <textarea
          rows={2}
          value={form.symptoms ?? ""}
          onChange={(e) => update("symptoms", e.target.value)}
          className={inputCn}
          disabled={submitting}
        />
      </Row>

      <p className="text-[10px] text-[color:var(--color-text-soft)] leading-snug">
        Thông tin chỉ dùng để liên hệ đặt lịch, không chia sẻ bên thứ 3.
      </p>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-xl bg-[color:var(--color-accent)] hover:bg-[color:var(--color-accent-dark)] text-white font-semibold py-2.5 disabled:opacity-50"
      >
        {submitting ? "Đang gửi..." : "Xác nhận đặt lịch"}
      </button>
    </form>
  );
}

const inputCn =
  "w-full rounded-lg border border-[color:var(--color-border)] px-2.5 py-1.5 text-sm focus:border-[color:var(--color-primary)] focus:ring-1 focus:ring-[color:var(--color-primary-soft)] focus:outline-none disabled:bg-gray-50";

function Row({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-[11px] font-semibold text-[color:var(--color-text-soft)] mb-1">
        {label}
      </span>
      {children}
      {error && (
        <span className="block text-[10px] text-red-600 mt-0.5">{error}</span>
      )}
    </label>
  );
}
