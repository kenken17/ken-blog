# Feature: Add Analytics to Blog — Tasks

## Story 1: Analytics Tool Selection & Configuration

### TASK-1-1: Create analytics config module

- **File:** `src/config/analytics.ts`
- **What:** Create a typed config module exporting `analyticsConfig` with: `enabled` (boolean, derived from `import.meta.env.PROD`), `measurementId` (from `import.meta.env.PUBLIC_ANALYTICS_ID`), `domain` (from `SITE_URL` in seo config), and `trackingMode` (`'cookieless'`). Export `AnalyticsConfig` interface. Default to Plausible-compatible self-hosted or Plausible cloud (lightweight, cookieless, GDPR-compliant out of the box).
- **Done when:** Module exports typed config; `measurementId` reads from env var; `enabled` is `false` in dev; TypeScript compiles without errors.

### TASK-1-2: Add PUBLIC_ANALYTICS_ID env variable

- **File:** `.env.example` (create if missing), `astro.config.mjs` (if needed for env validation)
- **What:** Add `PUBLIC_ANALYTICS_ID` to `.env.example` with a placeholder value. Document that this is the Plausible domain or custom script domain. Ensure Astro's `import.meta.env` exposes it correctly (all `PUBLIC_` prefixed vars are client-exposed by default).
- **Done when:** `.env.example` contains the variable with a comment; `import.meta.env.PUBLIC_ANALYTICS_ID` resolves at build time.

---

## Story 2: Analytics Script Integration in BaseLayout

### TASK-2-1: Create Analytics Astro component

- **File:** `src/components/Analytics.astro`
- **What:** Create an `<Analytics />` component that conditionally renders the Plausible analytics script tag. The component should:
  - Read `analyticsConfig` from `src/config/analytics.ts`.
  - If `enabled` is `true`, render `<script defer data-domain={domain} src="https://plausible.io/js/script.js"></script>` (or self-hosted equivalent based on config).
  - If `enabled` is `false`, render nothing.
  - Include `is:inline` or appropriate Astro directive so the script tag is emitted as-is in the HTML output.
- **Done when:** Component renders script tag with correct `data-domain` and `src` in production; renders nothing in dev; TypeScript compiles.

### TASK-2-2: Integrate Analytics component into BaseLayout

- **File:** `src/layouts/BaseLayout.astro`
- **What:** Import and render `<Analytics />` in the `<head>` section of `BaseLayout.astro`, after existing meta tags and before the closing `</head>`.
- **Done when:** All pages that use `BaseLayout` include the analytics script in production builds; no script appears in dev mode; existing layout functionality unchanged.

---

## Story 3: Custom Event Tracking for User Interactions

### TASK-3-1: Create analytics event utility

- **File:** `src/utils/analytics.ts`
- **What:** Create a `trackEvent(eventName: string, props?: Record<string, string | number | boolean>)` function that:
  - Checks if `window.plausible` exists (the Plausible global).
  - If yes, calls `window.plausible(eventName, { props })`.
  - If no (dev mode, ad blocker, consent declined), silently no-ops.
  - Export `trackEvent` and a `declare global { interface Window { plausible?: ... } }` type declaration.
- **Done when:** Function is exported; no-ops gracefully when `plausible` is unavailable; TypeScript compiles.

### TASK-3-2: Add event tracking to SearchBar

- **File:** `src/components/SearchBar.astro`
- **What:** In the SearchBar's client-side script, import `trackEvent` from `src/utils/analytics.ts` and call `trackEvent('search', { query: searchTerm })` when the user submits a search.
- **Done when:** Search submissions fire a `search` event with the query string; no errors in console; existing search functionality unchanged.

### TASK-3-3: Add event tracking to LikeButton

- **File:** `src/components/LikeButton.astro`
- **What:** In the LikeButton's click handler, import `trackEvent` and call `trackEvent('like_click', { slug })` when the user clicks the like button.
- **Done when:** Like button clicks fire a `like_click` event with the post slug; existing like button behavior (scroll to Giscus) unchanged.

### TASK-3-4: Add event tracking to ThemeToggle

- **File:** `src/components/ThemeToggle.astro`
- **What:** In the ThemeToggle's toggle handler, import `trackEvent` and call `trackEvent('theme_toggle', { theme: newTheme })` when the user toggles the theme.
- **Done when:** Theme toggles fire a `theme_toggle` event with the new theme value (`'dark'` or `'light'`); existing theme toggle behavior unchanged.

### TASK-3-5: Add outbound link tracking to SocialLinks

- **File:** `src/components/SocialLinks.astro`
- **What:** In the SocialLinks component, add click event listeners on external `<a>` tags that call `trackEvent('outbound_click', { url: href, label: linkText })` before navigation proceeds.
- **Done when:** Clicks on social/external links fire an `outbound_click` event with the URL and link text; navigation is not blocked.

---

## Story 4: Privacy Compliance & Cookie Consent

### TASK-4-1: Create consent utility

- **File:** `src/utils/consent.ts`
- **What:** Create a consent utility module with:
  - `getConsent(): 'accepted' | 'declined' | null` — reads from `localStorage` key `analytics_consent`.
  - `setConsent(choice: 'accepted' | 'declined'): void` — writes to `localStorage` and dispatches a `consent:change` custom event on `window`.
  - `hasConsented(): boolean` — returns `true` only if consent is `'accepted'`.
  - Wrap `localStorage` access in try/catch (private browsing may throw).
