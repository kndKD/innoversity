# Innoversity — Design System

> Sri Lanka's Verified Innovation Marketplace

---

## Brand Identity

**Tagline:** "Sell your innovation. Trusted by Sri Lanka."

**Mission:** A trust-first marketplace connecting Sri Lankan student innovators and SMEs with buyers — secured through institutional verification, escrow payments, and transparent delivery.

---

## Color Palette

| Token | Value | Usage |
|---|---|---|
| `--color-primary` | `#4F46E5` (Indigo 600) | CTAs, active states, links |
| `--color-primary-light` | `#6366F1` (Indigo 500) | Hover states, gradients |
| `--color-primary-dark` | `#3730A3` (Indigo 800) | Pressed states |
| `--color-surface` | `#FFFFFF` | Page background, cards |
| `--color-surface-alt` | `#F8F7FF` | Subtle section backgrounds |
| `--color-dark` | `#080911` | Footer, featured section, dark cards |
| `--color-dark-card` | `#0F1120` | Dark surface cards |
| `--color-dark-border` | `#1E2240` | Borders on dark surfaces |
| `--color-verified` | `#059669` (Emerald 600) | Verified badges, trust indicators |
| `--color-verified-bg` | `#D1FAE5` | Verified badge backgrounds |
| `--color-escrow` | `#D97706` (Amber 600) | Escrow timers, pending states |
| `--color-escrow-bg` | `#FEF3C7` | Escrow badge backgrounds |
| `--color-text-primary` | `#0A0A14` | Primary text on light surfaces |
| `--color-text-secondary` | `#6B7280` | Subtitles, metadata |
| `--color-text-muted` | `#9CA3AF` | Placeholders, timestamps |
| `--color-border` | `#E5E7EB` | Card borders, dividers |
| `--color-border-focus` | `#6366F1` | Input focus rings |

---

## Typography

**Font Family:** Inter (Google Fonts) — weights 400, 500, 600, 700, 800

| Scale | Class | Size | Weight | Usage |
|---|---|---|---|---|
| Display | `text-5xl` / `text-6xl` | 48–60px | 800 | Hero headlines |
| H1 | `text-4xl` | 36px | 700 | Page titles |
| H2 | `text-2xl`/`text-3xl` | 24–30px | 700 | Section headings |
| H3 | `text-xl` | 20px | 600 | Card titles |
| Body Large | `text-lg` | 18px | 400 | Hero subtitles |
| Body | `text-base` | 16px | 400 | Body copy |
| Small | `text-sm` | 14px | 400/500 | Meta, badges, tags |
| XSmall | `text-xs` | 12px | 500 | Timestamps, chips |

---

## Spacing Scale

Uses Tailwind's default 4px base spacing scale.

| Token | Value | Usage |
|---|---|---|
| `space-section` | `96px` (py-24) | Between major page sections |
| `space-container` | `1280px max-w-7xl` | Main content container width |
| `space-card-gap` | `24px` (gap-6) | Card grid gutters |

---

## Components

### Navbar
- Sticky top, `bg-white/85 backdrop-blur-md` glass effect
- Logo: "Innoversity" with gradient text
- Desktop: logo + nav links + CTA buttons
- Mobile: bottom navigation bar with 5 icon tabs
- Height: 64px desktop, 56px mobile

### Product Card
- White background, `rounded-2xl`, subtle border + shadow
- Top: category chip, escrow safe indicator (amber), district tag
- Image placeholder with gradient
- Title (H3), Story snippet (2 lines truncated)
- Verified badge (emerald, with institution name)
- Price in `Rs.` currency
- Hover: translate-y lift + shadow intensify

### Verified Badge
- `bg-emerald-50 text-emerald-700 border border-emerald-200`
- Shield-check icon (lucide-react)
- Formats: "✓ University of Moratuwa (ITUM)" etc.

### Escrow Indicator
- Amber pill: "🔒 Escrow Safe"
- Timer format: "Released in 14 days"

### Category Pills
- Outline style default, filled-primary on active
- Horizontal scroll on mobile

### Search Bar
- Full-width on mobile, max-w-2xl centered on desktop
- Left icon, right submit button
- `border-2 border-border focus-within:border-primary`

---

## Layout Grid

| Breakpoint | Columns | Container Padding |
|---|---|---|
| Mobile (390px) | 1 col | px-4 |
| Tablet (768px) | 2 col | px-6 |
| Desktop (1280px+) | 3/4 col | px-8 |
| Max-width | — | max-w-7xl mx-auto |

---

## Sections — Page 1 (Home)

1. **Navbar** — sticky glass header + mobile bottom nav
2. **Hero** — split layout: left copy + CTA, right FocusFlow card (dark)
3. **Trust Bar** — verified institution logos/names row
4. **Search & Filter** — search bar + category pills
5. **Featured Innovations** — 3x2 product card grid
6. **Feature Pillars** — 4-column "Built for trust" cards
7. **Community Stats** — dark section with 4 stat counters
8. **CTA Banner** — violet gradient, centered call to action
9. **Footer** — dark background, 4-column links + social

---

## Verifier Institutions (Approved List)

- University of Moratuwa (ITUM)
- University of Colombo
- SLIIT
- NSBM Green University
- BR Verified SMEs

> WARNING: Never use "Central Bank Verified" anywhere in the codebase.

---

## Currency

Always display as `Rs. X,XXX` or `LKR X,XXX` — never as `$`, `USD`, or any other currency.

---

## Motion & Animations

| Element | Animation |
|---|---|
| Product cards | `hover:-translate-y-1` + shadow on hover |
| Category pills | Color fill transition 200ms |
| Navbar | Scroll shadow appears after 20px |
| Hero CTA button | Slight scale on hover + glow |
| Stats counter | Count-up on scroll into view |
| Page load | Staggered fade-in from below |

---

## Accessibility

- Minimum contrast ratio 4.5:1 for text
- Focus rings on all interactive elements
- `aria-label` on icon-only buttons
- Semantic HTML: nav, main, section, article, footer
- Single h1 per page, logical heading hierarchy
