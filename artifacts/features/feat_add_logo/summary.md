# Summary — feat_add_logo

| Story | One-liner | Acceptance Criteria |
|-------|-----------|---------------------|
| Story 1 | Text logo component renders "Ken's Blog" as a clickable homepage link using Barlow Condensed | Uses `font-display`, `text-foreground`, uppercase tracking; links to `/` |
| Story 2 | Logo integrated into BaseLayout header so it appears on every page | `<header>` wraps `Logo` in `BaseLayout.astro`; responsive layout; no broken layouts |
| Story 3 | Logo displays correctly on mobile and desktop viewports | Mobile: centered, `text-display-sm`; Desktop: left-aligned, `text-display-md`; no overflow |
| Story 4 | Logo has zero performance impact and is accessible | Plain text only; no new network requests; `aria-label` on link; Lighthouse scores unchanged |