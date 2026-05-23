# Workflow: Tạo Landing Page Phòng Khám Nam Khoa

## Mô tả
Quy trình từng bước để tạo landing page chuyển đổi cao cho phòng khám nam khoa (hoặc phòng khám chuyên khoa tương tự). Workflow này có thể tái sử dụng cho nhiều phòng khám khác nhau.

---

## Phase 0 — Thu thập thông tin (Bắt buộc trước khi code)

**Thời gian ước tính:** 30-60 phút

Trả lời đầy đủ các câu hỏi sau trước khi bắt đầu thiết kế:

### Về phòng khám
- [ ] Tên phòng khám chính thức
- [ ] Số giấy phép hoạt động (Bộ Y Tế)
- [ ] Địa chỉ đầy đủ (để nhúng Google Maps)
- [ ] Số điện thoại hotline
- [ ] Email liên hệ
- [ ] Giờ làm việc

### Về dịch vụ
- [ ] Danh sách dịch vụ chính (tối đa 6 cho landing page)
- [ ] Dịch vụ "flagship" (đặt lên đầu, CTA chính)
- [ ] Giá cả có hiển thị không? (nếu có, cần dải giá)
- [ ] Có khám online / tư vấn từ xa không?

### Về đội ngũ
- [ ] Tên + bằng cấp của bác sĩ chính (để Trust section)
- [ ] Số năm kinh nghiệm
- [ ] Ảnh headshot bác sĩ (professional)

### Về target audience
- [ ] Nhóm tuổi chính
- [ ] Vấn đề sức khỏe phổ biến nhất họ đến khám
- [ ] Nỗi lo ngại chính khi chọn phòng khám (thường: bảo mật, chi phí, trình độ)

### Về nội dung
- [ ] Logo (SVG/PNG)
- [ ] Màu thương hiệu (primary, secondary)
- [ ] Ảnh phòng khám / cơ sở vật chất (3-5 ảnh)
- [ ] Testimonials từ bệnh nhân (ẩn danh, có consent)
- [ ] Chứng nhận / giải thưởng (nếu có)

---

## Phase 1 — Thiết lập dự án

```bash
# Tạo cấu trúc thư mục
mkdir -p src/{css,js,images,fonts}
mkdir -p src/images/{doctors,clinic,icons}

# File chính
touch index.html
touch src/css/tokens.css
touch src/css/main.css
touch src/js/main.js
```

### Checklist Phase 1
- [ ] Cấu trúc thư mục tạo xong
- [ ] CSS tokens file tạo xong (màu, spacing, typography từ brand)
- [ ] Tất cả assets (ảnh, logo) đã có đủ

---

## Phase 2 — Design Tokens & Base CSS

**Trigger skill:** `/frontend-design`

Tạo `src/css/tokens.css` với brand colors của phòng khám:

```css
:root {
  /* Brand — thay bằng màu thực tế của phòng khám */
  --color-primary: #1a56db;        /* Deep blue — tin tưởng, y tế */
  --color-primary-dark: #1e429f;
  --color-primary-light: #e1effe;
  --color-cta: #ff6b35;            /* Orange — action, nổi bật */
  --color-cta-dark: #e65a25;

  /* Neutrals */
  --color-text: #111827;
  --color-text-muted: #6b7280;
  --color-surface: #ffffff;
  --color-surface-alt: #f9fafb;
  --color-border: #e5e7eb;

  /* Spacing (8px base) */
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 32px;
  --space-6: 48px;
  --space-8: 64px;
  --space-12: 96px;
  --space-16: 128px;

  /* Typography */
  --font-sans: 'Be Vietnam Pro', system-ui, sans-serif;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 24px;
  --font-size-2xl: 32px;
  --font-size-3xl: 48px;
  --font-size-4xl: 64px;

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.1);
  --shadow-md: 0 4px 16px rgba(0,0,0,0.1);
  --shadow-lg: 0 8px 32px rgba(0,0,0,0.15);
}
```

### Checklist Phase 2
- [ ] tokens.css hoàn thành với brand colors thực tế
- [ ] Typography tokens đúng font phòng khám
- [ ] CTA color đủ contrast với background

---

## Phase 3 — HTML Structure (10 Sections)

**Trigger skill:** `/landing-page-design`

Tạo `index.html` theo đúng thứ tự sections:

```
1. <header>     — Navigation + logo + phone CTA
2. <section#hero>      — H1, sub-headline, primary CTA
3. <section#problem>   — Pain points bệnh nhân
4. <section#solution>  — Cách phòng khám giải quyết
5. <section#trust>     — Credentials, giấy phép, số liệu
6. <section#services>  — Danh sách dịch vụ (3-6 cards)
7. <section#testimonials> — Testimonials ẩn danh
8. <section#process>   — Quy trình khám (3-4 bước)
9. <section#faq>       — Câu hỏi thường gặp
10. <section#cta-final> — CTA lần 2 + form đặt lịch
<footer>         — Contact, địa chỉ, Google Maps, legal
```

