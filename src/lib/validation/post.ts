import { z } from "zod";
import { SPECIALTIES } from "@/lib/constants";

const SPECIALTY_SLUGS = SPECIALTIES.map((s) => s.slug) as [string, ...string[]];

export const postSchema = z.object({
  title: z.string().trim().min(5, "Tiêu đề tối thiểu 5 ký tự").max(160, "Tiêu đề tối đa 160 ký tự"),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]+$/, "Slug chỉ chứa chữ thường, số và dấu gạch ngang")
    .min(3, "Slug tối thiểu 3 ký tự")
    .max(120, "Slug tối đa 120 ký tự"),
  excerpt: z.string().trim().min(20, "Mô tả ngắn tối thiểu 20 ký tự").max(300),
  content: z.string().trim().min(50, "Nội dung tối thiểu 50 ký tự"),
  coverImage: z.string().url("URL ảnh bìa không hợp lệ").optional().or(z.literal("")),
  specialty: z.enum(SPECIALTY_SLUGS).optional().or(z.literal("")),
  tags: z.array(z.string().trim().min(1).max(30)).max(10, "Tối đa 10 tag"),
  status: z.enum(["draft", "published"]),
});

export type PostInput = z.infer<typeof postSchema>;

/**
 * Chuyển tiếng Việt → slug an toàn cho URL.
 * VD: "Trẻ sốt cao" → "tre-sot-cao"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
