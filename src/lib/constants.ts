/**
 * Brand constants — đổi 1 chỗ, dùng toàn site.
 */

export const CLINIC = {
  name: "Phòng Khám Nhi Đồng Dế Mèn",
  shortName: "Dế Mèn",
  slogan: "Bác sĩ xinh · Dùng thuốc xịn · Trẻ hết bệnh · Sáng thông minh",
  phone: "0985350570",
  phoneDisplay: "0985.350.570",
  address: "126 Liên khu 4-5, Bình Hưng Hoà B, Bình Tân, TP.HCM",
  addressShort: "126 Liên khu 4-5, Bình Tân, TP.HCM",
  hours: "16h30 – 20h30",
  hoursLong: "16h30 – 20h30 tất cả ngày trong tuần",
  emergency: "115",
} as const;

export const SPECIALTIES = [
  {
    slug: "ho-hap",
    name: "Hô hấp",
    icon: "🫁",
    diseases: ["Viêm họng", "Viêm amydal", "Viêm thanh khí quản", "Viêm tiểu phế quản", "Viêm phổi", "Hen suyễn"],
    color: "var(--color-primary)",
  },
  {
    slug: "tieu-hoa",
    name: "Tiêu hoá",
    icon: "🍼",
    diseases: ["Tiêu chảy", "Táo bón", "Nôn ói", "Viêm dạ dày – tá tràng"],
    color: "var(--color-accent)",
  },
  {
    slug: "truyen-nhiem",
    name: "Truyền nhiễm",
    icon: "🦠",
    diseases: ["Tay chân miệng", "Sốt xuất huyết", "Sởi"],
    color: "var(--color-primary)",
  },
  {
    slug: "so-sinh",
    name: "Sơ sinh",
    icon: "👶",
    diseases: ["Trào ngược", "Nhiễm trùng sơ sinh", "Nhiễm trùng rốn"],
    color: "var(--color-accent)",
  },
  {
    slug: "dinh-duong",
    name: "Dinh dưỡng",
    icon: "🥦",
    diseases: ["Suy dinh dưỡng", "Béo phì", "Biếng ăn", "Chậm tăng trưởng", "Ăn dặm"],
    color: "var(--color-primary)",
  },
  {
    slug: "da-lieu",
    name: "Da liễu",
    icon: "🧴",
    diseases: ["Viêm da", "Mề đay dị ứng", "Chốc", "Ghẻ"],
    color: "var(--color-accent)",
  },
] as const;

export const NAV_LINKS = [
  { href: "/", label: "Trang chủ" },
  { href: "/#chuyen-khoa", label: "Chuyên khoa" },
  { href: "/blog", label: "Blog" },
  { href: "/#lien-he", label: "Liên hệ" },
] as const;
