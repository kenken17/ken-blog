# Feature Summary: Add Chronological Order Toggle

## One-liner per story

1. **Blog Post Listing Order Toggle** — Readers can switch between oldest-first and newest-first on the main blog listing page.
   - *Acceptance:* Toggle visible, switches order, UI indicates active state, no full page reload.

2. **Tag Listing Order Toggle** — Readers can switch between oldest-first and newest-first on individual tag listing pages.
   - *Acceptance:* Toggle visible, switches order, UI indicates active state, no full page reload.

3. **Persist Sort Order Preference Across Sessions** — The chosen sort order is saved in `localStorage` and automatically restored on future visits.
   - *Acceptance:* Preference saved immediately, restored on return, shared across blog and tag pages, graceful fallback if storage is unavailable.

## Estimated scope
- 3 user stories
- 6 implementation tasks + 5 test tasks
- Reusable `OrderToggle` component + `sortPreference` storage service
- Unit test coverage target: >80% for story files
- E2E tests for each story
