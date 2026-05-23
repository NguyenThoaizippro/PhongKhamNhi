---
name: landing-page-design
description: |
  Conversion-focused landing page design system for medical clinic / healthcare websites.
  Covers hero sections, trust signals, CTA psychology, above-the-fold layout, and social proof.
  Triggers: "tạo landing page", "thiết kế trang giới thiệu", "landing page phòng khám"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# Landing Page Design — Medical Clinic

Conversion-optimized landing page patterns specifically for healthcare/medical clinic websites.

## Above-the-Fold Formula (Hero Section)

The first 600px height must answer 3 questions in under 5 seconds:
1. **What is this?** — Clear headline stating the service
2. **Who is it for?** — Target patient demographic
3. **What do I do next?** — Single, prominent CTA

```
┌─────────────────────────────────────┐
│  [Logo]              [Phone] [Book]  │  ← Nav
├─────────────────────────────────────┤
│                                     │
│  H1: Phòng Khám Nam Khoa Uy Tín     │  ← Main headline
│  H2: Tư vấn riêng tư, bảo mật      │  ← Sub-headline
│                                     │
│  [CTÁ: Đặt Lịch Khám Ngay]         │  ← Primary CTA (above fold)
│  [Hotline: 1800 xxxx]               │  ← Secondary CTA
│                                     │
│  ✓ Bác sĩ chuyên khoa  ✓ Bảo mật  │  ← 3 trust icons below CTA
└─────────────────────────────────────┘
```

## Sections Order (Proven Conversion Flow)

1. **Hero** — Hook + CTA
2. **Problem/Pain** — Identify the patient's concern
3. **Solution** — How the clinic solves it
4. **Trust Signals** — Credentials, certifications, years of experience
5. **Services** — What's offered (3-6 cards)
6. **Social Proof** — Patient testimonials (anonymized for medical privacy)
7. **Process** — How it works (3-4 simple steps)
8. **FAQ** — Address top objections
9. **Final CTA** — Repeat the primary call-to-action
10. **Footer** — Contact, address, legal

## Medical Clinic Trust Signals (Critical)

For healthcare, trust is the #1 conversion factor:

```html
<!-- Credentials section -->
<div class="trust-badges">
  <div class="badge">
    <img src="ministry-health-logo.svg" alt="Bộ Y Tế">
    <span>Được cấp phép bởi Bộ Y Tế</span>
  </div>
  <div class="badge">
    <span class="number">15+</span>
    <span>Năm kinh nghiệm</span>
  </div>
  <div class="badge">
    <span class="number">10,000+</span>
    <span>Bệnh nhân tin tưởng</span>
  </div>
</div>
```

**Required trust elements for medical site:**
- [ ] Ministry of Health license number visible
- [ ] Doctor credentials (tên + bằng cấp + kinh nghiệm)
- [ ] Privacy/confidentiality statement (critical for men's health)
- [ ] Physical address + Google Maps
- [ ] Real phone number (not just a form)

## CTA Psychology for Medical Clinics

**Do use:**
- "Đặt lịch khám miễn phí" (free consultation removes barrier)
- "Tư vấn ngay — hoàn toàn bảo mật" (privacy reassurance)
- "Gọi ngay: [number]" (immediate action, lowers friction)

**Avoid:**
- Generic "Tìm hiểu thêm" (no urgency, no value)
- "Mua ngay" (transactional language wrong for healthcare)
- Multiple competing CTAs on same screen

**CTA Color Rule:** Primary CTA must have ≥3:1 contrast with background and be the most visually dominant element in its section.

## Social Proof for Medical Context

Patient privacy is paramount. Format testimonials appropriately:

```html
<blockquote class="testimonial">
  <p>"Bác sĩ tư vấn rất tận tâm, cảm giác hoàn toàn thoải mái và không ngại ngùng..."</p>
  <cite>— Anh T.H., 34 tuổi, TP.HCM</cite>
  <!-- Never use full names for medical testimonials -->
</blockquote>
```

## Services Section Layout

```
┌──────────┐ ┌──────────┐ ┌──────────┐
│  Icon    │ │  Icon    │ │  Icon    │
│ Service  │ │ Service  │ │ Service  │
│ Name     │ │ Name     │ │ Name     │
│          │ │          │ │          │
│ 1-line   │ │ 1-line   │ │ 1-line   │
│ description│ description│ description│
│          │ │          │ │          │
│[Xem thêm]│ │[Xem thêm]│ │[Xem thêm]│
└──────────┘ └──────────┘ └──────────┘
```
- 3 columns on desktop, 1 column on mobile
- Max 6 services on landing page (more → separate services page)
- Each card: icon + name + 1 sentence + optional CTA

## Appointment Form Best Practices

```html
<form id="booking-form">
  <!-- Minimal fields = higher conversion -->
  <input type="text" name="name" placeholder="Họ và tên" required>
  <input type="tel" name="phone" placeholder="Số điện thoại" required>
  <select name="service">
    <option>Chọn dịch vụ...</option>
    <!-- list services -->
  </select>
  <!-- Optional: preferred time -->
  <button type="submit">Đặt Lịch Ngay</button>
  <p class="privacy-note">🔒 Thông tin được bảo mật tuyệt đối</p>
</form>
```

**Rule:** Every form field added reduces conversion ~11%. Keep to absolute minimum.

## Color Palette for Medical Clinics

| Role | Recommended | Reason |
|------|------------|--------|
| Primary | Deep blue `#1a56db` or teal `#0e9f6e` | Trust, professionalism |
| CTA | Orange `#ff6b35` or green `#22c55e` | Stands out, action-oriented |
| Background | White `#ffffff` or light gray `#f9fafb` | Clean, clinical feel |
| Text | Dark gray `#111827` | Readable, not harsh black |
| Accent | Light blue `#e1effe` | Calm, medical |

**Avoid:** Reds (medical emergency connotation), overly bright colors (lack trust).

## Performance Rules

- Hero image: max 200KB, use WebP format
- Fonts: max 2 font families, preload critical fonts
- LCP (Largest Contentful Paint) target: < 2.5s
- CLS (Cumulative Layout Shift): < 0.1 (always set image dimensions)

```html
<!-- Always set dimensions to prevent CLS -->
<img src="hero.webp" width="1200" height="600" 
     alt="Phòng khám hiện đại" loading="eager">
```
