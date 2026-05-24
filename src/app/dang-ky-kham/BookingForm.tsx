"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  SPECIALTY_OPTIONS,
  TIME_SLOT_OPTIONS,
} from "@/lib/validation/booking";
import { submitBooking, type BookingActionState } from "./actions";
import { Button } from "@/components/ui/Button";

const initialState: BookingActionState = { status: "idle" };

interface BookingFormProps {
  prefillName?: string;
  prefillEmail?: string;
  /** Firebase ID token — gửi qua hidden input để server verify UID */
  idToken?: string | null;
}

export function BookingForm({ prefillName, prefillEmail, idToken }: BookingFormProps = {}) {
  const [state, formAction] = useActionState(submitBooking, initialState);

  // Tính min/max date cho input
  const today = new Date().toISOString().slice(0, 10);
  const maxDate = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="rounded-2xl bg-[color:var(--color-primary-bg)] border-2 border-[color:var(--color-primary)] p-6 sm:p-8 text-center"
      >
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-[color:var(--color-primary-dark)]">
          Đăng ký thành công!
        </h2>
        <p className="mt-3 text-[color:var(--color-text)]">
          Phòng khám sẽ gọi xác nhận trong vòng 24 giờ qua số điện thoại bạn cung cấp.
          {prefillEmail ? " Email xác nhận đã được gửi vào hộp thư của ba mẹ." : ""}
        </p>
        <p className="mt-2 text-sm text-[color:var(--color-text-soft)]">
          Mã đặt lịch: <code className="font-mono">{state.bookingId}</code>
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Button href="/tai-khoan/lich-su-kham" variant="primary" size="md">
            Xem lịch sử đặt lịch
          </Button>
          <Button href="tel:0985350570" variant="outline" size="md">
            Gọi: 0985.350.570
          </Button>
        </div>
      </div>
    );
  }

  const fieldErr = (field: string) =>
    state.status === "error" ? state.fieldErrors?.[field] : undefined;

  return (
    <form action={formAction} className="space-y-6" noValidate>
      {idToken && <input type="hidden" name="idToken" value={idToken} />}
      {state.status === "error" && !state.fieldErrors && (
        <div
          role="alert"
          className="rounded-lg bg-red-50 border border-[color:var(--color-danger)] p-4 text-sm text-[color:var(--color-danger)]"
        >
          {state.message}
        </div>
      )}

      <fieldset className="space-y-4">
        <legend className="text-base font-bold text-[color:var(--color-text)] mb-2">
          👶 Thông tin của bé
        </legend>
        <Field
          label="Họ và tên bé"
          name="childName"
          required
          error={fieldErr("childName")}
          autoComplete="off"
          placeholder="VD: Nguyễn An"
        />
        <Field
          label="Ngày sinh"
          name="childBirthDate"
          type="date"
          required
          max={today}
          error={fieldErr("childBirthDate")}
        />
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-base font-bold text-[color:var(--color-text)] mb-2">
          👤 Thông tin phụ huynh
        </legend>
        <Field
          label="Họ và tên phụ huynh"
          name="parentName"
          required
          error={fieldErr("parentName")}
          autoComplete="name"
          placeholder="VD: Trần Thị Mai"
          defaultValue={prefillName}
        />
        <Field
          label="Số điện thoại"
          name="parentPhone"
          type="tel"
          required
          error={fieldErr("parentPhone")}
          autoComplete="tel"
          placeholder="0985350570"
          inputMode="numeric"
          maxLength={10}
        />
        <Field
          label="Email (để nhận xác nhận đặt lịch)"
          name="parentEmail"
          type="email"
          error={fieldErr("parentEmail")}
          autoComplete="email"
          placeholder="phuhuynh@gmail.com"
          inputMode="email"
          defaultValue={prefillEmail}
        />
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-base font-bold text-[color:var(--color-text)] mb-2">
          🩺 Lịch khám mong muốn
        </legend>

        <Select
          label="Chuyên khoa"
          name="specialty"
          required
          error={fieldErr("specialty")}
          options={SPECIALTY_OPTIONS}
          placeholder="-- Chọn chuyên khoa --"
        />

        <div className="grid sm:grid-cols-2 gap-4">
          <Field
            label="Ngày khám"
            name="preferredDate"
            type="date"
            required
            min={today}
            max={maxDate}
            error={fieldErr("preferredDate")}
          />
          <Select
            label="Khung giờ"
            name="preferredTimeSlot"
            required
            error={fieldErr("preferredTimeSlot")}
            options={TIME_SLOT_OPTIONS}
            placeholder="-- Chọn giờ --"
          />
        </div>

        <div>
          <label
            htmlFor="symptoms"
            className="block text-sm font-medium text-[color:var(--color-text)] mb-1.5"
          >
            Triệu chứng / lý do khám{" "}
            <span className="text-[color:var(--color-text-soft)] font-normal">(không bắt buộc)</span>
          </label>
          <textarea
            id="symptoms"
            name="symptoms"
            rows={3}
            maxLength={500}
            placeholder="VD: Bé sốt 38.5°C từ tối qua, ho khan, không nôn..."
            className="w-full rounded-lg border border-[color:var(--color-border)] px-3.5 py-2.5 text-sm focus:border-[color:var(--color-primary)] focus:ring-2 focus:ring-[color:var(--color-primary-soft)] focus:outline-none resize-none"
          />
          {fieldErr("symptoms") && <ErrorText>{fieldErr("symptoms")}</ErrorText>}
        </div>
      </fieldset>

      {/* Consent */}
      <div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="consent"
            required
            className="mt-1 w-4 h-4 rounded border-[color:var(--color-border)] text-[color:var(--color-primary)] focus:ring-[color:var(--color-primary)]"
          />
          <span className="text-sm text-[color:var(--color-text)]">
            Tôi đồng ý phòng khám lưu thông tin trên để liên hệ đặt lịch khám. Thông tin
            được bảo mật theo{" "}
            <a
              href="/chinh-sach-bao-mat"
              className="text-[color:var(--color-primary-dark)] underline"
            >
              chính sách bảo mật
            </a>{" "}
            và không chia sẻ với bên thứ ba.
          </span>
        </label>
        {fieldErr("consent") && <ErrorText>{fieldErr("consent")}</ErrorText>}
      </div>

      <SubmitButton />

      <p className="text-xs text-[color:var(--color-text-soft)] text-center">
        Thông tin trẻ em là dữ liệu nhạy cảm — chúng tôi mã hoá lưu trữ và chỉ dùng cho mục
        đích đặt lịch khám. 🔒
      </p>
    </form>
  );
}

