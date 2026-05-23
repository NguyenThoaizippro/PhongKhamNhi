import { z } from "zod";

/**
 * Validation schema cho form đăng ký khám.
 * Dùng chung giữa client (hint UI) và server (action verification).
 */

const SPECIALTY_SLUGS = [
  "ho-hap",
  "tieu-hoa",
  "truyen-nhiem",
  "so-sinh",
  "dinh-duong",
  "da-lieu",
  "khac",
] as const;

const TIME_SLOTS = [
  "16h30-17h30",
  "17h30-18h30",
  "18h30-19h30",
  "19h30-20h30",
] as const;

// SĐT VN: 10 số bắt đầu 0 (di động) hoặc 02 (cố định)
const VN_PHONE_REGEX = /^0(3|5|7|8|9|2)\d{8}$/;

export const bookingSchema = z.object({
  childName: z
    .string()
    .trim()
    .min(2, "Tên bé phải có ít nhất 2 ký tự")
    .max(60, "Tên bé tối đa 60 ký tự"),
  childBirthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày sinh không hợp lệ (YYYY-MM-DD)")
    .refine((date) => {
      const birthDate = new Date(date);
      const now = new Date();
      const eighteenYearsAgo = new Date(now.getFullYear() - 18, now.getMonth(), now.getDate());
      return birthDate <= now && birthDate >= eighteenYearsAgo;
    }, "Phòng khám nhận khám trẻ dưới 18 tuổi"),
  parentName: z
    .string()
    .trim()
    .min(2, "Tên phụ huynh phải có ít nhất 2 ký tự")
    .max(60),
  parentPhone: z
    .string()
    .trim()
    .regex(VN_PHONE_REGEX, "Số điện thoại không đúng định dạng VN (VD: 0985350570)"),
  specialty: z.enum(SPECIALTY_SLUGS, { message: "Vui lòng chọn chuyên khoa" }),
  preferredDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày khám không hợp lệ")
    .refine((date) => {
      const target = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const maxDate = new Date(today);
      maxDate.setDate(maxDate.getDate() + 60);
      return target >= today && target <= maxDate;
    }, "Vui lòng chọn ngày trong vòng 60 ngày tới"),
  preferredTimeSlot: z.enum(TIME_SLOTS, {
    message: "Vui lòng chọn khung giờ",
  }),
  symptoms: z.string().trim().max(500, "Triệu chứng tối đa 500 ký tự").optional(),
  consent: z
    .string()
    .refine((v) => v === "on" || v === "true", "Bạn cần đồng ý chính sách bảo mật"),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export const SPECIALTY_OPTIONS = [
  { value: "ho-hap", label: "Hô hấp" },
  { value: "tieu-hoa", label: "Tiêu hoá" },
  { value: "truyen-nhiem", label: "Truyền nhiễm" },
  { value: "so-sinh", label: "Sơ sinh" },
  { value: "dinh-duong", label: "Dinh dưỡng" },
  { value: "da-lieu", label: "Da liễu" },
  { value: "khac", label: "Chưa rõ — nhờ bác sĩ tư vấn" },
] as const;

export const TIME_SLOT_OPTIONS = [
  { value: "16h30-17h30", label: "16h30 – 17h30" },
  { value: "17h30-18h30", label: "17h30 – 18h30" },
  { value: "18h30-19h30", label: "18h30 – 19h30" },
  { value: "19h30-20h30", label: "19h30 – 20h30" },
] as const;
