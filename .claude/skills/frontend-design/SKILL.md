---
name: frontend-design
description: |
  Frontend design system principles for building consistent, high-quality web UIs.
  Covers design tokens, component selection strategy, accessibility, and semantic HTML.
  Adapted from triptease/claude-skill-design-system for general web projects.
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# Frontend Design System Skill

**When to use:** Building any customer-facing web interface.
**Not needed for:** CLI tools, backend services, data pipelines.

## Core Principles

1. **Research before implementing** — Check existing components/tokens before writing custom CSS
2. **Semantic HTML first** — Use the right HTML element before reaching for a div
3. **Design tokens over hardcoded values** — Never hardcode colors, spacing, or font sizes
4. **Accessibility is not optional** — ARIA attributes, keyboard nav, contrast ratios
5. **Progressive enhancement** — Works without JS, better with JS

## Component Selection Strategy

### Use a UI Framework Component When:
- Complex interaction (dropdown, date picker, modal, multi-select)
- Component needs encapsulated state
- Accessibility is non-trivial (focus management, ARIA live regions)

### Use Semantic HTML + CSS When:
- Simple form inputs (text, checkbox, radio, basic select)
- Static content (buttons, badges, cards, typography, tables)
- No complex state management needed

### Decision Tree
```
Need a UI element?
│
├─ Complex interaction (modal, picker, combobox)?
│  └─ YES → Use framework component
│
├─ Standard form element or button?
│  └─ YES → <input>, <button>, <select> with CSS
│
├─ Content/layout element?
│  └─ YES → Semantic HTML (<article>, <section>, <nav>) + CSS
│
└─ Custom? → Build on semantic HTML, then add design tokens
```

## Design Tokens

Always use CSS custom properties (variables) for design values:

```css
/* Colors */
--color-primary: #your-brand-color;
--color-text: #1a1a1a;
--color-surface: #ffffff;
--color-border: #e0e0e0;

/* Spacing scale (8px base) */
--space-1: 8px;
--space-2: 16px;
--space-3: 24px;
--space-4: 32px;
--space-6: 48px;
--space-8: 64px;

/* Typography */
--font-size-sm: 14px;
--font-size-base: 16px;
--font-size-lg: 18px;
--font-size-xl: 24px;
--font-size-2xl: 32px;
--font-size-3xl: 48px;

/* Border radius */
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 16px;
--radius-full: 9999px;
```

**Rule:** If a value appears more than once, it belongs in a token.

## HTML & Accessibility Best Practices

```html
<!-- Buttons — always use <button> or <a> with role -->
<button type="button" aria-label="Đặt lịch khám">Đặt lịch</button>

<!-- Forms — always pair label + input -->
<label for="phone">Số điện thoại</label>
<input id="phone" type="tel" name="phone" required
       autocomplete="tel" aria-describedby="phone-hint">
<span id="phone-hint">VD: 0912 345 678</span>

<!-- Images — always alt text -->
<img src="doctor.jpg" alt="Bác sĩ Nguyễn tư vấn bệnh nhân">

<!-- Sections — use semantic landmarks -->
<header>, <nav>, <main>, <section>, <aside>, <footer>
```

## Anti-patterns

```css
/* DON'T — hardcoded values */
.card { padding: 24px; background: #5e43c2; color: white; }

/* DO — tokens */
.card { padding: var(--space-3); background: var(--color-primary); color: var(--color-on-primary); }
```

```html
<!-- DON'T — non-semantic -->
<div class="btn" onclick="submit()">Gửi</div>

<!-- DO — semantic -->
<button type="submit">Gửi</button>
```

## Responsive Design

- Mobile-first: write base styles for mobile, add breakpoints upward
- Use relative units: `rem` for font sizes, `%` / `vw` / `vh` for layout
- Breakpoints: `480px` (mobile lg), `768px` (tablet), `1024px` (desktop), `1280px` (wide)

```css
/* Mobile first */
.hero-title { font-size: var(--font-size-2xl); }

@media (min-width: 768px) {
  .hero-title { font-size: var(--font-size-3xl); }
}
```
