<div align="center">

# 🦗 Phòng Khám Nhi Đồng Dế Mèn

**Website phòng khám chuyên khoa nhi tại TP.HCM — landing page, blog y khoa, đặt lịch khám online, chatbot AI tư vấn.**

*Bác sĩ xinh · Dùng thuốc xịn · Trẻ hết bệnh · Sáng thông minh*

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?logo=firebase)](https://firebase.google.com)
[![Gemini](https://img.shields.io/badge/Gemini-2.5%20Flash-4285F4?logo=google)](https://ai.google.dev)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)](#-bản-quyền)

</div>

---

## 📋 Giới thiệu

**Phòng Khám Nhi Đồng Dế Mèn** là website chính thức của phòng khám chuyên khoa nhi tại Bình Tân, TP.HCM. Dự án được thiết kế để mang lại trải nghiệm thân thiện cho phụ huynh khi tìm hiểu thông tin y khoa, đặt lịch khám và nhận tư vấn ban đầu thông qua AI chatbot — vận hành theo hướng grounded RAG (chỉ trả lời dựa trên knowledge base do bác sĩ duyệt).

### Thông tin phòng khám

| | |
|---|---|
| 🏥 **Tên** | Phòng Khám Nhi Đồng Dế Mèn |
| 📍 **Địa chỉ** | 126 Liên khu 4-5/5-6, Bình Hưng Hoà B, Bình Tân, TP.HCM |
| 📞 **Hotline** | 0985.350.570 |
| 🕓 **Giờ làm việc** | 16h30 – 20h30 (tất cả các ngày trong tuần) |
| 🚑 **Cấp cứu** | 115 |

---

## ✨ Tính năng nổi bật

### 🌐 Public (phụ huynh)
- 🏠 **Landing page** — hero gradient, mascot Dế Mèn, 6 chuyên khoa, trust signals, Google Maps embed
- 📅 **Đặt lịch khám online** — form xác thực zod, lưu Firestore, graceful degrade khi chưa cấu hình Firebase
- 📚 **Blog y khoa** — danh sách bài viết, filter chuyên khoa, markdown rendering với GFM
- 🤖 **Chatbot AI "Dế Mèn"** — floating widget streaming SSE qua Gemini, grounded trên Google Sheets KB
- 💬 **Đặt lịch qua chatbot** — chatbot thu thập thông tin tuần tự, render form xác nhận inline, gửi thẳng vào Firestore
- ⚠️ **Cấp cứu detection** — chatbot ưu tiên gợi ý gọi 115 khi phát hiện triệu chứng nguy hiểm
- ♿ **Accessibility** — semantic HTML, ARIA labels, contrast AA, mobile-first responsive

### 🔐 Admin (bác sĩ)
- 🔑 **Magic Link Email** + Google Sign-in + admin email/password
- ✍️ **Blog editor** — markdown editor, upload ảnh Cloudinary, CRUD posts Firestore
- 🔄 **Self-learning loop** — câu hỏi chưa trả lời được ghi vào Firestore + Google Sheet `Unanswered`, bác sĩ review và merge vào KB
- 📊 **Dashboard quản lý** — danh sách bookings, posts, câu hỏi pending

### 🚀 SEO & Performance
- 🗺️ Auto-generated `sitemap.xml` + `robots.txt`
- 🏷️ JSON-LD `MedicalClinic` schema
- 🖼️ Open Graph + Twitter Card metadata
- ⚡ Static generation cho public routes, SSR cho admin
- 🌏 Deploy region `sin1` (Singapore) — gần Việt Nam nhất

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 16](https://nextjs.org) (App Router) + [TypeScript 5](https://www.typescriptlang.org) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) + design tokens CSS variables |
| **Font** | [Be Vietnam Pro](https://fonts.google.com/specimen/Be+Vietnam+Pro) |
| **Database** | [Cloud Firestore](https://firebase.google.com/docs/firestore) |
| **Auth** | [Firebase Auth](https://firebase.google.com/docs/auth) (Email Link + Google + Admin) |
| **Image Storage** | [Cloudinary](https://cloudinary.com) |
| **LLM** | [Google Gemini](https://ai.google.dev) (provider-agnostic abstraction) |
| **Knowledge Base** | [Google Sheets API](https://developers.google.com/sheets/api) |
| **Email** | [Resend](https://resend.com) |
| **Hosting** | [Vercel](https://vercel.com) |
| **Validation** | [Zod 4](https://zod.dev) |
| **Markdown** | [react-markdown](https://github.com/remarkjs/react-markdown) + [remark-gfm](https://github.com/remarkjs/remark-gfm) |

---

## 🏗️ Kiến trúc

```
src/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public routes
│   │   ├── page.tsx              # 🏠 Trang chủ
│   │   ├── blog/                 # 📚 Blog list + detail
│   │   ├── dang-ky-kham/         # 📅 Form đăng ký
│   │   ├── dang-nhap/            # 🔑 Sign in
│   │   └── chuyen-khoa/          # 🏥 6 chuyên khoa (planned)
│   ├── admin/
│   │   ├── (protected)/          # 🔒 Middleware-protected
│   │   │   ├── blog/             # ✍️ Blog editor
│   │   │   └── unanswered/       # 💡 Câu hỏi chờ duyệt
│   │   └── login/                # 🛡️ Admin sign-in
│   ├── api/
│   │   ├── chat/                 # 🤖 Chatbot stream endpoint
│   │   ├── booking/              # 📅 Booking từ chatbot
│   │   └── admin/                # 🔒 Admin CRUD APIs
│   ├── sitemap.ts                # 🗺️ Auto sitemap
│   ├── robots.ts                 # 🤖 Robots policy
│   └── layout.tsx                # 📐 Root layout + JSON-LD
├── components/
│   ├── ui/                       # 🧩 Primitives (Button, Input)
│   ├── layout/                   # Header, Footer
│   ├── landing/                  # Hero, Specialties, WhyUs
│   ├── blog/                     # Blog cards, markdown
│   └── chatbot/                  # 🤖 ChatWidget, BookingConfirmCard
└── lib/
    ├── firebase/                 # Client + Admin SDK init
    ├── llm/                      # 🧠 Provider abstraction (Gemini, Mock)
    ├── sheets/                   # 📊 Google Sheets KB sync
    ├── unanswered/               # 💡 Self-learning save
    ├── validation/               # ✅ Zod schemas
    ├── auth/                     # 🔐 AuthProvider, admin-check
    └── constants.ts              # 🎨 Brand constants
```

### Chatbot Architecture (Grounded RAG)

```
User message
    │
    ▼
[Chat Widget] ──POST──► /api/chat
                            │
                            ├─► Fetch KB từ Google Sheets (cached 5min)
                            ├─► Inject KB vào system prompt
                            ├─► Stream qua Gemini API (SSE)
                            ├─► Detect "chưa có thông tin" → ghi /unanswered
                            └─► Detect <<BOOKING_DRAFT>> JSON marker
                                    │
                                    ▼
                        [BookingConfirmCard] inline trong chat
                                    │
                                    ├─► User edit + confirm
                                    └─► POST /api/booking → Firestore
```

---

## 🚀 Getting Started

### Yêu cầu

- Node.js ≥ 20
- npm hoặc pnpm
- Firebase project (Firestore + Auth enabled)
- Gemini API key (free tier OK)
- Google Sheets service account
- Cloudinary account (free tier OK)

### Setup

```bash
# 1. Clone repo
git clone https://github.com/NguyenThoaizippro/PhongKhamNhi.git
cd PhongKhamNhi

# 2. Cài dependencies
npm install

# 3. Setup environment variables
cp .env.example .env.local
# Mở .env.local và điền các giá trị thật
# (xem docs/firebase-setup.md và docs/sheets-setup.md để biết cách lấy)

# 4. Deploy Firestore rules
npx firebase deploy --only firestore:rules

# 5. Chạy dev server
npm run dev
# → http://localhost:3000
```

### Scripts

| Lệnh | Mô tả |
|------|-------|
| `npm run dev` | Dev server với hot reload |
| `npm run build` | Production build |
| `npm run start` | Chạy production build |
| `npm run lint` | ESLint check |
| `npm run typecheck` | TypeScript strict check |

### Environment Variables

Xem `.env.example` để biết toàn bộ danh sách. Các nhóm chính:

- **`NEXT_PUBLIC_FIREBASE_*`** — Client SDK config
- **`FIREBASE_ADMIN_*`** — Service account (server-side)
- **`NEXT_PUBLIC_CLOUDINARY_*`** + **`CLOUDINARY_API_SECRET`** — Image upload
- **`GEMINI_API_KEY`** + **`GEMINI_MODEL`** — Chatbot LLM
- **`GOOGLE_SHEETS_*`** — Knowledge base + unanswered logging
- **`RESEND_API_KEY`** + **`EMAIL_FROM`** — Email confirmation
- **`ADMIN_EMAIL`** + **`NEXT_PUBLIC_ADMIN_EMAIL`** — Phân quyền bác sĩ
- **`NEXT_PUBLIC_SITE_URL`** — Cho sitemap + OG metadata

> Tất cả keys đều có **graceful degrade**. Thiếu key nào thì feature đó vào mock mode hoặc skip — không crash app.

---

## 📦 Deploy lên Vercel

```bash
# Đẩy lên GitHub
git push origin main

# Vercel sẽ auto-detect Next.js và deploy
# Hoặc dùng CLI:
npx vercel --prod
```

**Quan trọng:**
1. Thêm toàn bộ env vars trong Vercel Dashboard → Settings → Environment Variables
2. Set region: `sin1` (Singapore) — đã được cấu hình sẵn trong `vercel.json`
3. Cấu hình custom domain → `phongkhamdemen.vn`
4. Submit `sitemap.xml` cho Google Search Console

---

## 🔒 Privacy & Compliance

Dự án xử lý **thông tin trẻ em** nên áp dụng các nguyên tắc bảo mật nghiêm ngặt:

- ✅ Thông tin bệnh nhi được coi như **sensitive data**
- ✅ Form đăng ký có **privacy notice** rõ ràng dưới nút submit
- ✅ Blog **không** dùng case study có thể nhận dạng bệnh nhân (luôn ẩn danh: "Bé N.A., 4 tuổi")
- ✅ Firestore security rules **khoá chặt** — collection nhạy cảm không cho client đọc/ghi trực tiếp
- ✅ Server actions + API routes **validate input** bằng zod
- ✅ Vercel security headers: `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`

---

## 🤖 Chatbot Rules

Chatbot **Dế Mèn AI** vận hành theo nguyên tắc:

1. **Grounded RAG** — chỉ trả lời dựa trên Google Sheet KB do bác sĩ duyệt
2. **Không chẩn đoán, không kê đơn** — luôn nhắc "Đây là thông tin tham khảo, không thay thế khám trực tiếp"
3. **Cấp cứu detection** — sốt cao co giật / khó thở / tím tái → ưu tiên gợi ý **115** hoặc đến phòng khám gần nhất
4. **Self-learning** — câu chưa trả lời được ghi `/unanswered`, bác sĩ review → merge vào KB
5. **Booking integration** — phát hiện ý định đặt lịch → thu thập tuần tự → render form xác nhận inline trong chat
6. **Provider-agnostic** — có thể swap Gemini ↔ Claude ↔ OpenAI mà không đụng UI

---

## 🗺️ Roadmap (13 Phases)

| # | Phase | Status |
|---|-------|--------|
| 0 | Project rules + brand setup | ✅ |
| 1 | Init Next.js 16 + Tailwind v4 + design tokens | ✅ |
| 2 | Firebase client + admin SDK + Firestore rules | ✅ |
| 3 | Header + Hero + Footer | ✅ |
| 4 | 6 Chuyên khoa + WhyUs + ClinicInfo | ✅ |
| 5 | Trang đăng ký khám + Server Action | ✅ |
| 6 | Auth (Magic Link + Google + Admin) | ✅ |
| 7 | Public blog với markdown rendering | ✅ |
| 8 | Admin blog editor + Cloudinary upload | ✅ |
| 9 | Chatbot UI + Gemini streaming | ✅ |
| 10 | Google Sheets KB + self-learning loop | ✅ |
| 11 | Đặt lịch khám qua chatbot | ✅ |
| 12 | SEO polish + sitemap + Vercel config | ✅ |

---

## 🧪 Testing Strategy

Hiện tại **không áp dụng TDD strict** — ưu tiên hoàn thành 13 phases trước. Sau khi xong, sẽ bổ sung test cho các module quan trọng:

- ✅ Validation schemas (`src/lib/validation/*`)
- ✅ API routes (`src/app/api/**`)
- ✅ LLM provider abstraction (`src/lib/llm/*`)
- ✅ KB sync (`src/lib/sheets/*`)
- ✅ Booking flow end-to-end

**Test runner đề xuất:** [Vitest](https://vitest.dev) (chuẩn Next.js + ESM)

---

## 🤝 Đóng góp

Dự án này là **proprietary** — không nhận pull request từ bên ngoài.

Nếu bạn phát hiện bug hoặc có gợi ý cải tiến, vui lòng:
- 📧 Liên hệ qua hotline phòng khám: **0985.350.570**
- 🐛 Mở issue trên GitHub (chỉ accept bug report, không accept feature request)

---

## 📜 Bản quyền

**Copyright © 2026 Nguyễn Thoại (NguyenThoaizippro). All rights reserved.**

Dự án **Phòng Khám Nhi Đồng Dế Mèn** và toàn bộ mã nguồn, tài sản thiết kế (logo, mascot, color palette, layout) thuộc sở hữu độc quyền của **Nguyễn Thoại**.

### ⚠️ Cấm

- ❌ Sao chép, phân phối lại mã nguồn dưới mọi hình thức
- ❌ Sử dụng cho mục đích thương mại khi chưa được cho phép bằng văn bản
- ❌ Reverse engineer, decompile, hoặc tạo derivative works
- ❌ Sử dụng logo, mascot Dế Mèn, hoặc brand identity cho dự án khác

### ✅ Cho phép

- ✅ Xem mã nguồn để học tập cá nhân (non-commercial)
- ✅ Fork repo trên GitHub để tham khảo (không deploy/publish)
- ✅ Trích dẫn snippet nhỏ có ghi nguồn

### 📬 Liên hệ cấp phép

Mọi yêu cầu sử dụng vượt phạm vi trên, vui lòng liên hệ:

- **Tác giả:** Nguyễn Thoại
- **GitHub:** [@NguyenThoaizippro](https://github.com/NguyenThoaizippro)
- **Repository:** [PhongKhamNhi](https://github.com/NguyenThoaizippro/PhongKhamNhi)

---

<div align="center">

**Made with 🦗 in Saigon · © 2026 Nguyễn Thoại**

*"Bác sĩ xinh – Dùng thuốc xịn – Trẻ hết bệnh – Sáng thông minh"*

</div>
