# feat_add_category_filter — User Stories (Updated: Enhanced Tag Filtering)

## Story 1: BlogTagFilter component

As a reader, I want a row of tag toggle pills on the blog page that lets me select one or more tags to narrow down the displayed posts, so that I can quickly find content relevant to my interests without leaving the page.

Acceptance criteria:

- A `src/components/BlogTagFilter.astro` component renders a horizontal list of tag pills below the blog page header.
- Each tag shows its name and post count. The currently selected tags are visually highlighted (filled background).
- Clicking a tag toggles its selection. Multiple tags can be selected simultaneously — posts matching ANY selected tag are shown (OR logic).
- When no tags are selected, all posts are shown (no filter active).
- The component is a client-side vanilla JS island (inline `<script>` in Astro), consistent with `SortOrderToggle.astro` and `ThemeToggle.astro` patterns.
- The filter is responsive: on mobile, tags wrap naturally; on desktop, they display in a single row or wrap gracefully.
- Keyboard-accessible: each tag pill is focusable and activatable via Enter/Space.
- Styling follows Swiss Modernism 2.0: `font-sans`, `uppercase tracking-wider`, `text-sm`, monochrome palette (`border-background-elevated`, `text-foreground-muted` → filled `bg-foreground text-background` on active).
- Selection state persists in `localStorage` under key `blog_tag_filter`.
- Dispatches a `blog-tag-filter:change` CustomEvent on the document when selection changes.

---

## Story 2: Blog page integration and client-side filtering

As a reader, I want the blog listing page to filter posts instantly when I select tags, without a full page reload, so that the experience feels fast and responsive.

Acceptance criteria:

- The `/blog` page renders the `BlogTagFilter` component between the header and the post list.
- On initial page load, all posts are visible. The tag filter reads any stored preference from `localStorage` (key: `blog_tag_filter`).
- Selecting tags updates the visible posts immediately via client-side DOM manipulation (show/hide, not re-order).
- Each `<article>` in the post list has a `data-tags` attribute containing a JSON array of the post's tags.
- The post count text (e.g., "3 posts") updates dynamically to reflect the number of visible posts.
- The filter composes correctly with the existing `SortOrderToggle` (e.g., sort order is preserved when filtering).
- An `aria-live="polite"` region announces filter changes to screen readers.
- A FOUC-prevention inline script in the layout `<head>` applies the stored filter state before first paint.
- If a stored tag no longer exists (e.g., removed from all posts), it is silently ignored and all posts are shown.

---

## Story 3: Testing

As a developer, I want automated tests covering the tag filter logic, component behavior, and end-to-end user interactions, so that regressions are caught early.

Acceptance criteria:

- Unit tests for the client-side filter logic (extracted from the inline script into a testable module if possible, or tested via DOM simulation).
- Unit tests for `BlogTagFilter` DOM logic: toggle selection, multi-select, localStorage read/write, keyboard events.
- Playwright E2E tests covering: filter rendering on `/blog`, multi-select filtering, persistence across reload, keyboard accessibility, composition with sort-order toggle.
- All existing tests continue to pass.
