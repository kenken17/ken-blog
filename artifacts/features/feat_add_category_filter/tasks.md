# feat_add_category_filter — Task List (Updated: Enhanced Tag Filtering)

## Story 1: BlogTagFilter component

### TASK-1-1: Create BlogTagFilter component

- **File:** `src/components/BlogTagFilter.astro`
- **What:** Create a component that renders a horizontal list of tag toggle pills. The component:
  - Accepts `tags` (string array) and `tagCounts` (Map<string, number>) as Astro props.
  - Renders each tag as a `<button>` with `data-blog-tag-filter` attribute and `data-tag="{name}"` attribute.
  - Each button shows the tag name and count.
  - Active state: filled background (`bg-foreground text-background`), inactive: outlined (`border-background-elevated text-foreground-muted`).
  - Inline `<script>` handles click toggling, multi-select, localStorage persistence (`blog_tag_filter`), custom event dispatch, and keyboard support (Enter/Space).
  - Responsive: flex-wrap container.
  - Follows the same inline script pattern as `SortOrderToggle.astro` and `ThemeToggle.astro`.
- **Definition of done:** Component renders correctly on `/blog`. Buttons toggle. Multiple selections work. localStorage persists. Keyboard accessible.

---

## Story 2: Blog page integration and client-side filtering

### TASK-2-1: Integrate BlogTagFilter into /blog and add client-side filtering

- **File:** `src/pages/blog.astro`
- **What:**
  - Import `BlogTagFilter` and `getAllTags`, `getTagCounts` from `../utils/tags`.
  - Render `BlogTagFilter` between the header section and the post list, passing `tags` and `tagCounts`.
  - Add `data-tags={JSON.stringify(post.data.tags)}` to each `<article>` element.
  - Add an `aria-live="polite"` region (e.g., a visually hidden span or the existing post count) that announces visible post count changes.
  - Add an inline `<script>` that:
    - Listens for `blog-tag-filter:change`.
    - Reads selected tags from the event detail.
    - Iterates over all `<article data-tags="...">` elements.
    - Shows posts where `data-tags` includes ANY selected tag (OR logic).
    - If no tags selected, shows all posts.
    - Updates the visible post count text.
    - Re-applies animation delays to visible posts for consistent stagger.
  - Ensure the existing `SortOrderToggle` and its client-side reordering script continue to work correctly alongside the new filter script.
- **Definition of done:** Tag filter renders on `/blog`. Selecting tags filters posts instantly. Post count updates. Sort order still works. No console errors.

### TASK-2-2: Add FOUC prevention for tag filter

- **File:** `src/layouts/BaseLayout.astro`
- **What:** Add an inline script in the `<head>` (similar to the existing sort-order FOUC prevention) that:
  - Reads `blog_tag_filter` from localStorage.
  - If valid, sets `data-tag-filter` on the `<html>` element before first paint.
- **File:** `src/components/BlogTagFilter.astro`
- **What:** Read `data-tag-filter` from `<html>` on mount to initialize active state before hydration.
- **Definition of done:** No visible flash of unfiltered content on page load when a filter is stored.

---

## Story 3: Testing

### TASK-3-1: Unit tests for filter logic

- **File:** `src/tests/blog-tag-filter/story-1.test.ts` (or similar path following existing convention)
- **What:** Test the client-side filtering logic:
  - Given a list of posts with tags, filtering by one tag returns matching posts.
  - Filtering by multiple tags returns posts matching ANY (OR logic).
  - Filtering by no tags returns all posts.
  - Filtering by a non-existent tag returns empty.
- **Definition of done:** Tests pass. Coverage >80% for filter logic.

### TASK-3-2: Unit tests for BlogTagFilter DOM logic

- **File:** `src/tests/blog-tag-filter/story-2.test.ts`
- **What:** DOM tests for `BlogTagFilter`:
  - Clicking a tag button toggles its active state.
  - Clicking multiple tags selects all.
  - localStorage is updated on selection change.
  - localStorage is read on mount.
  - Keyboard (Enter/Space) toggles selection.
  - CustomEvent `blog-tag-filter:change` is dispatched with correct detail.
- **Definition of done:** Tests pass.

### TASK-3-3: E2E tests for tag filtering

- **File:** `src/tests/blog-tag-filter/story-3.spec.ts`
- **What:** Playwright E2E tests:
  - Tag filter is visible on `/blog`.
  - Clicking a tag filters posts to show only matching ones.
  - Clicking multiple tags shows posts matching any (OR).
  - Clicking an active tag deselects it.
  - Selecting tags, navigating away, and returning persists the selection.
  - Reloading the page persists the selection.
  - Keyboard (Tab + Enter/Space) can select/deselect tags.
  - SortOrderToggle continues to work after filtering.
  - Post count updates correctly.
- **Definition of done:** All E2E tests pass.
