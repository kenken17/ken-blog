# Tasks: Add Search Bar to All Pages

## TASK-1-1: Create search index generation script

- **File:** `scripts/generate-search-index.ts`
- **What:** Create a Node.js script that reads all non-draft posts from `src/content/posts/`, extracts `slug`, `title`, `description`, `tags`, `pubDate` from frontmatter, and writes a JSON file to `public/search-index.json`. Using `public/` ensures Astro copies it to `dist/` at build time with no extra config.
- **Done when:** Running `npx tsx scripts/generate-search-index.ts` produces `public/search-index.json` with correct structure. File is valid JSON. Draft posts are excluded.

## TASK-1-2: Integrate index generation into build pipeline

- **File:** `package.json`
- **What:** Add a `prebuild` script that runs the search index generator before `astro build`. Update the `build` script to: `npm run prebuild && astro check && astro build`. Also add a `prebuild` script entry: `tsx scripts/generate-search-index.ts`.
- **Done when:** `npm run build` automatically generates the search index before the Astro build. The index file is present in `dist/` after build.

## TASK-2-1: Create SearchBar Astro component

- **File:** `src/components/SearchBar.astro`
- **What:** Create the search bar component with: a search icon (inline SVG), a text input with `type="search"`, `aria-label="Search posts"`, `role="search"`, and `placeholder="Search..."`. Style with Tailwind using the existing design tokens (Space Grotesk font, foreground/background colors). Include a hidden results dropdown container. Add `data-search` attributes for JS hooks.
- **Done when:** Component renders a styled search input matching the site's design language. No JS logic yet — just markup and styles.

## TASK-2-2: Integrate SearchBar into BaseLayout header

- **File:** `src/layouts/BaseLayout.astro`
- **What:** Import `SearchBar.astro` and place it in the header `<div>` alongside the `Logo` component. On desktop: flex row with logo on left, search on right. On mobile: search icon only, expanding on tap (handled by client-side JS). Update the header flex layout to `justify-between` and add the search bar.
- **Done when:** Search bar is visible in the header on all pages that use BaseLayout. Desktop shows full input; mobile shows icon.

## TASK-3-1: Create client-side search module

- **File:** `src/scripts/search.ts`
- **What:** Create the client-side search logic: (1) lazy-fetch `/search-index.json` on first interaction and cache it, (2) search function that filters posts by matching query against title/description/tags (case-insensitive), (3) debounce utility (200ms), (4) highlight matching text in results. Export functions for use by the component script.
- **Done when:** Module can be imported in a `<script>` tag, fetches the index on demand, and returns filtered/highlighted results for a given query.

## TASK-3-2: Wire search module to SearchBar component

- **File:** `src/components/SearchBar.astro`
- **What:** Add a `<script>` block to SearchBar that: (1) imports the search module, (2) attaches input event listener with debounce, (3) renders results into the dropdown container, (4) handles keyboard navigation (arrow keys, Enter, Escape), (5) handles Cmd/Ctrl+K global shortcut to focus input, (6) closes dropdown on outside click. Use `client:load` is not needed — plain `<script>` in Astro runs once per page.
- **Done when:** Typing in the search bar shows matching results in the dropdown. Keyboard navigation works. Escape closes dropdown. Cmd/Ctrl+K focuses the input.

## TASK-4-1: Style search results dropdown

- **File:** `src/components/SearchBar.astro` (style section)
- **What:** Add Tailwind styles for the results dropdown: absolute positioning below input, max-height with overflow-y scroll, subtle shadow (`shadow-lg`), border (`border-background-elevated`), `animate-fade-in`, z-50. Style individual result items with hover states matching existing link patterns. Add empty state text ("No results found"). Show max 8 results.
- **Done when:** Dropdown is visually consistent with the site design. Results are readable and interactive. Hover/focus states work.

## TASK-4-2: Add mobile search interaction

- **File:** `src/components/SearchBar.astro` + `src/scripts/search.ts`
- **What:** On mobile (< md breakpoint): show only a search icon in the header. On tap, expand to full-width search input with overlay backdrop. On close (Escape or backdrop tap), collapse back to icon. Use Tailwind responsive classes and a small amount of JS for the toggle.
- **Done when:** Mobile search icon expands to full input on tap. Results dropdown works on mobile. Escape or backdrop tap collapses the search.

## TASK-5-1: Add unit tests for search logic

- **File:** `src/scripts/__tests__/search.test.ts`
- **What:** Write Vitest unit tests for the search module: (1) filtering by title match, (2) filtering by description match, (3) filtering by tag match, (4) case-insensitive matching, (5) empty query returns empty results, (6) no matches returns empty array, (7) highlight function wraps matches in `<mark>` tags.
- **Done when:** All tests pass with `npm test`. Coverage of core search functions > 90%.

## TASK-5-2: Add E2E test for search bar

- **File:** `e2e/search.spec.ts`
- **What:** Write a Playwright E2E test: (1) search bar is visible on the home page, (2) typing a query shows results dropdown, (3) clicking a result navigates to the correct post, (4) Escape closes the dropdown, (5) search bar is visible on a blog post page.
- **Done when:** `npm run test:e2e` passes for the search spec.

## TASK-5-3: Verify build and performance

- **File:** N/A (verification task)
- **What:** Run `npm run build` and verify: (1) build succeeds, (2) `dist/search-index.json` exists and is valid, (3) `dist/` contains the search module in a code-split chunk, (4) no TypeScript errors from `astro check`. Optionally run Lighthouse on the built site to confirm no performance regression.
- **Done when:** Build exits 0. Search index is present. No new type errors.
