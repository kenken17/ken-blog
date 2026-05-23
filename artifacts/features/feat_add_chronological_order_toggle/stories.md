# User Stories: Chronological Order Toggle

## Story 1 — Blog Post Listing Order Toggle

As a blog reader, I want to toggle between chronological and reverse-chronological order on the blog post listing page so that I can view posts in my preferred sequence.

### Acceptance Criteria
- A toggle button is visible on the blog post listing page.
- Clicking the toggle switches the list between oldest-first (chronological) and newest-first (reverse chronological).
- The currently active sort order is clearly indicated in the UI (e.g., active icon, label, or highlight).
- The page updates without a full reload (client-side re-sort).
- The default order remains reverse chronological (newest first) when no preference is stored.

## Story 2 — Tag Listing Order Toggle

As a blog reader, I want to toggle between chronological and reverse-chronological order on the tag listing page so that I can view posts for a specific tag in my preferred sequence.

### Acceptance Criteria
- A toggle button is visible on the tag listing page.
- Clicking the toggle switches the list between oldest-first and newest-first.
- The currently active sort order is clearly indicated in the UI.
- The page updates without a full reload (client-side re-sort).
- The default order remains reverse chronological when no preference is stored.

## Story 3 — Persist Sort Order Preference Across Sessions

As a blog reader, I want my preferred sort order to be remembered across browser sessions so that I do not have to re-select it each time I visit the site.

### Acceptance Criteria
- The selected sort order is saved to `localStorage` (or cookies) immediately upon change.
- When the user returns to the blog post listing or tag listing page, the previously saved sort order is applied automatically.
- The saved preference is shared across both the blog post listing and tag listing pages (a single global preference).
- If `localStorage` is unavailable, the feature gracefully falls back to the default order without errors.
- The stored preference does not contain personally identifiable information and is scoped to the site origin.