// ===== Sub-components =====

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--color-accent)] hover:bg-[color:var(--color-accent-dark)] text-white px-7 py-3.5 text-base font-semibold shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? (
        <>
          <Spinner />
          Đang gửi...
        </>
      ) : (
        "Gửi đăng ký"
      )}
    </button>
  );
}

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  error?: string;
}

function Field({ label, name, error, required, ...props }: FieldProps) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-[color:var(--color-text)] mb-1.5">
        {label}
        {required && <span className="text-[color:var(--color-accent)] ml-0.5">*</span>}
      </label>
      <input
        id={name}
        name={name}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className="w-full rounded-lg border border-[color:var(--color-border)] px-3.5 py-2.5 text-sm focus:border-[color:var(--color-primary)] focus:ring-2 focus:ring-[color:var(--color-primary-soft)] focus:outline-none"
        {...props}
      />
      {error && <ErrorText id={`${name}-error`}>{error}</ErrorText>}
    </div>
  );
}

interface SelectProps {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
  options: ReadonlyArray<{ value: string; label: string }>;
  placeholder?: string;
}

function Select({ label, name, required, error, options, placeholder }: SelectProps) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-[color:var(--color-text)] mb-1.5">
        {label}
        {required && <span className="text-[color:var(--color-accent)] ml-0.5">*</span>}
      </label>
      <select
        id={name}
        name={name}
        required={required}
        defaultValue=""
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className="w-full rounded-lg border border-[color:var(--color-border)] px-3.5 py-2.5 text-sm bg-white focus:border-[color:var(--color-primary)] focus:ring-2 focus:ring-[color:var(--color-primary-soft)] focus:outline-none"
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <ErrorText id={`${name}-error`}>{error}</ErrorText>}
    </div>
  );
}

function ErrorText({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <p id={id} className="mt-1.5 text-xs text-[color:var(--color-danger)]" role="alert">
      {children}
    </p>
  );
}

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
      <path
        d="M4 12a8 8 0 018-8"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
