/**
 * Type definitions cho Firestore collections.
 * Dùng chung giữa client và admin code.
 */
import type { Timestamp } from "firebase/firestore";

/** Loại tài khoản */
export type UserRole = "parent" | "doctor" | "admin";

/** User profile lưu trong collection 'users' */
export interface UserProfile {
  uid: string;
  role: UserRole;
  displayName: string;
  email?: string;
  phoneNumber?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/** 6 chuyên khoa */
export type Specialty =
  | "ho-hap"
  | "tieu-hoa"
  | "truyen-nhiem"
  | "so-sinh"
  | "dinh-duong"
  | "da-lieu";

/** Booking đăng ký khám — collection 'bookings' */
export interface Booking {
  id: string;
  childName: string;          // Tên bé (mã hoá hoặc viết tắt khi hiển thị public)
  childBirthDate: string;     // YYYY-MM-DD
  parentName: string;
  parentPhone: string;
  parentEmail?: string | null;
  specialty: Specialty;
  preferredDate: string;      // YYYY-MM-DD
  preferredTimeSlot: string;  // VD "16h30-17h00"
  symptoms?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  source?: "web-form" | "chatbot" | "phone";
  doctorNote?: string;        // Bác sĩ ghi chú riêng khi confirm/khám xong
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy?: string;         // uid nếu user đã login, null nếu guest
}

/** Blog post — collection 'posts' */
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;            // Markdown
  coverImage?: string;
  authorUid: string;
  authorName: string;
  specialty?: Specialty;
  tags: string[];
  status: "draft" | "published";
  publishedAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  viewCount: number;
}

/** Câu hỏi chatbot không trả lời được — collection 'unanswered' (sync sang Sheet) */
export interface UnansweredQuestion {
  id: string;
  question: string;
  context?: string;           // Lịch sử hội thoại trước câu hỏi
  parentPhone?: string;
  createdAt: Timestamp;
  reviewedBy?: string;        // uid bác sĩ
  answer?: string;
  mergedToKb: boolean;        // Đã merge vào KB Sheet chưa
}
