# Feature: Add Search Bar to All Pages

## Story 1: Search Index Generation

**As a** site visitor,
**I want** the site to have a pre-built search index of all published content,
**so that** search queries return results instantly without server round-trips.

Acceptance criteria:

- A JSON search index is generated at build time containing all non-draft posts
- Each entry in the index includes: `slug`, `title`, `description`, `tags`, `pubDate`
- The index file is output to `dist/search-index.json` and accessible at `/search-index.json`
- The index is regenerated on every build when content changes
- Index file size remains under 100KB for up to 500 posts

## Story 2: Search Bar UI Component

**As a** site visitor,
**I want** a search bar visible in the header on every page,
**so that** I can initiate a search from anywhere on the site.

Acceptance criteria:

- A `SearchBar.astro` component renders an input field with a search icon
- The search bar is integrated into `BaseLayout.astro` header, visible on all pages
- On desktop: search bar is displayed inline in the header next to the logo
- On mobile: search bar collapses to an icon that expands on tap
- Styling follows the existing Swiss Modernism design system (Barlow Condensed / Space Grotesk, black/grey/white palette)
- Input has proper `aria-label` and `role="search"` for accessibility
- Keyboard shortcut (Cmd/Ctrl+K) focuses the search input

## Story 3: Client-Side Search Logic

**As a** site visitor,
**I want** to type a query and see matching blog posts appear immediately,
**so that** I can quickly find relevant content.

Acceptance criteria:

- A `search.ts` client-side module fetches the search index on first interaction (lazy load)
- Search matches against `title`, `description`, and `tags` fields (case-insensitive)
- Results appear in a dropdown below the search input as the user types (debounced at 200ms)
- Each result shows: post title, description snippet (with match highlighted), date, and tags
- Clicking a result navigates to the blog post page
- Pressing Escape closes the results dropdown and clears focus
- Empty query or no matches shows appropriate empty state messaging
- Search index is cached after first fetch — no re-fetching on subsequent searches

## Story 4: Search Results Dropdown Styling and Interaction

**As a** site visitor,
**I want** the search results dropdown to be visually clean and easy to interact with,
**so that** I can quickly scan and select a result.

Acceptance criteria:

- Dropdown appears below the search input with a subtle shadow and border
- Maximum 8 results shown; scrollable if more matches exist
- Keyboard navigation: arrow up/down to move between results, Enter to select
- Hover state on results matches existing link hover style (`text-foreground-secondary`)
- Dropdown closes when clicking outside the search area
- Dropdown has `animate-fade-in` transition matching existing site animations
- Z-index ensures dropdown appears above all page content

## Story 5: Performance and Build Integration

**As a** site maintainer,
**I want** the search feature to have no measurable impact on page load performance,
**so that** the site remains fast for all visitors.

Acceptance criteria:

- Search index JSON is loaded lazily (only when user interacts with search bar)
- No search-related JavaScript is in the critical rendering path
- Search module is code-split and loaded on demand
- Lighthouse performance score does not decrease after implementation
- `astro build` succeeds with the search index generation step
- Existing tests continue to pass
