# Feature: Add Analytics to Blog — User Stories

## Story 1: Analytics Tool Selection & Configuration

**As a** blog owner,
**I want** to select and configure a privacy-friendly analytics tool that integrates with my Astro/TypeScript stack,
**so that** I can track page views and user interactions without impacting site performance or violating privacy regulations.

Acceptance criteria:

- An analytics tool is selected that is compatible with Astro's static output mode and does not require a server-side runtime.
- The selected tool supports cookieless/privacy-first tracking (no personal data collected, GDPR-compliant by default).
- The tool's script loads asynchronously and does not block page rendering (no measurable impact on Lighthouse performance score).
- Configuration is centralized in a dedicated config module (`src/config/analytics.ts`) with typed interfaces.
- The measurement ID is loaded from an environment variable, not hardcoded.

---

## Story 2: Analytics Script Integration in BaseLayout

**As a** blog reader,
**I want** the analytics tracking script to load unobtrusively in the background,
**so that** my browsing experience is not affected while the blog owner gains insights.

Acceptance criteria:

- The analytics script is injected into `<head>` in `BaseLayout.astro` via a dedicated `<Analytics>` component.
- The script loads with `async` attribute to prevent render-blocking.
- A `data-domain` attribute (or equivalent) is set to the site's domain from config.
- The script is only included in production builds (excluded in `dev` mode via environment check).
- No inline tracking code is duplicated — all tracking logic is encapsulated in the component.

---

## Story 3: Custom Event Tracking for User Interactions

**As a** blog owner,
**I want** to track key user interactions beyond page views (search queries, like-button clicks, theme toggles, external link clicks),
**so that** I can understand how readers engage with the blog's interactive features.

Acceptance criteria:

- A `trackEvent(eventName, props?)` utility is created in `src/utils/analytics.ts` that wraps the analytics tool's event API.
- The following custom events are tracked:
  - `search` — fired when the user submits a search query (from `SearchBar`).
  - `like_click` — fired when the user clicks the like button (from `LikeButton`).
  - `theme_toggle` — fired when the user toggles dark/light mode (from `ThemeToggle`).
  - `outbound_click` — fired when the user clicks an external link (from `SocialLinks`).
- Each event includes relevant properties (e.g., `search` includes `query`, `like_click` includes `slug`).
- The utility gracefully no-ops if the analytics script hasn't loaded (e.g., in dev mode or if blocked by an ad blocker).

---

## Story 4: Privacy Compliance & Cookie Consent

**As a** blog reader visiting from the EU or other privacy-regulated regions,
**I want** to be informed about analytics tracking and given the choice to opt out,
**so that** my privacy rights are respected under GDPR and similar regulations.

Acceptance criteria:

- A lightweight cookie consent banner is displayed on first visit, informing users about analytics tracking.
- The banner includes "Accept" and "Decline" options.
- If the user declines, the analytics script is not loaded and no tracking occurs.
- The user's choice is persisted in `localStorage` and respected on subsequent visits.
- A privacy policy page or section is linked from the consent banner.
- The consent state is accessible via a utility function (`src/utils/consent.ts`) that other modules can query.

---

## Story 5: Analytics Verification & Testing

**As a** blog owner,
**I want** to verify that analytics tracking works correctly across all page types and interactive features,
**so that** I can trust the data being collected.

Acceptance criteria:

- Unit tests cover `src/config/analytics.ts`, `src/utils/analytics.ts`, and `src/utils/consent.ts` with >80% coverage.
- An integration test verifies that the `<Analytics>` component renders the script tag with correct attributes in production mode and omits it in development.
- An integration test verifies that the consent banner appears on first visit and stores the user's choice.
- Custom event tracking is tested: each interactive component (`SearchBar`, `LikeButton`, `ThemeToggle`, `SocialLinks`) fires the correct event with correct properties.
- All existing tests continue to pass with no regressions.