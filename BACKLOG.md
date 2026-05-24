# 📋 Backlog — Việc cần làm sau khi launch

> Nơi chốt các TODO chưa wire vào code, hoặc cần làm sau khi deploy production.
> Cập nhật khi xong từng item.

---

## 🔴 Priority 1 — Wire email confirmation qua Resend

**Trạng thái:** Key `RESEND_API_KEY` đã có trong `.env.local` + Vercel, nhưng code chưa gọi Resend API.

**Cần làm:**

1. Tạo `src/lib/email/client.ts`:
   - Resend client init với `process.env.RESEND_API_KEY`
   - Helper `sendBookingConfirmation({ booking, type: "parent" | "doctor" })`
   - Template HTML simple (inline CSS) cho 2 loại email

2. Update 2 chỗ fire email sau khi save Firestore (best-effort, fail không block):
   - `src/app/dang-ky-kham/actions.ts` — sau khi `docRef.add(...)` thành công
   - `src/app/api/booking/route.ts` — sau khi `adminDb.collection("bookings").add(...)` thành công

3. Email cho **bác sĩ** (`DOCTOR_EMAIL`):
   - Subject: `[Đặt lịch mới] Bé <X> - <ngày>`
   - Body: tóm tắt bé + SĐT phụ huynh + triệu chứng + link `/admin` (khi có)

4. Email cho **phụ huynh** (sẽ skip nếu booking chưa có field `parentEmail`):
   - Bổ sung field `parentEmail` (optional) vào `bookingSchema` + form
   - Subject: `Xác nhận đặt lịch khám tại Dế Mèn`
   - Body: tóm tắt + ngày giờ + dặn dò cấp cứu gọi 115

5. Test:
   - Vitest mock fetch → verify Resend được gọi đúng payload
   - Manual: tạo booking thật → check inbox `nnthoai0703@gmail.com`

⚠️ **Sandbox `onboarding@resend.dev` chỉ gửi tới `nnthoai0703@gmail.com`.** Khi launch production phải verify domain `phongkhamdemen.vn` ở Resend → đổi `EMAIL_FROM`.

---

## 🟡 Priority 2 — Tạo OG image cho social share

**Trạng thái:** `src/app/layout.tsx` reference `/images/og-image.jpg` nhưng file không tồn tại → share Zalo/Facebook bị vỡ ảnh.

**Cần làm:**

- Option A: Design Canva 1200×630, lưu vào `public/images/og-image.jpg`
- Option B: Tạo `src/app/opengraph-image.tsx` — Next.js dynamic OG image với mascot + slogan

---

## 🟡 Priority 3 — Firestore composite index cho blog filter

**Trạng thái:** Query `posts.where("specialty","==",x).orderBy("publishedAt","desc")` cần composite index. Lần đầu chạy production sẽ báo lỗi với link tự động.

**Cần làm:**

- Click link Firebase log để auto-create index
- Hoặc tạo `firestore.indexes.json` + deploy: `firebase deploy --only firestore:indexes`

---

## 🟢 Priority 4 — Favicon thật

**Trạng thái:** Đang dùng favicon mặc định Next.js.

**Cần làm:**

- Tạo `public/favicon.ico` (32×32) với mascot Dế Mèn
- Tạo `public/apple-touch-icon.png` (180×180)
- Optional: `public/icon.png` (512×512) cho PWA sau này

---

## 🟢 Priority 5 — Custom domain `phongkhamdemen.vn`

**Trạng thái:** Đang dùng URL `*.vercel.app` mặc định.

**Cần làm:**

1. Vercel → **Settings → Domains → Add Domain** → `phongkhamdemen.vn`
2. Add DNS records ở nhà cung cấp domain:
   - A: `@ → 76.76.21.21`
   - CNAME: `www → cname.vercel-dns.com`
3. Đợi DNS propagate (5–30 phút)
4. Update env var `NEXT_PUBLIC_SITE_URL=https://phongkhamdemen.vn` trên Vercel + redeploy

---

## 🟢 Priority 6 — Submit sitemap cho Google Search Console

**Trạng thái:** `sitemap.xml` tự generate OK nhưng Google chưa crawl.

**Cần làm sau khi có custom domain:**

1. https://search.google.com/search-console
2. Add property `phongkhamdemen.vn` → verify qua DNS TXT
3. Sidebar **Sitemaps** → submit `https://phongkhamdemen.vn/sitemap.xml`
4. Đợi 1–2 tuần để Google index

---

## 🟢 Priority 7 — Vercel Analytics + Speed Insights

**Trạng thái:** Tắt mặc định.

**Cần làm:**

- Vercel dashboard → tab **Analytics** → **Enable** (free tier OK)
- Vercel dashboard → tab **Speed Insights** → **Enable**
- Sẽ track Core Web Vitals + traffic ngay không cần code

---

## 🧪 Priority 8 — Mở rộng test suite

**Trạng thái:** 64 tests pass cho validation + parser + KB formatter. Còn thiếu:

**Cần làm:**

- [ ] Test `src/lib/llm/gemini.ts` — mock fetch, verify SSE parsing
- [ ] Test `src/lib/llm/mock.ts` — output đúng format
- [ ] Test `src/app/api/chat/route.ts` — integration test với mock provider
- [ ] Test `src/app/api/booking/route.ts` — happy path + bad payload + Firestore error
- [ ] Test `src/lib/unanswered/save.ts` — `isUnanswered()` detector
- [ ] Test `src/lib/sheets/kb.ts` — `getKBEntries()` với mocked googleapis
- [ ] (Phase 1 wire email) Test `src/lib/email/client.ts` — mock Resend SDK

Mục tiêu coverage: 80%+ cho `src/lib/`.

---

## 📌 Notes về Google Sheets

- **Sheet "Unanswered" KHÔNG cần tạo** trên Google Sheets. Code lưu vào Firestore collection `unanswered`, review qua admin page `/admin/unanswered`.
- Biến `GOOGLE_SHEETS_UNANSWERED_ID` đã được xoá khỏi `.env.example` để tránh confuse.
- Chỉ cần 1 sheet KB duy nhất.

---

## ✅ Đã hoàn thành (tham khảo)

- Phase 0–12 (13 phases) — xem `README.md`
- 22 env vars audit + Vercel deploy
- Firebase Admin SDK credentials wire
- Google Sheets KB grounded RAG (đọc được 5 entries)
- Resend API key in env (chưa wire code)
- Vitest setup + 64 unit tests
- README + LICENSE © 2026 Nguyễn Thoại
