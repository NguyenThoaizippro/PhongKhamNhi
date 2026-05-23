# PhongKhamDeMen — Claude Code Project Rules

## Project
Dự án website cho **Phòng Khám Nhi Đồng Dế Mèn** — phòng khám chuyên khoa nhi tại TP.HCM. Mục tiêu: tạo trải nghiệm thân thiện cho phụ huynh, tích hợp chatbot AI tư vấn, đăng ký khám online, bảo mật thông tin bệnh nhi.

## Brand
- **Tên:** Phòng Khám Nhi Đồng Dế Mèn
- **Mascot:** Chú dế mèn mặc áo blouse trắng, cầm ống nghe
- **Slogan:** "Bác sĩ xinh – Dùng thuốc xịn – Trẻ hết bệnh – Sáng thông minh"
- **Giờ làm việc:** 16h30 – 20h30 (tất cả ngày trong tuần)
- **SĐT:** 0985.350.570
- **Địa chỉ:** 126 Liên khu 4-5/5-6, Bình Hưng Hoà B, Bình Tân, TP.HCM

## Color Palette (Design Tokens)
```css
--color-primary: #7CB342;       /* Xanh lá medical */
--color-primary-dark: #558B2F;
--color-accent: #E53935;        /* Cam đỏ "DẾ MÈN" - CTA highlight */
--color-mascot: #8D6E63;        /* Nâu mascot */
--color-bg: #FFFFFF;
--color-bg-soft: #F1F8E9;       /* Pastel xanh nhạt */
--color-text: #333333;
--color-text-soft: #666666;
```

## 6 Chuyên Khoa
1. **Hô hấp** — Viêm họng, viêm amydal, viêm thanh khí quản, viêm tiểu phế quản, viêm phổi, hen [suyễn]
2. **Tiêu hoá** — Tiêu chảy, táo bón, nôn ói, viêm dạ dày – tá tràng
3. **Truyền nhiễm** — Tay chân miệng, sốt xuất huyết, sởi
4. **Sơ sinh** — Trào ngược, nhiễm trùng sơ sinh, nhiễm trùng rốn
5. **Dinh dưỡng** — Suy dinh dưỡng, béo phì, biếng ăn, chậm tăng trưởng, ăn dặm
6. **Da liễu** — Viêm da, mề đay dị ứng, chốc, ghẻ

## Tech Stack
| Tầng | Công nghệ |
|------|-----------|
| Frontend | Next.js 14 (App Router) + TypeScript + Tailwind CSS |
| Database | Firebase Firestore |
| Auth | Firebase Auth (phone OTP + Google + admin email/password) |
| Storage | Firebase Storage (ảnh blog) |
| LLM | Gemini API (free tier) — provider-agnostic abstraction |
| Knowledge Base | Google Sheets API |
| Email | Resend (free tier) |
| Hosting | Vercel + GitHub |

## Architecture
```
src/
├── app/                    # Next.js App Router
│   ├── (public)/          # Public routes
│   │   ├── page.tsx       # Trang chủ
│   │   ├── chuyen-khoa/   # 6 chuyên khoa
│   │   ├── blog/          # Public blog
│   │   └── dang-ky-kham/  # Form đăng ký
│   ├── admin/             # Admin panel cho bác sĩ
│   │   ├── login/
│   │   ├── blog/          # Viết blog
│   │   └── unanswered/    # Duyệt câu hỏi
│   └── api/
│       ├── chat/          # Chatbot endpoint
│       ├── booking/
│       └── kb/sync/       # Sync KB từ Sheet
├── components/
│   ├── ui/                # shadcn-style primitives
│   ├── chatbot/
│   └── landing/
└── lib/
    ├── firebase/
    ├── llm/               # Provider-agnostic LLM
    └── sheets/            # Google Sheets sync
```

## Skills Available
| Skill | Khi dùng |
|-------|----------|
| `/karpathy-guidelines` | Đầu mỗi task — keep simple, surgical |
| `/frontend-design` | Viết component HTML/CSS |
| `/landing-page-design` | Section conversion (hero, CTA, trust) |
| `/compact-handover` | Trước khi đổi session |
| `/strategic-compact` | Context >100k tokens |

## Code Rules
- **NEVER** hardcode colors, spacing, font sizes — use CSS variables / Tailwind tokens
- **ALWAYS** add `alt` attributes mô tả ý nghĩa ảnh (accessibility)
- **NEVER** hiển thị tên đầy đủ của bệnh nhi trên public — luôn ẩn danh (VD: "Bé N.A., 4 tuổi")
- Forms thu thập thông tin bệnh nhân **phải** có privacy notice dưới submit button
- All CTAs above the fold on mobile
- Server actions / API routes phải validate input (zod recommended)
- Firestore rules phải khoá chặt — không cho client đọc/ghi trực tiếp collection nhạy cảm

## Privacy & Compliance
- Thông tin trẻ em → coi như sensitive data
- Form đăng ký: ghi rõ thông tin được dùng để liên hệ đặt lịch, không chia sẻ bên thứ 3
- Blog không được dùng case study có thể nhận dạng bệnh nhân
- Phone số phụ huynh: chỉ lưu hash hoặc mã hoá ở rest (nếu cần)

## Chatbot Rules
- Chatbot **chỉ** trả lời dựa trên Google Sheet KB (grounded RAG, NotebookLM-style)
- Không tìm thấy → phản hồi: "Tôi chưa có thông tin này. Vui lòng gọi 0985.350.570 để gặp bác sĩ."
- Luôn nhắc: "Đây là thông tin tham khảo, không thay thế khám trực tiếp."
- Câu hỏi cấp cứu (sốt cao, co giật, khó thở) → ưu tiên gợi ý gọi 115 hoặc đến phòng khám

## Workflow
- 13 phases trong task list (#1 → #13) — làm tuần tự, commit mỗi phase
- Mỗi phase xong: review → commit → push GitHub → Vercel auto deploy preview
- Phase 0-2: Setup. Phase 3-5: Landing + booking. Phase 6-8: Auth + blog. Phase 9-11: Chatbot. Phase 12: Polish.

## Installed Tools
- **GSD v1.42.3** — Workflow framework (local, `.claude/`)
- **Claude Mem v13.3.0** — Persistent memory (worker: `npx claude-mem start`, port 37700)
- **Context Mode MCP** — Giảm context usage (`npx -y context-mode`)
- **Plugins installed:** superpowers, frontend-design, context7, code-review, serena
