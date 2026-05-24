# 📋 Backlog — Việc cần làm sau khi launch

> Nơi chốt các TODO chưa wire vào code, hoặc cần làm sau khi deploy production.
> Cập nhật khi xong từng item.

---

## ✅ Priority 1 — Wire email confirmation qua Resend — **DONE** (`c9bc545`)

Đã làm xong:

- `src/lib/email/client.ts` — Resend client + `sendEmail()` helper
- `src/lib/email/booking-emails.ts` — `sendParentConfirmation`, `sendDoctorNotification`, `notifyBookingCreated`
- Fire ở `dang-ky-kham/actions.ts` + `api/booking/route.ts` (best-effort, không block)
- Field `parentEmail` đã có trong `bookingSchema` + form
- Test: `client.test.ts` + `booking-emails.test.ts` pass

⚠️ Khi launch production: **verify domain `phongkhamdemen.vn` ở Resend → đổi `EMAIL_FROM`** (hiện sandbox chỉ gửi tới `nnthoai0703@gmail.com`).

---

## ✅ Priority 2 — Dynamic OG image — **DONE** (session 2026-05-24)

- Đã tạo `src/app/opengraph-image.tsx` (Next.js dynamic OG, 1200×630)
- Hiển thị mascot 🩺 + slogan + giờ + hotline với gradient pastel
- Bỏ reference `/images/og-image.jpg` trong `layout.tsx` (file không tồn tại)
- JSON-LD `image` đổi sang `${SITE_URL}/opengraph-image`

✅ Share Zalo/Facebook không còn vỡ ảnh.

---

## ✅ Priority 3 — Firestore composite indexes — **DONE** (session 2026-05-24)

Đã tạo `firestore.indexes.json` với 4 composite indexes:

| Collection | Fields |
|---|---|
| `posts` | `status ASC + publishedAt DESC` (list published) |
| `posts` | `status ASC + specialty ASC + publishedAt DESC` (filter chuyên khoa) |
| `bookings` | `status ASC + createdAt DESC` (admin filter status) |
| `bookings` | `createdBy ASC + createdAt DESC` (PH xem booking của mình) |

**Để deploy lên Firestore:**

```bash
firebase deploy --only firestore:indexes
```

(Hoặc click link auto-create trong console log lần đầu Firestore query fail.)

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

## 🧪 Priority 8 — Mở rộng test suite — **Phần lớn DONE**

**Trạng thái:** 132+ tests pass cho validation + parser + KB + LLM + email + UI.

**Đã có:**

- ✅ `src/lib/llm/gemini.test.ts` — mock fetch + SSE parsing
- ✅ `src/lib/llm/mock.test.ts` — output format
- ✅ `src/lib/llm/booking-parser.test.ts`
- ✅ `src/lib/sheets/kb.test.ts` — `formatKBForPrompt` + `getKBEntries` với mocked Sheets client
- ✅ `src/lib/unanswered/save.test.ts` — `isUnanswered()` heuristic
- ✅ `src/lib/email/client.test.ts` + `booking-emails.test.ts`
- ✅ `src/lib/validation/{auth,booking,post}.test.ts`
- ✅ `src/app/api/chat/route.test.ts` — happy path stream + 400 cases
- ✅ `src/app/api/booking/route.test.ts` — happy path + bad payload + no-creds + Firestore error
- ✅ Components: `Hero`, `WhyUs`, `BookingStatusBadge`, `BookingConfirmCard`, `GoogleSignInButton`, `MagicLinkForm`

**Còn thiếu (nice-to-have):**

- [ ] Test `saveUnanswered()` (chỉ test heuristic `isUnanswered` thôi) — cần mock Firestore add
- [ ] Test `ChatWidget` complex flow (stream + booking parse + history)
- [ ] Test các page server components (sitemap, robots)
- [ ] E2E (Playwright) — sau khi có production domain

Mục tiêu coverage 80%+ cho `src/lib/` đã đạt được.

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
- Google Sheets KB grounded RAG
- Resend email wired (`c9bc545`)
- Admin booking dashboard + auth wall + lịch sử PH (`c9bc545`)
- Dynamic OG image (`opengraph-image.tsx`)
- Firestore composite indexes file (`firestore.indexes.json`)
- Vitest setup + 150+ unit tests
- README + LICENSE © 2026 Nguyễn Thoại
