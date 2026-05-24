import { describe, it, expect } from "vitest";
import { postSchema, slugify } from "./post";

const validPost = {
  title: "Trẻ sốt cao — khi nào cần đi khám",
  slug: "tre-sot-cao-khi-nao-can-di-kham",
  excerpt: "Bài viết hướng dẫn ba mẹ phân biệt sốt cần khám và sốt theo dõi tại nhà.",
  content:
    "Sốt ở trẻ em là phản ứng tự nhiên. Ba mẹ cần biết khi nào sốt là dấu hiệu nguy hiểm cần đi khám ngay.",
  coverImage: "https://images.unsplash.com/photo-123",
  specialty: "ho-hap",
  tags: ["sốt", "nhi khoa"],
  status: "published",
};

describe("postSchema", () => {
  it("accepts valid post", () => {
    expect(postSchema.safeParse(validPost).success).toBe(true);
  });

  it("rejects title shorter than 5 chars", () => {
    expect(
      postSchema.safeParse({ ...validPost, title: "Test" }).success
    ).toBe(false);
  });

  it("rejects title longer than 160 chars", () => {
    expect(
      postSchema.safeParse({ ...validPost, title: "x".repeat(161) }).success
    ).toBe(false);
  });

  it.each([
    ["valid-slug", true],
    ["a-1-2", true],
    ["abc", true],
    ["Invalid_Slug", false], // underscores
    ["có-dấu", false], // diacritics
    ["UPPER", false],
    ["space slug", false],
    ["ab", false], // too short
  ])("slug '%s' validity = %s", (slug, valid) => {
    expect(postSchema.safeParse({ ...validPost, slug }).success).toBe(valid);
  });

  it("rejects excerpt shorter than 20 chars", () => {
    expect(
      postSchema.safeParse({ ...validPost, excerpt: "Quá ngắn" }).success
    ).toBe(false);
  });

  it("rejects content shorter than 50 chars", () => {
    expect(
      postSchema.safeParse({ ...validPost, content: "Quá ngắn" }).success
    ).toBe(false);
  });

  it("accepts empty cover image", () => {
    expect(
      postSchema.safeParse({ ...validPost, coverImage: "" }).success
    ).toBe(true);
  });

  it("rejects malformed cover image URL", () => {
    expect(
      postSchema.safeParse({ ...validPost, coverImage: "not-a-url" }).success
    ).toBe(false);
  });

  it("limits tags to 10", () => {
    expect(
      postSchema.safeParse({
        ...validPost,
        tags: Array.from({ length: 11 }, (_, i) => `tag${i}`),
      }).success
    ).toBe(false);
  });

  it("accepts only draft|published status", () => {
    expect(postSchema.safeParse({ ...validPost, status: "draft" }).success).toBe(
      true
    );
    expect(
      postSchema.safeParse({ ...validPost, status: "archived" }).success
    ).toBe(false);
  });
});

describe("slugify", () => {
  it.each([
    ["Trẻ sốt cao", "tre-sot-cao"],
    ["Đường ruột bé yếu", "duong-ruot-be-yeu"],
    ["Viêm họng & ho", "viem-hong-ho"],
    ["  Multiple   Spaces  ", "multiple-spaces"],
    ["already-a-slug", "already-a-slug"],
    ["UPPER CASE Title", "upper-case-title"],
    ["Đặc-biệt: dấu chấm? và !", "dac-biet-dau-cham-va"],
  ])("'%s' → '%s'", (input, expected) => {
    expect(slugify(input)).toBe(expected);
  });

  it("truncates to 80 chars", () => {
    const long = "a".repeat(100);
    expect(slugify(long)).toHaveLength(80);
  });

  it("strips leading/trailing hyphens", () => {
    expect(slugify("---hello---")).toBe("hello");
  });
});
