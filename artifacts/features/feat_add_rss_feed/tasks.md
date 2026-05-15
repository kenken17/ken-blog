# Tasks: Add RSS Feed to the Blog

## TASK-1-1: Install @astrojs/rss dependency

- **File**: `package.json`
- **What**: Install `@astrojs/rss` package as a dependency
- **Definition of done**: `@astrojs/rss` is listed in `dependencies` in `package.json` and `npm install` succeeds without errors

## TASK-1-2: Create RSS feed endpoint

- **File**: `src/pages/rss.xml.ts`
- **What**: Create a new Astro endpoint that generates an RSS 2.0 feed:
  - Import `rss` from `@astrojs/rss`
  - Import `getCollection` from `astro:content`
  - Export a `GET` function that:
    - Fetches all non-draft posts from the `posts` collection
    - Sorts them by `pubDate` descending (newest first)
    - Returns an `rss` response with:
      - `title`: "Ken's Blog"
      - `description`: "A place for thoughts on engineering, design, and technology."
      - `site`: `https://ken-blog.pages.dev` (from `astro.config.mjs`)
      - `items`: array of post objects with `title`, `pubDate`, `description` (use frontmatter description or fallback to empty string), `link` (constructed as `/blog/${post.id}`), and `guid` (same as link)
    - Uses `content` from `render(post)` for the `content` field if available, otherwise the `description`
- **Definition of done**: Building the project produces a valid `/rss.xml` with all non-draft posts, sorted newest first, containing title, description, pubDate, link, and guid for each item

## TASK-2-1: Add RSS autodiscovery link to BaseLayout

- **File**: `src/layouts/BaseLayout.astro`
- **What**: Add a `<link rel="alternate" type="application/rss+xml" title="Ken's Blog RSS Feed" href="/rss.xml" />` tag inside the `<head>` section of `BaseLayout.astro`
- **Definition of done**: Every page rendered through BaseLayout includes the RSS autodiscovery link in its `<head>`. Verify by checking the HTML output of the homepage and blog listing page

## TASK-3-TEST-1: Unit tests for RSS feed generation

- **File**: `tests/features/feat_add_rss_feed/story-4.test.ts`
- **What**: Write unit tests that:
  - Mock `getCollection` to return a controlled set of posts (including one draft)
  - Call the RSS endpoint's GET handler
  - Assert the response is valid XML with correct channel metadata
  - Assert draft posts are excluded
  - Assert items are sorted by pubDate descending
  - Assert each item has required fields (title, link, pubDate, description, guid)
  - Assert the content type is `application/xml`
- **Acceptance**: All tests pass, coverage >80% for the RSS feed module

## TASK-3-TEST-2: E2E test for RSS feed accessibility

- **File**: `e2e/features/feat_add_rss_feed/story-4.spec.ts`
- **What**: Write a Playwright E2E test that:
  - Navigates to `/rss.xml`
  - Asserts the response status is 200
  - Asserts the content type includes `xml`
  - Asserts the response body contains `<rss` and `<channel>` tags
  - Navigates to the homepage
  - Asserts the `<head>` contains a `<link rel="alternate" type="application/rss+xml">` tag with `href="/rss.xml"`
- **Acceptance**: E2E test passes after `npm run build && npm run preview`