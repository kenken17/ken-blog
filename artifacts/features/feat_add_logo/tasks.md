# Task List — feat_add_logo

## TASK-1-1: Create Logo.astro component

- **File:** `src/components/Logo.astro`
- **What:** Create a new Astro component that renders "KEN'S BLOG" as a text logo
- **Details:**
  - Use `<a href="/">` wrapper with `aria-label="Ken's Blog home"`
  - Apply `font-display text-display-sm md:text-display-md text-foreground uppercase tracking-[0.3em]` classes
  - Use `font-semibold` or `font-bold` weight consistent with display typography
  - Add `hover:text-foreground-secondary transition-colors duration-200` for interactivity
  - No image assets — pure text only
- **Done when:** Component renders "KEN'S BLOG" as a clickable homepage link with correct typography

## TASK-2-1: Add header with logo to BaseLayout.astro

- **File:** `src/layouts/BaseLayout.astro`
- **What:** Add a `<header>` element containing the `Logo` component above the `<slot />`
- **Details:**
  - Import `Logo` from `../components/Logo.astro`
  - Add `<header>` between `<body>` opening and `<slot />`
  - Header should use `max-w-3xl mx-auto px-6 py-8` to match existing content width
  - Ensure the header is a landmark element (`<header>`) for accessibility
- **Done when:** Logo appears on all pages (index, blog listing, blog post) inside a semantic header

## TASK-3-1: Verify responsive behavior across viewports

- **File:** No new file — manual verification
- **What:** Confirm the logo renders correctly on mobile and desktop
- **Details:**
  - Run `npm run dev` and check at 320px, 768px, 1024px, 1440px widths
  - Verify no horizontal overflow on any viewport
  - Verify logo text does not truncate or wrap awkwardly
  - Verify vertical spacing between logo and page content is consistent
- **Done when:** Logo displays correctly at all standard breakpoints with no layout issues

## TASK-4-1: Run Lighthouse audit and verify no performance regression

- **File:** No new file — manual verification
- **What:** Run Lighthouse audit before and after to confirm no performance or accessibility regression
- **Details:**
  - Build the site with `npm run build`
  - Run Lighthouse on the blog post page before and after changes
  - Verify Performance score does not decrease
  - Verify Accessibility score does not decrease
  - Confirm no new network requests are introduced
- **Done when:** Lighthouse scores are equal or better than baseline; no new network requests