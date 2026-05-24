# Resume Work — Session State

> **Đọc file này đầu mỗi session mới để biết đang ở đâu, tiếp tục gì.**

**Last session:** 2026-05-24
**Repo:** https://github.com/NguyenThoaizippro/PhongKhamNhi
**Last commit:** `c9bc545 feat(admin,booking): /admin/bookings dashboard + auth wall + email Resend + lịch sử PH`
**Branch:** `main` — clean, đã push origin

---

## 🎯 Trạng thái hiện tại

**13/13 phases done + 5 milestone bổ sung:**

| Milestone | Path | Status |
|-----------|------|--------|
| 📅 Admin booking dashboard | `/admin/bookings` | ✅ Đã build, BS quản lý từng booking + đổi status + ghi chú |
| 🔒 Auth wall đặt lịch | `/dang-ky-kham` | ✅ PH bắt buộc login mới đặt được |
| 📋 Lịch sử PH | `/tai-khoan/lich-su-kham` | ✅ PH login xem các booking của mình |
| ✉️ Email Resend wired | `lib/email/{client,booking-emails}.ts` | ✅ PH nhận confirm + BS nhận notify |
| 🧪 Test suite | Vitest | ✅ 132 tests / 16 files pass, build OK |

---

## 👤 Brand đã chốt

- **Tên phòng khám:** Phòng Khám Nhi Đồng Dế Mèn
- **Bác sĩ chính:** **Bác sĩ Đông** (KHÔNG phải Đồng — đã rename toàn site) — thạo cả 6 chuyên khoa nhi
- **Email admin:** `nnthoai0703@gmail.com` (cùng giá trị `ADMIN_EMAIL` và `NEXT_PUBLIC_ADMIN_EMAIL`)
- **Email BS nhận booking notify:** `DOCTOR_EMAIL=nnthoai0703@gmail.com`
- **Resend sandbox:** `EMAIL_FROM="Phòng Khám Dế Mèn <onboarding@resend.dev>"` — chỉ gửi tới email đăng ký Resend (chính `nnthoai0703@gmail.com`). **Khi launch production phải verify domain phongkhamdemen.vn**.

---

## 🌳 Tech stack (chốt)

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router) + TypeScript 5 |
| Styling | Tailwind v4 + design tokens CSS variables |
| DB | Firebase Firestore (admin SDK server-side) |
| Auth | Firebase Auth (Google + Magic Link Email + admin email/pwd) |
| LLM | Gemini API — model `gemini-2.5-flash-lite` (đã đổi từ flash do 503 overload) |
| Email | Resend (sandbox `onboarding@resend.dev`) |
| Image storage | Cloudinary |
| KB | Google Sheets API (1 sheet, 5 entries hiện tại) |
| Hosting | Vercel (region sin1) |
| Test | Vitest + React Testing Library + jsdom + jest-dom |

---

## 📂 Cấu trúc routes

```
PUBLIC
├ /                       Landing
├ /blog                   Blog list + filter chuyên khoa
├ /blog/[slug]            Blog detail (6 mock posts, BS Đông là author)
├ /dang-ky-kham           Auth wall → BookingForm
├ /dang-nhap              Google + Magic Link, support ?redirect=
├ /dang-nhap/finish       Hoàn tất magic link
├ /tai-khoan/lich-su-kham PH xem booking của mình

ADMIN (protected — middleware check role admin)
├ /admin                  Dashboard với 3 card
├ /admin/login            Admin email/pwd login
├ /admin/bookings         Quản lý booking + filter + edit status + note BS
├ /admin/blog             List blog posts
├ /admin/blog/new         Tạo bài
├ /admin/blog/[id]/edit   Edit bài
├ /admin/unanswered       Câu hỏi chatbot chưa trả lời

API
├ /api/chat                       POST stream Gemini
├ /api/booking                    POST tạo booking từ chatbot
├ /api/me/bookings                GET booking của user hiện tại
├ /api/admin/bookings/[id]        PATCH status + doctorNote (admin only)
├ /api/admin/posts                CRUD post
├ /api/admin/posts/[id]           Update post
├ /api/admin/unanswered/[id]      Update unanswered
├ /api/admin/upload               Cloudinary signed upload
├ /sitemap.xml + /robots.txt      Auto
```

---

## 🔐 Env state (22 keys)

**18 keys ✓ SET** trong `.env.local` + Vercel.
**4 keys ○ EMPTY** (optional):
- `GOOGLE_SHEETS_UNANSWERED_ID` (code không dùng — unanswered lưu Firestore)
- `NEXT_PUBLIC_SITE_URL` (chưa có domain riêng — dùng default `phongkhamdemen.vn`)
- Còn 1-2 optional khác

`RESEND_API_KEY` đã có, đã wire vào `lib/email/`.

---

## 🧪 Test commands

```bash
npm test              # 132 tests, ~14s
npm run test:watch
npm run test:coverage
npm run typecheck     # tsc --noEmit
npm run build         # production build
npm run dev           # http://localhost:3000
```

---

## 📋 BACKLOG còn lại

Xem file `BACKLOG.md` ở root:

- 🟡 **P2 — OG image** — `/images/og-image.jpg` chưa tạo
- 🟡 **P3 — Firestore composite indexes** — `posts.where(specialty).orderBy(publishedAt)` cần index
- 🟢 **P4 — Favicon thật** (mascot Dế Mèn)
- 🟢 **P5 — Custom domain** `phongkhamdemen.vn`
- 🟢 **P6 — Submit sitemap Google Search Console**
- 🟢 **P7 — Vercel Analytics + Speed Insights**
- 🧪 **P8 — Mở rộng test suite** (`api/chat`, `api/booking`, `getKBEntries`, ChatWidget complex test)

---

## 💡 Quyết định đã chốt — KHÔNG đổi

1. **Stack:** Next.js 16 + Tailwind v4 + Firebase + Gemini + Sheets + Resend + Vercel
2. **LLM:** Provider-agnostic (Gemini default, dễ swap Claude/OpenAI) — model hiện tại `gemini-2.5-flash-lite`
3. **KB:** Google Sheets (bác sĩ edit dễ), grounded RAG
4. **Auth:** PH = Google + Magic Link. BS Đông = email/password admin
5. **Self-learning:** Unanswered → Firestore → `/admin/unanswered` review (KHÔNG dùng Sheet)
6. **Booking authn:** Bắt buộc login để đặt lịch qua web form. Chatbot có thể đặt guest nhưng UID không attach
7. **Email:** Resend sandbox cho test, verify domain khi launch
8. **Testing:** Vitest (không TDD strict). Cover validation + parser + UI + LLM + email = 132 cases
9. **Bản quyền:** © 2026 Nguyễn Thoại (xem LICENSE)

---

## 🚀 Lệnh resume cho session sau

```
/resume-work
```

Hoặc nói với Claude: **"Đọc RESUME.md và tiếp tục"**.

Claude sẽ:
1. Đọc file này
2. Check `git log --oneline -10`
3. Check `BACKLOG.md`
4. Hỏi bạn muốn làm gì tiếp
