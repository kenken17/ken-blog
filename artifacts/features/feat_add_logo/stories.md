# User Stories — feat_add_logo

## Story 1: Text Logo Component

**As a** blog visitor,
**I want** to see a "Ken's Blog" text logo at the top of every page,
**so that** I can immediately identify the site and its brand.

### Acceptance Criteria

- A `Logo.astro` component renders the text "Ken's Blog" using the Barlow Condensed display font
- The logo uses the existing `font-display` Tailwind class and `text-foreground` color
- The logo text is styled with uppercase tracking consistent with the Swiss Modernism 2.0 design system
- The logo is a clickable link that navigates to the homepage (`/`)

---

## Story 2: Logo Integration into Base Layout

**As a** developer,
**I want** the logo component integrated into the BaseLayout,
**so that** it appears consistently on every page without duplicating markup.

### Acceptance Criteria

- `Logo.astro` is imported and rendered inside `BaseLayout.astro`
- A semantic `<header>` element wraps the logo in the layout
- The header is responsive: centered on mobile, left-aligned on desktop
- The header does not break existing page layouts (index, blog listing, blog post)
- The logo appears above the `<main>` content slot on all pages

---

## Story 3: Responsive Logo Display

**As a** mobile user,
**I want** the logo to display correctly on any screen size,
**so that** the brand is visible and readable regardless of my device.

### Acceptance Criteria

- On mobile (< 768px): logo is centered and uses `text-display-sm` (3rem)
- On desktop (≥ 768px): logo is left-aligned and uses `text-display-md` (4.5rem)
- The logo does not overflow or truncate on any viewport width (320px–2560px)
- No horizontal scroll is introduced by the logo
- The logo maintains proper vertical rhythm with the page content below it

---

## Story 4: Performance and Accessibility

**As a** site owner,
**I want** the logo to have zero measurable impact on page load time and be accessible,
**so that** user experience and SEO are not degraded.

### Acceptance Criteria

- Logo is plain text (no image file), so file size is negligible (< 1KB rendered)
- No additional network requests are introduced (fonts already loaded by BaseLayout)
- The logo link has an `aria-label` of "Ken's Blog home" for screen readers
- Lighthouse Performance score does not decrease after implementation
- Lighthouse Accessibility score does not decrease after implementation