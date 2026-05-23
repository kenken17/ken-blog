# Feature: Add Chronological Order Toggle — User Stories

## Story 1: Sort Order Utility & Persistence

As a developer, I want a sort-order utility module that reads and persists the user's preferred listing order (chronological vs. reverse-chronological) via localStorage so that the toggle state survives across sessions and pages.

Acceptance criteria:

- A `src/utils/sort-order.ts` module exports types `SortOrder = 'chronological' | 'reverse-chronological'`, a storage key constant, and functions: `getStoredSortOrder()`, `setStoredSortOrder(order)`, `getDefaultSortOrder()`, `toggleSortOrder(current)`
- `getStoredSortOrder()` returns the stored value from localStorage or `null` if absent/invalid
- `setStoredSortOrder()` writes to localStorage under key `sort_order`
- `getDefaultSortOrder()` returns `'reverse-chronological'` (the current default behavior)
- All functions handle `typeof window === 'undefined'` gracefully (SSR-safe)
- All functions wrap localStorage access in try/catch (consistent with `theme.ts` and `consent.ts` patterns)

## Story 2: SortOrderToggle Component

As a reader, I want a toggle button on the blog listing page and tag listing page that lets me switch between chronological and reverse-chronological order so that I can view posts in my preferred order.

Acceptance criteria:

- A `SortOrderToggle.astro` component renders a button with ascending/descending arrow icons, positioned in the page header area (next to the post count)
- Clicking the toggle switches the displayed order immediately
- The button shows the current sort direction visually (e.g., ↓ for reverse-chronological, ↑ for chronological)
- The toggle is keyboard-accessible (Enter/Space to activate) with an appropriate `aria-label` (e.g., "Sort order: newest first" / "Sort order: oldest first")
- The component is a client-side vanilla JS island (inline `<script>` in Astro), consistent with `ThemeToggle.astro` pattern
- The toggle has hover and focus-visible styles matching the existing design system (Swiss Modernism 2.0 palette)

## Story 3: Client-Side Post Reordering

As a reader, I want the post list to reorder instantly when I click the toggle, without a full page reload, so that the experience feels fast and responsive.

Acceptance criteria:

- On the blog listing page (`/blog`), clicking the toggle reorders the rendered post list between chronological and reverse-chronological order
- On the tag detail page (`/tags/[tag]`), clicking the toggle reorders the rendered post list between chronological and reverse-chronological order
- On the tags index page (`/tags`), clicking the toggle reorders the tag list between alphabetical (current) and reverse-alphabetical order
- The reorder happens client-side via DOM manipulation (no page reload)
- The toggle reads the stored preference on page load and applies it, so returning users see their preferred order immediately
- A FOUC-prevention inline script in `<head>` (or early in the page) reads localStorage and applies the sort order before first paint, preventing a flash of wrong order
- Animation delays on post items (`animation-delay`) are recalculated after reorder so the stagger animation still works correctly

## Story 4: Testing

As a developer, I want comprehensive unit and E2E tests for the sort-order utility, toggle component, and reordering behavior so that the feature is reliable and regressions are caught early.

Acceptance criteria:

- Unit tests in `tests/features/feat_add_chronological_order_toggle/story-1.test.ts` cover all `sort-order.ts` utility functions with >80% coverage
- Unit tests in `tests/features/feat_add_chronological_order_toggle/story-2.test.ts` cover toggle logic (DOM manipulation, event handling, localStorage interaction)
- E2E tests in `e2e/features/feat_add_chronological_order_toggle/story-3.spec.ts` verify: toggle renders on `/blog` and `/tags`, clicking toggles order, preference persists across page navigations, keyboard accessibility works
- All tests pass; build passes with zero errors