import type { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://phongkhamdemen.vn";

// Slug các chuyên khoa hiện chưa có route riêng, sẽ bổ sung khi build trang detail.
const SPECIALTY_SLUGS = [
  "ho-hap",
  "tieu-hoa",
  "truyen-nhiem",
  "so-sinh",
  "dinh-duong",
  "da-lieu",
];

async function fetchPublishedSlugs(): Promise<string[]> {
  // Static fallback — mock posts trong Phase 7
  const mockSlugs = [
    "tre-sot-cao-khi-nao-can-di-kham",
    "tieu-chay-cap-o-tre-cach-bu-nuoc-dien-giai",
    "tre-bieng-an-7-meo-tu-bac-si-dinh-duong",
  ];

  const hasFirebase =
    !!process.env.FIREBASE_ADMIN_PROJECT_ID &&
    !!process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
    !!process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  if (!hasFirebase) return mockSlugs;

  try {
    const { adminDb } = await import("@/lib/firebase/admin");
    const snap = await adminDb
      .collection("posts")
      .where("status", "==", "published")
      .select("slug")
      .get();
    const slugs = snap.docs
      .map((d) => d.data().slug as string | undefined)
      .filter((s): s is string => typeof s === "string" && s.length > 0);
    return slugs.length > 0 ? slugs : mockSlugs;
  } catch {
    return mockSlugs;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const blogSlugs = await fetchPublishedSlugs();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${SITE_URL}/dang-ky-kham`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  const specialtyRoutes: MetadataRoute.Sitemap = SPECIALTY_SLUGS.map((slug) => ({
    url: `${SITE_URL}/chuyen-khoa/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${SITE_URL}/blog/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...specialtyRoutes, ...blogRoutes];
}