- **Done when:** Module exports all three functions; `getConsent` returns `null` on first visit; `setConsent` persists and dispatches event; TypeScript compiles.

### TASK-4-2: Create CookieConsent Astro component

- **File:** `src/components/CookieConsent.astro`
- **What:** Create a `<CookieConsent />` component that:
  - Renders a fixed-position banner at the bottom of the viewport.
  - Shows a message: "This site uses privacy-friendly analytics to understand how visitors interact with the blog."
  - Includes "Accept" and "Decline" buttons.
  - Links to the privacy policy (or a `#privacy` anchor if no dedicated page exists).
  - Uses vanilla JS (Astro `<script>` tag) to:
    - Check `getConsent()` on load — if not `null`, hide the banner.
    - On "Accept": call `setConsent('accepted')`, hide banner, load analytics script dynamically.
    - On "Decline": call `setConsent('declined')`, hide banner, ensure analytics is not loaded.
  - Styled with Tailwind CSS matching the blog's design system (uses CSS custom properties for colors).
- **Done when:** Banner appears on first visit; clicking Accept/Decline persists choice and hides banner; subsequent visits respect the stored choice; styling matches blog theme.

### TASK-4-3: Integrate consent into Analytics component

- **File:** `src/components/Analytics.astro`
- **What:** Update the `<Analytics />` component to respect consent:
  - If `hasConsented()` is `true`, render the script immediately.
  - If consent is `null` or `false`, do not render the script tag.
  - Add a `consent:change` event listener that dynamically injects the script when consent is granted after initial page load.
- **Done when:** Analytics script only loads after user consents; dynamic injection works when consent is granted mid-session; no script loads if consent is declined.

### TASK-4-4: Integrate CookieConsent into BaseLayout

- **File:** `src/layouts/BaseLayout.astro`
- **What:** Import and render `<CookieConsent />` at the end of `<body>` in `BaseLayout.astro`, after existing content.
- **Done when:** Consent banner appears on all pages on first visit; does not appear on subsequent visits after user choice is stored; layout is not disrupted.

---

## Story 5: Analytics Verification & Testing

### TASK-5-1: Write unit tests for analytics config

- **File:** `tests/features/analytics/story-1.test.ts`
- **What:** Test `src/config/analytics.ts`:
  - Config exports correct shape and types.
  - `enabled` is `false` when `import.meta.env.PROD` is `false`.
  - `measurementId` reads from `import.meta.env.PUBLIC_ANALYTICS_ID`.
  - `domain` matches `SITE_URL`.
- **Done when:** All assertions pass; coverage > 80% for `src/config/analytics.ts`.

### TASK-5-2: Write unit tests for analytics event utility

- **File:** `tests/features/analytics/story-3.test.ts`
- **What:** Test `src/utils/analytics.ts`:
  - `trackEvent` calls `window.plausible` when available.
  - `trackEvent` no-ops when `window.plausible` is undefined.
  - `trackEvent` passes correct event name and props.
  - `trackEvent` handles missing props gracefully.
- **Done when:** All assertions pass; coverage > 80% for `src/utils/analytics.ts`.

### TASK-5-3: Write unit tests for consent utility

- **File:** `tests/features/analytics/story-4.test.ts`
- **What:** Test `src/utils/consent.ts`:
  - `getConsent()` returns `null` when no stored value.
  - `setConsent('accepted')` persists and `getConsent()` returns `'accepted'`.
  - `setConsent('declined')` persists and `getConsent()` returns `'declined'`.
  - `hasConsented()` returns `true` only for `'accepted'`.
  - `localStorage` errors are caught gracefully.
  - `consent:change` event is dispatched on `setConsent`.
- **Done when:** All assertions pass; coverage > 80% for `src/utils/consent.ts`.

### TASK-5-4: Write integration tests for Analytics and CookieConsent components

- **File:** `tests/features/analytics/story-2.test.ts`
- **What:** Test that:
  - `<Analytics />` renders the script tag with correct `data-domain` and `src` when `enabled` is `true`.
  - `<Analytics />` renders nothing when `enabled` is `false`.
  - `<CookieConsent />` renders the banner with Accept/Decline buttons.
  - Clicking Accept stores consent and triggers analytics load.
  - Clicking Decline stores consent and prevents analytics load.
- **Done when:** All assertions pass; component rendering verified.

### TASK-5-5: Write integration tests for custom event tracking

- **File:** `tests/features/analytics/story-5.test.ts`
- **What:** Test that:
  - SearchBar fires `search` event with `query` prop.
  - LikeButton fires `like_click` event with `slug` prop.
  - ThemeToggle fires `theme_toggle` event with `theme` prop.
  - SocialLinks fires `outbound_click` event with `url` and `label` props.
  - All events no-op when `window.plausible` is undefined.
- **Done when:** All assertions pass; event tracking verified for all four components.

### TASK-5-6: Run full test suite and verify no regressions

- **File:** N/A (CI command)
- **What:** Run `npm run test` and `npm run typecheck` to ensure all existing tests pass and no type errors are introduced.
- **Done when:** All tests pass; `astro check` exits 0; no type errors.