"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { auth } from "@/lib/firebase/client";

interface Props {
  value?: string;
  onChange: (url: string) => void;
}

export function ImageUploader({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        setError("Phiên đăng nhập đã hết. Vui lòng đăng nhập lại.");
        return;
      }
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Upload thất bại");
        return;
      }
      onChange(data.url);
    } catch {
      setError("Lỗi mạng. Thử lại.");
    } finally {
      setUploading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) void handleFile(file);
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleChange}
      />

      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-[color:var(--color-border)] aspect-[16/9] bg-[color:var(--color-primary-bg)]">
          <Image src={value} alt="Ảnh bìa" fill className="object-cover" sizes="(min-width:768px) 600px, 100vw" />
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="px-3 py-1.5 rounded-full bg-white/95 text-xs font-semibold shadow hover:bg-white disabled:opacity-50"
            >
              {uploading ? "Đang upload..." : "Đổi ảnh"}
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="px-3 py-1.5 rounded-full bg-white/95 text-xs font-semibold text-[color:var(--color-danger)] shadow hover:bg-white"
            >
              Xoá
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full aspect-[16/9] rounded-xl border-2 border-dashed border-[color:var(--color-border)] hover:border-[color:var(--color-primary)] hover:bg-[color:var(--color-primary-bg)] flex flex-col items-center justify-center gap-2 text-[color:var(--color-text-soft)] transition disabled:opacity-50"
        >
          {uploading ? (
            <>
              <svg className="w-7 h-7 animate-spin text-[color:var(--color-primary)]" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
                <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
              <span className="text-sm">Đang upload lên Cloudinary...</span>
            </>
          ) : (
            <>
              <svg className="w-10 h-10 text-[color:var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium">Chọn ảnh bìa (JPG/PNG/WebP, ≤ 5MB)</span>
            </>
          )}
        </button>
      )}
      {error && (
        <p className="mt-2 text-xs text-[color:var(--color-danger)]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
