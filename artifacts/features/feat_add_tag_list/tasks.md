# feat_add_tag_list — Task List

## TASK-1-1: Create tag collection utility

- **File:** `src/utils/tags.ts`
- **What:** Create a utility module that:
  - Exports `getAllTags(posts)` — returns a deduplicated, alphabetically sorted array of all tags from published posts.
  - Exports `getPostsByTag(posts, tag)` — returns posts filtered by tag, sorted by `pubDate` descending.
  - Exports `getTagCounts(posts)` — returns a `Map<string, number>` of tag → post count.
- **Definition of done:** Utility functions are pure, typed, and covered by unit tests in `src/utils/__tests__/tags.test.ts`.

---

## TASK-1-2: Create the `/tags` listing page

- **File:** `src/pages/tags/index.astro`
- **What:** Create a new Astro page that:
  - Imports `getCollection` and the tag utilities.
  - Fetches all published (non-draft) posts.
  - Renders all tags with their post counts, sorted alphabetically.
  - Each tag links to `/tags/[tag]`.
  - Uses `BaseLayout` with title `Tags | Ken's Blog` and appropriate meta description.
  - Follows the existing visual style (muted text, uppercase tracking, `font-sans`/`font-display` classes).
- **Definition of done:** `/tags` renders correctly with all tags, links work, responsive layout matches blog aesthetic.

---

## TASK-2-1: Create the `/tags/[tag]` detail page

- **File:** `src/pages/tags/[tag].astro`
- **What:** Create a dynamic Astro page that:
  - Uses `getStaticPaths` to pre-render a page for every tag found in published posts.
  - Displays the tag name as a heading.
  - Lists all posts for that tag using the same card format as `/blog` (date, title, description).
  - Shows a "No posts found" message if no posts match (defensive — shouldn't happen with SSG).
  - Includes a back link to `/tags`.
  - Uses `BaseLayout` with title `Tag: {tag} | Ken's Blog` and meta description.
- **Definition of done:** Each `/tags/[tag]` page renders the correct filtered posts, sorted by date, with proper SEO metadata.

---

## TASK-3-1: Link tags in blog post detail page

- **File:** `src/pages/blog/[slug].astro`
- **What:** Update the tag rendering in the post header:
  - Change each `<span>` tag to an `<a>` element linking to `/tags/${tag}`.
  - Add `aria-label={`Posts tagged ${tag}`}` to each link.
  - Keep the existing visual style (`text-foreground-muted`, `text-xs`, `uppercase`, `tracking-wider`, `font-sans`) and add `hover:text-foreground transition-colors duration-200`.
- **Definition of done:** Tags in blog post pages are clickable, navigate to the correct tag detail page, and maintain visual consistency.

---

## TASK-3-2: Link tags in blog listing page

- **File:** `src/pages/blog.astro`
- **What:** Update the single tag shown per post card:
  - Change the `<span>` to an `<a>` element linking to `/tags/${post.data.tags[0]}`.
  - Add `aria-label={`Posts tagged ${post.data.tags[0]}`}`.
  - Keep the existing visual style and add `hover:text-foreground transition-colors duration-200`.
- **Definition of done:** Tags in the blog listing are clickable and navigate to the correct tag detail page.

---

## TASK-4-1: Add unit tests for tag utilities

- **File:** `src/utils/__tests__/tags.test.ts`
- **What:** Write Vitest tests covering:
  - `getAllTags` returns sorted, deduplicated tags from published posts.
  - `getAllTags` excludes tags from draft posts.
  - `getPostsByTag` returns only matching posts, sorted by date descending.
  - `getTagCounts` returns correct counts per tag.
- **Definition of done:** All tests pass with `vitest run`.

---

## TASK-4-2: Verify build and visual QA

- **What:** Run `astro check` and `astro build` to confirm zero errors. Manually verify:
  - `/tags` page renders all tags with counts.
  - `/tags/[tag]` pages render correct filtered posts.
  - Tag links in `/blog` and `/blog/[slug]` navigate correctly.
  - Pages are responsive on mobile viewport.
- **Definition of done:** Build succeeds with exit code 0. No TypeScript errors. Visual QA passes.