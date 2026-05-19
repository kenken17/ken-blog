# Feature: Add Analytics to Blog — Summary

| Story | One-liner | Acceptance criteria |
|-------|-----------|---------------------|
| S1: Analytics Tool Selection & Configuration | Select and configure a privacy-friendly analytics tool (Plausible) with typed config module | Config in `src/config/analytics.ts`; measurement ID from env var; disabled in dev mode; cookieless tracking |
| S2: Analytics Script Integration in BaseLayout | Render analytics script in `<head>` via `<Analytics />` component, production-only | Script loads async with `data-domain`; omitted in dev; no duplicate tracking code |
| S3: Custom Event Tracking for User Interactions | Track search, likes, theme toggles, and outbound clicks as custom events | `trackEvent()` utility in `src/utils/analytics.ts`; events fired from SearchBar, LikeButton, ThemeToggle, SocialLinks; graceful no-op when analytics unavailable |
| S4: Privacy Compliance & Cookie Consent | GDPR-compliant consent banner with Accept/Decline, persisted choice, and conditional script loading | Consent utility in `src/utils/consent.ts`; banner component; analytics only loads after consent; choice persisted in localStorage |
| S5: Analytics Verification & Testing | Unit and integration tests covering config, events, consent, and component rendering | >80% coverage on analytics/consent modules; component rendering tests; event tracking tests for all four interactive components; no regressions in existing tests |