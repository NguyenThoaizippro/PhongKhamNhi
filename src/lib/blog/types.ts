import type { Specialty } from "@/lib/firebase/types";

/**
 * Plain serializable view của blog post — dùng giữa Server Component và Client.
 * Firestore Timestamp được convert sang ISO string ở queries layer.
 */
export interface BlogPostView {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  authorName: string;
  specialty?: Specialty;
  tags: string[];
  publishedAt: string; // ISO date
  readingMinutes: number;
}

export function estimateReadingMinutes(markdown: string): number {
  const words = markdown.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}
