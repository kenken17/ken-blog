# Engineering Tasks: Chronological Order Toggle

## Story 1 — Blog Post Listing Order Toggle

### TASK-1-1: Add sort order parameter to blog post listing data fetch
- **File to touch:** Frontend data fetching / API client for blog posts (e.g., `lib/posts.ts`, `api/posts.ts`, or equivalent)
- **What to change:** Add an optional `sortOrder` parameter (`"asc" | "desc"`) to the blog post listing query. Ensure the API/backend or client-side sort respects this parameter.
- **Definition of done:** Blog post listing fetch accepts and applies a sort order parameter; existing default behavior is unchanged when parameter is omitted.

### TASK-1-2: Implement OrderToggle UI component
- **File to touch:** `components/OrderToggle.tsx` (new file)
- **What to change:** Create a reusable toggle button component that shows two states (chronological / reverse chronological) with clear icons or labels. Include accessibility attributes (`aria-pressed`, `aria-label`).
- **Definition of done:** Component renders correctly in both states, is accessible, and accepts `currentOrder` and `onToggle` props.

### TASK-1-3: Integrate OrderToggle into blog post listing page
- **File to touch:** Page component for blog post listing (e.g., `app/blog/page.tsx`, `pages/blog/index.tsx`, or equivalent)
- **What to change:** Import and render `<OrderToggle />` above or beside the post list. Wire `onToggle` to update local state and re-fetch or re-sort the post list. Pass the current order to the toggle.
- **Definition of done:** Toggle appears on the blog post listing page and switching it re-orders the visible posts.

### TASK-1-TEST-1: Unit tests for sort order logic
- **File:** `tests/features/feat_add_chronological_order_toggle/story-1.test.ts`
- **What to test:** Sort helper / data fetch correctly orders posts ascending and descending.
- **Acceptance:** All assertions pass; coverage for sort logic >80%.

### TASK-1-TEST-2: E2E tests for blog post listing toggle
- **File:** `e2e/features/feat_add_chronological_order_toggle/story-1.spec.ts`
- **What to test:** Toggle is visible; clicking it reverses post order; UI reflects active state.
- **Acceptance:** All Playwright/Cypress assertions pass.

---

## Story 2 — Tag Listing Order Toggle

### TASK-2-1: Add sort order parameter to tag listing data fetch
- **File to touch:** Frontend data fetching / API client for tag posts (e.g., `lib/tags.ts`, `api/tags.ts`, or equivalent)
- **What to change:** Add an optional `sortOrder` parameter (`"asc" | "desc"`) to the tag post listing query. Ensure the API/backend or client-side sort respects this parameter.
- **Definition of done:** Tag post listing fetch accepts and applies a sort order parameter; existing default behavior is unchanged when parameter is omitted.

### TASK-2-2: Integrate OrderToggle into tag listing page
- **File to touch:** Page component for tag listing (e.g., `app/tags/[slug]/page.tsx`, `pages/tags/[slug].tsx`, or equivalent)
- **What to change:** Import and render `<OrderToggle />` above or beside the post list. Wire `onToggle` to update local state and re-fetch or re-sort the tag post list. Pass the current order to the toggle.
- **Definition of done:** Toggle appears on the tag listing page and switching it re-orders the visible posts.

### TASK-2-TEST-1: Unit tests for tag sort order logic
- **File:** `tests/features/feat_add_chronological_order_toggle/story-2.test.ts`
- **What to test:** Sort helper / data fetch correctly orders tag posts ascending and descending.
- **Acceptance:** All assertions pass; coverage for sort logic >80%.

### TASK-2-TEST-2: E2E tests for tag listing toggle
- **File:** `e2e/features/feat_add_chronological_order_toggle/story-2.spec.ts`
- **What to test:** Toggle is visible on tag page; clicking it reverses post order; UI reflects active state.
- **Acceptance:** All Playwright/Cypress assertions pass.

---

## Story 3 — Persist Sort Order Preference Across Sessions

### TASK-3-1: Implement sort order storage service
- **File to touch:** `lib/sortPreference.ts` (new file)
- **What to change:** Create a small module with `getSortPreference(): "asc" | "desc"` and `setSortPreference(order: "asc" | "desc")` that reads from and writes to `localStorage`. Wrap access in `try/catch` to handle disabled storage gracefully. Use a clear key such as `blog:sort-order`.
- **Definition of done:** Preference is saved to `localStorage` on write and returned on read; falls back to `"desc"` if missing or unavailable.

### TASK-3-2: Integrate storage service with blog post listing page
- **File to touch:** Blog post listing page component
- **What to change:** On mount, read saved preference via `getSortPreference()` and apply it as initial state. On toggle, call `setSortPreference()` with the new order.
- **Definition of done:** Blog post listing page restores and saves sort order via localStorage.

### TASK-3-3: Integrate storage service with tag listing page
- **File to touch:** Tag listing page component
- **What to change:** On mount, read saved preference via `getSortPreference()` and apply it as initial state. On toggle, call `setSortPreference()` with the new order.
- **Definition of done:** Tag listing page restores and saves sort order via localStorage.

### TASK-3-TEST-1: Unit tests for storage service
- **File:** `tests/features/feat_add_chronological_order_toggle/story-3.test.ts`
- **What to test:** `getSortPreference` returns default when key absent; returns saved value when present; `setSortPreference` writes to `localStorage`; graceful fallback when storage throws.
- **Acceptance:** All assertions pass; coverage for storage service >80%.

### TASK-3-TEST-2: E2E tests for persistence across sessions
- **File:** `e2e/features/feat_add_chronological_order_toggle/story-3.spec.ts`
- **What to test:** User selects chronological order, reloads page, and the order is still chronological on both blog and tag pages.
- **Acceptance:** All Playwright/Cypress assertions pass.
