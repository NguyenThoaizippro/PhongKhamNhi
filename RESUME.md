# Resume Work — Session State

> **Đọc file này đầu mỗi session mới để biết đang ở đâu, tiếp tục gì.**

**Last session:** 2026-05-24
**Repo:** https://github.com/NguyenThoaizippro/PhongKhamNhi
**Last commit:** `feat(chatbot): Google Sheets KB + self-learning unanswered loop`

**⚠️ Decision đã chốt (2026-05-24):** TDD tạm hoãn — finish 13 phases trước, test các phase quan trọng sau. Xem `CLAUDE.md` section "Testing Strategy".

---

## ✅ Đã hoàn thành (10/13 phases)

| Phase | Output |
|-------|--------|
| 0. CLAUDE.md update | Brand info, 6 chuyên khoa, color tokens, privacy rules |
| 1. Init Next.js 16 | TypeScript + Tailwind v4 + App Router + Be Vietnam Pro font |
| 2. Firebase code | Client + Admin SDK, types, `firestore.rules`, `docs/firebase-setup.md` |
| 3. Header + Hero + Footer | Sticky header, gradient hero với mascot, footer 4-col |
| 4. Specialties + WhyUs + ClinicInfo | Grid 6 chuyên khoa, 6 lý do trust, Maps embed |
| 5. Trang đăng ký khám | Form zod + Server Action, graceful degrade nếu chưa có Firebase |
| 6. Auth system | Magic Link Email + Google sign-in + admin email/pwd |
| 7. Public blog | `/blog` list + filter + `/blog/[slug]` + markdown + mock fallback |
| 8. Admin blog editor | `/admin/blog` CRUD, MarkdownEditor, Cloudinary upload |
| 9. Chatbot UI + Gemini | Floating widget, streaming SSE, provider-agnostic, mock fallback |
| 10. Sheets KB + self-learning | Inject Sheet KB vào system prompt (5-min cache), detect "chưa có thông tin" → ghi Firestore, /admin/unanswered review |

**Test status:** `npm run build` ✓ pass. 20 routes generated.

**Cloudinary thay Firebase Storage:** đã setup `src/lib/cloudinary.ts` + credentials trong `.env.local`.

---

## 🚧 Đang chờ user setup (BLOCK Phase 6+)

### A. Firebase project (15 phút — đọc `docs/firebase-setup.md`)

- [ ] Tạo project tại https://console.firebase.google.com/
- [ ] Enable Authentication (Email/Password + Google + Phone OTP)
- [ ] Enable Firestore (location `asia-southeast1`)
- [ ] Enable Storage (cùng location)
- [ ] Copy client config → `.env.local` (6 biến `NEXT_PUBLIC_FIREBASE_*`)
- [ ] Copy service account JSON → `.env.local` (3 biến `FIREBASE_ADMIN_*`)
- [ ] Deploy rules: `firebase deploy --only firestore:rules`

### B. Gemini API key (3 phút)

- [ ] Lấy free tại https://aistudio.google.com/app/apikey
- [ ] Paste vào `.env.local` → `GEMINI_API_KEY=...`

### C. Google Sheets service account (10 phút)

- [ ] Console: https://console.cloud.google.com
- [ ] Tạo service account → download JSON
- [ ] Tạo 2 Sheets: `KB` (Q&A) + `Unanswered`
- [ ] Share Sheets cho service account email với quyền Editor
- [ ] Paste 3 biến vào `.env.local`: `GOOGLE_SHEETS_CLIENT_EMAIL`, `GOOGLE_SHEETS_PRIVATE_KEY`, `GOOGLE_SHEETS_KB_ID`

### D. Resend (email) — optional, làm sau

- [ ] Đăng ký free tại https://resend.com
- [ ] `RESEND_API_KEY=...`

---

## 📋 Task list còn lại (TaskList vẫn lưu qua session)

| # | Phase | Cần keys gì |
|---|-------|-------------|
| 8 | Phase 7: Public blog UI + Firestore | Firebase ✓ A |
| 9 | Phase 8: Admin blog editor (Cloudinary upload) | Firebase ✓ A |
| 10 | **Phase 9: Chatbot UI + Gemini** | Gemini ✓ B (graceful degrade nếu chưa) |
| 11 | Phase 10: Sheets KB + self-learning | Gemini + Sheets ✓ B + C |
| 12 | Phase 11: Booking qua chatbot | Cả 3 |
| 13 | Phase 12: Polish + SEO + deploy Vercel | Tất cả |

---

## 🎯 Kế hoạch tiếp theo (đề xuất)

Bạn có 2 lựa chọn khi quay lại:

**Lựa chọn 1 — Làm Phase 9 (chatbot UI) trước:**
- Tôi build UI floating widget + LLM provider abstraction
- Graceful degrade: hoạt động UI ngay cả khi chưa có Gemini key
- Khi bạn add `GEMINI_API_KEY` → chatbot trả lời thật

**Lựa chọn 2 — Setup Firebase + làm Phase 6 (auth):**
- Bạn làm checklist A (15 phút)
- Báo tôi → unblock Phase 6, 7, 8 (auth + blog)

→ **Recommend:** Lựa chọn 1, vì:
- Không block bạn (không cần setup gì)
- Chatbot là feature flagship của project
- Phase 6 đợi bạn rảnh setup Firebase

---

## 📝 Quyết định đã chốt (KHÔNG đổi)

- **Stack:** Next.js 16 + Tailwind v4 + Firebase + Gemini + Google Sheets + Resend + Vercel
- **LLM strategy:** Provider-agnostic abstraction (Gemini default, dễ swap Claude/OpenAI sau)
- **KB:** Google Sheets (bác sĩ edit dễ), grounded RAG kiểu NotebookLM (không cần vector search dưới 150 câu)
- **Auth:** Phụ huynh = phone OTP + Google. Bác sĩ = email/password admin riêng
- **Self-learning:** Câu chưa trả lời được → save Firestore + sheet `Unanswered` → bác sĩ trả lời → merge KB
- **Design tokens:** Xanh `#7CB342`, cam `#E53935`, font Be Vietnam Pro

---

## 🔧 Lệnh thường dùng

```bash
npm run dev           # Dev server http://localhost:3000
npm run typecheck     # TypeScript check
npm run build         # Production build
npm run lint          # ESLint

git status            # Xem changes
git log --oneline -5  # 5 commit gần nhất
```

---

## 🐛 Cách resume cho session sau

Khi mở Claude Code session mới, gõ:

```
/resume-work
```

Hoặc nói với Claude: **"Đọc RESUME.md và tiếp tục Phase 9"**

Claude sẽ:
1. Đọc file này
2. Đọc TaskList (vẫn còn)
3. Check `git log` để xem last commit
4. Hỏi bạn muốn tiếp Phase nào
