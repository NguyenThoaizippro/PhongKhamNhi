import "server-only";
import type { Specialty } from "@/lib/firebase/types";
import { type BlogPostView, estimateReadingMinutes } from "./types";
import { MOCK_POSTS } from "./mock";

/**
 * Lazy-load Firebase Admin để tránh crash khi credentials thiếu (graceful degrade).
 */
async function getAdminDb() {
  try {
    const mod = await import("@/lib/firebase/admin");
    return mod.adminDb;
  } catch {
    return null;
  }
}

function toIso(value: unknown): string {
  if (!value) return new Date().toISOString();
  if (typeof value === "string") return value;
  // Firestore Timestamp object
  if (typeof value === "object" && value !== null && "toDate" in value) {
    try {
      return (value as { toDate: () => Date }).toDate().toISOString();
    } catch {
      return new Date().toISOString();
    }
  }
  return new Date().toISOString();
}

interface PostDoc {
  slug?: string;
  title?: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  authorName?: string;
  specialty?: Specialty;
  tags?: string[];
  publishedAt?: unknown;
  status?: string;
}

function docToView(id: string, data: PostDoc): BlogPostView {
  const content = data.content ?? "";
  return {
    id,
    slug: data.slug ?? id,
    title: data.title ?? "Bài viết chưa có tiêu đề",
    excerpt: data.excerpt ?? "",
    content,
    coverImage: data.coverImage,
    authorName: data.authorName ?? "Phòng Khám Dế Mèn",
    specialty: data.specialty,
    tags: data.tags ?? [],
    publishedAt: toIso(data.publishedAt),
    readingMinutes: estimateReadingMinutes(content),
  };
}

function filterBySpecialty(posts: BlogPostView[], specialty?: string): BlogPostView[] {
  if (!specialty) return posts;
  return posts.filter((p) => p.specialty === specialty);
}

export async function getPublishedPosts(specialty?: string): Promise<BlogPostView[]> {
  const db = await getAdminDb();
  if (!db) return filterBySpecialty(MOCK_POSTS, specialty);

  try {
    let q = db.collection("posts").where("status", "==", "published");
    if (specialty) q = q.where("specialty", "==", specialty);
    const snap = await q.orderBy("publishedAt", "desc").limit(30).get();
    if (snap.empty) return filterBySpecialty(MOCK_POSTS, specialty);
    return snap.docs.map((d) => docToView(d.id, d.data() as PostDoc));
  } catch {
    return filterBySpecialty(MOCK_POSTS, specialty);
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPostView | null> {
  const db = await getAdminDb();
  if (!db) return MOCK_POSTS.find((p) => p.slug === slug) ?? null;

  try {
    const snap = await db
      .collection("posts")
      .where("slug", "==", slug)
      .where("status", "==", "published")
      .limit(1)
      .get();

    if (snap.empty) {
      return MOCK_POSTS.find((p) => p.slug === slug) ?? null;
    }
    const doc = snap.docs[0];
    return docToView(doc.id, doc.data() as PostDoc);
  } catch {
    return MOCK_POSTS.find((p) => p.slug === slug) ?? null;
  }
}

export async function getAllPublishedSlugs(): Promise<string[]> {
  const db = await getAdminDb();
  if (!db) return MOCK_POSTS.map((p) => p.slug);

  try {
    const snap = await db
      .collection("posts")
      .where("status", "==", "published")
      .select("slug")
      .get();
    if (snap.empty) return MOCK_POSTS.map((p) => p.slug);
    return snap.docs.map((d) => (d.data().slug as string) ?? d.id);
  } catch {
    return MOCK_POSTS.map((p) => p.slug);
  }
}
