"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/firebase/client";
import { slugify } from "@/lib/validation/post";
import { SPECIALTIES } from "@/lib/constants";
import { ImageUploader } from "./ImageUploader";
import { MarkdownEditor } from "./MarkdownEditor";

interface InitialPost {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  specialty?: string;
  tags: string[];
  status: "draft" | "published";
}

const EMPTY: InitialPost = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  specialty: "",
  tags: [],
  status: "draft",
};

export function PostEditorForm({ initial }: { initial?: InitialPost }) {
  const router = useRouter();
  const isEdit = !!initial?.id;
  const [post, setPost] = useState<InitialPost>(initial ?? EMPTY);
  const [tagsInput, setTagsInput] = useState((initial?.tags ?? []).join(", "));
  const [slugTouched, setSlugTouched] = useState(!!initial?.id);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  function update<K extends keyof InitialPost>(key: K, value: InitialPost[K]) {
    setPost((p) => ({ ...p, [key]: value }));
  }

  function handleTitleChange(title: string) {
    update("title", title);
    if (!slugTouched) update("slug", slugify(title));
  }

  async function submit(status: "draft" | "published") {
    setSaving(true);
    setError(null);
    setFieldErrors({});

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      ...post,
      tags,
      status,
      coverImage: post.coverImage || "",
      specialty: post.specialty || "",
    };

    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        setError("Phiên đăng nhập hết hạn. Đăng nhập lại.");
        return;
      }

      const url = isEdit ? `/api/admin/posts/${initial!.id}` : "/api/admin/posts";
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Lưu thất bại");
        if (data.fieldErrors) setFieldErrors(data.fieldErrors);
        return;
      }
      router.push("/admin/blog");
      router.refresh();
    } catch {
      setError("Lỗi mạng. Thử lại.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!isEdit) return;
    if (!confirm("Xoá bài này? Hành động không thể hoàn tác.")) return;
    setDeleting(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`/api/admin/posts/${initial!.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Xoá thất bại");
        return;
      }
      router.push("/admin/blog");
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  const err = (k: string) => fieldErrors[k]?.[0];

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void submit(post.status);
      }}
      className="space-y-5"
    >
      {error && (
        <div role="alert" className="rounded-lg bg-red-50 border border-[color:var(--color-danger)] p-3 text-sm text-[color:var(--color-danger)]">
          {error}
        </div>
      )}

      <Field label="Tiêu đề" required error={err("title")}>
        <input
          type="text"
          value={post.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="VD: Trẻ sốt cao — khi nào cần đi khám?"
          className="form-input"
          required
        />
      </Field>

      <Field label="Slug (URL)" required error={err("slug")} hint="Tự sinh từ tiêu đề, có thể chỉnh tay">
        <div className="flex items-center gap-2">
          <span className="text-sm text-[color:var(--color-text-soft)] whitespace-nowrap">/blog/</span>
          <input
            type="text"
            value={post.slug}
            onChange={(e) => {
              setSlugTouched(true);
              update("slug", slugify(e.target.value));
            }}
            className="form-input"
            required
          />
        </div>
      </Field>

      <Field label="Mô tả ngắn (excerpt)" required error={err("excerpt")} hint="Hiển thị ở card list + meta description SEO">
        <textarea
          value={post.excerpt}
          onChange={(e) => update("excerpt", e.target.value)}
          rows={2}
          maxLength={300}
          placeholder="1-2 câu tóm tắt bài viết..."
          className="form-input resize-none"
          required
        />
      </Field>

      <Field label="Ảnh bìa">
        <ImageUploader value={post.coverImage} onChange={(url) => update("coverImage", url)} />
      </Field>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Chuyên khoa">
          <select
            value={post.specialty}
            onChange={(e) => update("specialty", e.target.value)}
            className="form-input bg-white"
          >
            <option value="">— Không gắn —</option>
            {SPECIALTIES.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.icon} {s.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Tags" hint="Phân tách bằng dấu phẩy, VD: sốt, hô hấp">
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="sốt, hô hấp, cấp cứu"
            className="form-input"
          />
        </Field>
      </div>

      <Field label="Nội dung (Markdown)" required error={err("content")}>
        <MarkdownEditor value={post.content} onChange={(v) => update("content", v)} />
      </Field>

      {/* Sticky action bar */}
      <div className="sticky bottom-0 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 bg-white/95 backdrop-blur border-t border-[color:var(--color-border)] flex flex-wrap items-center gap-2">
        <Link href="/admin/blog" className="text-sm font-medium text-[color:var(--color-text-soft)] hover:underline mr-auto">
          ← Huỷ
        </Link>
        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting || saving}
            className="px-4 py-2 rounded-full text-sm font-semibold text-[color:var(--color-danger)] hover:bg-red-50 disabled:opacity-50"
          >
            {deleting ? "Đang xoá..." : "🗑 Xoá"}
          </button>
        )}
        <button
          type="button"
          onClick={() => void submit("draft")}
          disabled={saving}
          className="px-5 py-2 rounded-full text-sm font-semibold border-2 border-[color:var(--color-primary)] text-[color:var(--color-primary-dark)] hover:bg-[color:var(--color-primary-bg)] disabled:opacity-50"
        >
          Lưu nháp
        </button>
        <button
          type="button"
          onClick={() => void submit("published")}
          disabled={saving}
          className="px-5 py-2 rounded-full text-sm font-semibold bg-[color:var(--color-accent)] hover:bg-[color:var(--color-accent-dark)] text-white disabled:opacity-50"
        >
          {saving ? "Đang lưu..." : post.status === "published" || isEdit ? "Cập nhật & Đăng" : "Đăng bài"}
        </button>
      </div>

      <style jsx>{`
        :global(.form-input) {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid var(--color-border);
          padding: 0.625rem 0.875rem;
          font-size: 0.875rem;
        }
        :global(.form-input:focus) {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 2px var(--color-primary-soft);
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1.5">
        {label}
        {required && <span className="text-[color:var(--color-accent)] ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-[color:var(--color-text-soft)]">{hint}</p>}
      {error && (
        <p className="mt-1 text-xs text-[color:var(--color-danger)]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