### HTML Checklist
- [ ] `<header>` có logo + hotline + nút "Đặt lịch" trên mobile
- [ ] `<section#hero>` có H1 rõ ràng + CTA primary + 3 trust icons
- [ ] `<form>` trong section#cta-final: tối đa 4 fields
- [ ] Mọi `<img>` có `alt` text
- [ ] `<meta name="description">` mô tả phòng khám rõ ràng
- [ ] Privacy notice dưới form: "Thông tin bảo mật tuyệt đối"

---

## Phase 4 — Styling (Mobile-First)

**Thứ tự viết CSS:**

```
1. Reset / base styles
2. Typography utilities
3. Layout (container, grid, flex)
4. Components: button, card, badge, form
5. Sections: hero, trust, services, testimonials, process, faq
6. Navigation + footer
7. Responsive breakpoints (768px, 1024px)
8. Animations (nhẹ, không gây distraction)
```

### Critical CSS Rules
```css
/* Hero CTA — phải nổi bật nhất trang */
.btn-primary {
  background: var(--color-cta);
  color: white;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-full);
  font-size: var(--font-size-lg);
  font-weight: 700;
  border: none;
  cursor: pointer;
}

/* Privacy badge — luôn hiển thị dưới form */
.privacy-badge {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  margin-top: var(--space-1);
}
```

### Checklist Phase 4
- [ ] Mobile layout đẹp (test ở 375px)
- [ ] CTA button contrast ≥ 3:1
- [ ] Form fields có label visible (không chỉ placeholder)
- [ ] Images có `width` và `height` để tránh CLS

---

## Phase 5 — JavaScript (Minimal)

Chỉ thêm JS khi thực sự cần:

```javascript
// Smooth scroll cho navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href'))
      .scrollIntoView({ behavior: 'smooth' });
  });
});

// Form submission
document.getElementById('booking-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  // Gửi data đến backend / form service
  const data = Object.fromEntries(new FormData(e.target));
  // TODO: implement form handler
  console.log('Booking:', data);
});

// Sticky header on scroll
window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  header.classList.toggle('scrolled', window.scrollY > 50);
});
```

### Checklist Phase 5
- [ ] Form submit handler hoạt động
- [ ] Không có JS errors trong console
- [ ] Page hoạt động nếu JS bị disabled

---

## Phase 6 — SEO & Performance

```html
<!-- Trong <head> -->
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Phòng Khám [Tên] — Nam Khoa Uy Tín tại [Thành phố]</title>
<meta name="description" content="[Tên phòng khám] — chuyên khám và điều trị [dịch vụ]. Bảo mật tuyệt đối. Bác sĩ chuyên khoa [X] năm kinh nghiệm. Đặt lịch ngay.">

<!-- Open Graph (chia sẻ Facebook/Zalo) -->
<meta property="og:title" content="Phòng Khám [Tên]">
<meta property="og:description" content="...">
<meta property="og:image" content="og-image.jpg">

<!-- Preload critical resources -->
<link rel="preload" href="src/fonts/BeVietnamPro.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="src/images/hero.webp" as="image">
```

### Checklist Phase 6
- [ ] Title tag có keyword địa phương
- [ ] Meta description 150-160 ký tự
- [ ] Hero image WebP format, < 200KB
- [ ] Google Maps nhúng trong footer
- [ ] Schema.org MedicalClinic markup thêm

---

## Phase 7 — Kiểm tra trước launch

### Conversion Audit
- [ ] CTA visible without scrolling trên mobile (375px)
- [ ] Hotline phone number clickable (`tel:` link) trên mobile
- [ ] Form có tối đa 4 fields
- [ ] Privacy statement visible dưới form
- [ ] Trust signals (giấy phép, năm kinh nghiệm) trong hero hoặc dưới hero

### Technical Audit
```bash
# Check image sizes
find src/images -name "*.jpg" -o -name "*.png" | xargs du -sh | sort -rh | head -10

# Check for missing alt tags
grep -n '<img' index.html | grep -v 'alt='
```

### Accessibility Audit
- [ ] Tất cả form fields có `<label>`
- [ ] Tất cả buttons có text hoặc `aria-label`
- [ ] Color contrast pass WCAG AA (dùng https://webaim.org/resources/contrastchecker/)
- [ ] Page navigable bằng keyboard

### Performance Targets
| Metric | Target |
|--------|--------|
| LCP | < 2.5s |
| CLS | < 0.1 |
| Total page size | < 1MB |
| Time to interactive | < 3s |

---

## Tái sử dụng cho phòng khám khác

Để tạo landing page cho phòng khám thứ 2, chỉ cần:

1. Copy toàn bộ project
2. Chạy lại Phase 0 (thu thập thông tin mới)
3. Cập nhật `tokens.css` với brand colors mới
4. Thay thế nội dung (text, images, services)
5. **Không cần** viết lại HTML structure hoặc CSS components

**Thời gian ước tính cho lần 2:** 2-4 giờ (so với 1-2 ngày cho lần đầu)
