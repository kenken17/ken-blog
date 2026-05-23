# Feature: Add Chronological Order Toggle — Tasks

## Story 1: Sort Order Utility & Persistence

### TASK-1-1: Create sort-order utility module

- **File:** `src/utils/sort-order.ts`
- **What:** Create a new utility module following the pattern of `src/utils/theme.ts`. Export a `SortOrder` type (`'chronological' | 'reverse-chronological'`), a `STORAGE_KEY` constant (`'sort_order'`), and these functions: `getStoredSortOrder()` (reads from localStorage, returns `SortOrder | null`, SSR-safe with try/catch), `setStoredSortOrder(order: SortOrder)` (writes to localStorage, SSR-safe), `getDefaultSortOrder()` (returns `'reverse-chronological'`), `toggleSortOrder(current: SortOrder)` (returns the opposite order). Also export a `sortPosts` function that takes an array of posts with `pubDate` and a `SortOrder`, returning a new sorted array.
- **Definition of done:** Module exports all listed types and functions. All functions handle `typeof window === 'undefined'` gracefully. localStorage access is wrapped in try/catch. `sortPosts` correctly sorts in both directions. TypeScript compiles without errors.

### TASK-1-2: Add tag-sorting utility function

- **File:** `src/utils/sort-order.ts`
- **What:** Add a `sortTags` function that takes an array of tag strings and a `SortOrder`, returning a new sorted array. For `'chronological'` (ascending), sort alphabetically A→Z. For `'reverse-chronological'` (descending), sort Z→A. This mirrors the existing `getAllTags` alphabetical sort but allows reversal.
- **Definition of done:** `sortTags(['css', 'astro', 'react'], 'chronological')` returns `['astro', 'css', 'react']`. `sortTags(['css', 'astro', 'react'], 'reverse-chronological')` returns `['react', 'css', 'astro']`. TypeScript compiles without errors.

## Story 2: SortOrderToggle Component

### TASK-2-1: Create SortOrderToggle component

- **File:** `src/components/SortOrderToggle.astro`
- **What:** Create a toggle button component following the pattern of `ThemeToggle.astro`. The component renders a `<button>` with `data-sort-order-toggle` attribute, containing two SVG arrow icons (↑ for chronological, ↓ for reverse-chronological) that toggle visibility based on current state. The button has `aria-label` that dynamically reflects the current order (e.g., "Sort order: newest first — click to show oldest first"). Include an inline `<script>` that imports from `../utils/sort-order.ts`, reads the stored preference on init, and toggles the order on click. The script dispatches a `CustomEvent('sort-order:change', { detail: { order } })` so other scripts can react. Apply styling consistent with the Swiss Modernism 2.0 design: `text-foreground-secondary hover:text-foreground transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-foreground` classes.
- **Definition of done:** Component renders a button with ascending/descending icons. Click toggles between orders. `aria-label` updates to reflect current state. Keyboard accessible (Enter/Space). Component matches existing design system styling. TypeScript compiles without errors.

### TASK-2-2: Integrate SortOrderToggle into blog listing page

- **File:** `src/pages/blog.astro`
- **What:** Import `SortOrderToggle` and render it in the page header area, next to the post count (`{posts.length} posts`). Place it in a flex container alongside the existing header text so it appears as a natural part of the page header. The toggle should be right-aligned or inline with the post count.
- **Definition of done:** Toggle renders on `/blog` page in the header area. Layout is responsive and doesn't break existing design. Build passes without errors.

### TASK-2-3: Integrate SortOrderToggle into tag listing page

- **File:** `src/pages/tags/index.astro`
- **What:** Import `SortOrderToggle` and render it in the page header area, next to the tag count (`{tags.length} topics`). Same placement pattern as the blog page.
- **Definition of done:** Toggle renders on `/tags` page in the header area. Layout is responsive. Build passes without errors.

### TASK-2-4: Integrate SortOrderToggle into tag detail page

- **File:** `src/pages/tags/[tag].astro`
- **What:** Import `SortOrderToggle` and render it in the page header area, next to the post count (`{posts.length} posts`). Same placement pattern as the blog page.
- **Definition of done:** Toggle renders on `/tags/[tag]` pages in the header area. Layout is responsive. Build passes without errors.

## Story 3: Client-Side Post Reordering

### TASK-3-1: Implement client-side reordering script for blog listing

