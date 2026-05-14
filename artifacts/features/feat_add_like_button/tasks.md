# feat_add_like_button — Task List

## TASK-1-1: Create GitHub Discussion reaction fetcher utility

- **File:** `src/utils/reactions.ts`
- **What:** Create a utility module that fetches reaction counts from the GitHub GraphQL API:
  - Export an async function `getReactionCount(repo: string, term: string): Promise<number>` that:
    - Queries the GitHub Discussions GraphQL API using the repo owner/name and the discussion title (derived from the `term` / slug).
    - Extracts the `THUMBS_UP` reaction count from the matching discussion.
    - Returns 0 if no discussion exists or the API call fails (graceful degradation).
  - Use `fetch` to call `https://api.github.com/graphql` with the appropriate query.
  - The GitHub token is NOT required for public repos — the API returns public discussion data without authentication. If rate-limited, return 0 gracefully.
  - Export the GraphQL query string as a constant for testability.
- **Dependencies:** None
- **Definition of done:** Function fetches and returns the 👍 reaction count for a given blog post slug. Returns 0 on any error. No external dependencies added.

---

## TASK-2-1: Create LikeButton Astro component

- **File:** `src/components/LikeButton.astro`
- **What:** Create a new Astro component that displays the like count and button:
  - Accept a `slug` prop (string) for the blog post identifier.
  - Import `giscusConfig` from `src/config/giscus.ts` to derive the repo and mapping term.
  - Render a `<section>` with:
    - A heading: `<h2 class="font-display text-2xl text-foreground-muted mb-4">Like this post?</h2>` matching the site's typographic style.
    - A like button with a heart/thumbs-up SVG icon and a count placeholder.
    - Container styling: `mt-12 pt-8 border-t border-background-elevated` to match the existing divider pattern.
  - Include a client-side `<script>` that:
    - Calls `getReactionCount()` from `src/utils/reactions.ts` on mount to fetch the initial count.
    - Updates the count display when the API response arrives.
    - Shows a loading state (e.g., "—" or a subtle pulse animation) while the count is being fetched.
  - The button click handler should:
    - Use the Giscus iframe message API (`giscus-toggle-reaction`) to toggle the 👍 reaction, OR open the Giscus discussion in a new tab as a fallback.
    - Optimistically increment the count on click, then reconcile with the actual API response.
- **Dependencies:** TASK-1-1
- **Definition of done:** Component renders a like button with count, fetches reactions on mount, handles click to trigger Giscus reaction. No layout shift on load. Matches blog design language.

---

## TASK-2-2: Integrate LikeButton into blog post page

- **File:** `src/pages/blog/[slug].astro`
- **What:** Import `LikeButton.astro` and place it inside the `<article>` element, between the post content `<div class="prose-light">` and the `<Comments>` component:
  - Add `<LikeButton slug={post.id} />` after the content div and before the Comments section.
  - The LikeButton's own `mt-12 pt-8 border-t` styling provides the visual separator, so no additional wrapper is needed.
- **Dependencies:** TASK-2-1
- **Definition of done:** LikeButton appears on every `/blog/[slug]` page between content and comments. No layout issues.

---

## TASK-3-1: Write unit tests for reaction fetcher

- **File:** `tests/utils/reactions.test.ts`
- **What:** Write unit tests for `getReactionCount()`:
  - Test: returns correct count when API returns a discussion with THUMBS_UP reactions.
  - Test: returns 0 when no matching discussion exists.
  - Test: returns 0 when the API call fails (network error, rate limit, etc.).
  - Test: returns 0 when the discussion has no reactions.
  - Mock `fetch` globally in the test file to avoid real API calls.
- **Dependencies:** TASK-1-1
- **Definition of done:** All tests pass. Coverage >80% for `src/utils/reactions.ts`.

---

## TASK-3-2: Visual and build verification

- **File:** N/A (verification task)
- **What:** Verify the complete integration:
  - Run `astro check` — zero errors, zero warnings.
  - Run `astro build` — successful static build with all blog post pages generated.
  - Visually verify (via `astro dev`) that the like button appears between content and comments on a blog post page.
  - Verify the like count loads asynchronously (no blocking render).
  - Verify responsive behavior at 320px, 768px, and 1440px viewports.
- **Dependencies:** TASK-2-2
- **Definition of done:** Build passes with zero errors. Like button renders correctly on all viewports. No performance regression.