- **File:** `src/pages/blog.astro`
- **What:** Add an inline `<script>` (or enhance the existing SortOrderToggle script) that listens for the `sort-order:change` custom event and reorders the post list DOM elements. The script should: (1) select all `<article>` elements inside the posts container, (2) convert to an array, (3) sort by the `datetime` value from the `<time>` element's `dateTime` attribute (or a `data-pub-date` attribute), (4) re-append in the new order, (5) recalculate `animation-delay` styles based on new index. Add a `data-pub-date` attribute to each `<article>` or `<time>` element in the Astro template so the client script can sort without parsing date strings.
- **Definition of done:** Clicking the toggle on `/blog` instantly reorders posts. Animation stagger still works after reorder. No page reload. Works correctly on initial page load with stored preference.

### TASK-3-2: Implement client-side reordering script for tag detail page

- **File:** `src/pages/tags/[tag].astro`
- **What:** Same approach as TASK-3-1 but for the tag detail page. Add `data-pub-date` attributes to article elements. Add inline script that listens for `sort-order:change` and reorders posts.
- **Definition of done:** Clicking the toggle on `/tags/[tag]` instantly reorders posts. Animation stagger still works. No page reload. Works correctly on initial page load with stored preference.

### TASK-3-3: Implement client-side reordering script for tags index page

- **File:** `src/pages/tags/index.astro`
- **What:** Add inline script that listens for `sort-order:change` and reorders the tag link elements. Tags are sorted alphabetically by default; toggling reverses to Z→A. Add `data-tag-name` attributes to each tag `<a>` element for sorting. Re-append in new order and recalculate animation delays.
- **Definition of done:** Clicking the toggle on `/tags` instantly reorders tags between A→Z and Z→A. Animation stagger still works. No page reload. Works correctly on initial page load with stored preference.

### TASK-3-4: Add FOUC-prevention inline script

- **File:** `src/layouts/BaseLayout.astro`
- **What:** Add an inline `<script is:inline>` in the `<head>` section (alongside the existing theme FOUC-prevention script) that reads `sort_order` from localStorage and sets a `data-sort-order` attribute on `<html>` (e.g., `data-sort-order="chronological"` or `data-sort-order="reverse-chronological"`). This allows CSS to apply initial ordering before the full page scripts load. The SortOrderToggle init script will read this attribute as a fallback.
- **Definition of done:** On page load, `<html>` has `data-sort-order` attribute set before paint. No flash of wrong order when user has a stored preference. Script is SSR-safe (checks `localStorage` availability). Build passes without errors.

## Story 4: Testing

### TASK-4-TEST-1: Unit tests for sort-order utility

- **File:** `tests/features/feat_add_chronological_order_toggle/story-1.test.ts`
- **What:** Write unit tests for all functions in `src/utils/sort-order.ts`: `getStoredSortOrder`, `setStoredSortOrder`, `getDefaultSortOrder`, `toggleSortOrder`, `sortPosts`, `sortTags`. Test SSR safety (window undefined), localStorage errors, valid/invalid stored values, sort direction correctness.
- **Definition of done:** All tests pass. Coverage >80% for `sort-order.ts`. Tests cover: happy path for each function, SSR guard (window undefined), localStorage errors, invalid stored values, sort direction correctness for both orders.

### TASK-4-TEST-2: Unit tests for toggle component logic

- **File:** `tests/features/feat_add_chronological_order_toggle/story-2.test.ts`
- **What:** Write unit tests for the SortOrderToggle client-side logic: DOM manipulation, event dispatching, localStorage interaction, aria-label updates. Use happy-dom or jsdom environment.
- **Definition of done:** All tests pass. Tests cover: toggle click dispatches `sort-order:change` event, icon visibility toggles, aria-label updates, localStorage read/write, keyboard activation.

### TASK-4-TEST-3: E2E tests for reordering behavior

- **File:** `e2e/features/feat_add_chronological_order_toggle/story-3.spec.ts`
- **What:** Write Playwright E2E tests that verify: (1) toggle renders on `/blog`, `/tags`, and `/tags/[tag]` pages, (2) clicking toggle reorders posts/tags, (3) preference persists across page navigations (navigate away and back — order is preserved), (4) keyboard accessibility (Tab to toggle, Enter/Space activates), (5) FOUC prevention (stored preference applied before paint).
- **Definition of done:** All E2E tests pass. Tests cover: toggle visibility on all three page types, reorder functionality, persistence across navigation, keyboard accessibility, no FOUC on reload with stored preference.