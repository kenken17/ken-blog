# feat_add_reading_time — User Stories

## Story 1: Calculate reading time from word count

**As a** blog maintainer,  
**I want** a utility function that calculates reading time based on word count,  
**So that** reading time can be computed consistently across the site using a standard reading speed of 200 WPM.

### Acceptance criteria

- A `calculateReadingTime` function is exported from `src/utils/reading-time.ts`.
- The function accepts a string (markdown content) and returns the estimated reading time in minutes (rounded up to the nearest whole minute).
- The calculation uses 200 words per minute as the average reading speed.
- Edge cases are handled: empty string returns 1 minute (minimum), very short posts return 1 minute.
- Unit tests in `src/utils/__tests__/reading-time.test.ts` cover: normal content, empty string, single-word content, very long content, and content with special characters/markdown syntax.

---

## Story 2: Display reading time on blog post detail page

**As a** blog reader,  
**I want** to see the estimated reading time on each blog post page,  
**So that** I can decide whether I have enough time to read the full article.

### Acceptance criteria

- The blog post detail page (`/blog/[slug].astro`) displays the reading time near the title/date area.
- Reading time is shown in the format "X min read" (e.g., "3 min read", "1 min read").
- The reading time is computed from the rendered post content using the `calculateReadingTime` utility.
- The display uses the existing muted text style (`text-foreground-muted`, `text-sm`, `font-sans`, `uppercase tracking-wider`) consistent with the date and tag styling.
- The reading time appears alongside the publication date in the post header.

---

## Story 3: Display reading time on blog listing page

**As a** blog reader,  
**I want** to see the estimated reading time for each post in the blog listing,  
**So that** I can quickly scan and choose articles that fit my available time.

### Acceptance criteria

- The blog listing page (`/blog.astro`) displays the reading time for each post card.
- Reading time is shown in the format "X min read" next to the date.
- The display uses the same muted text style as the date and tags.
- The reading time is computed using the `calculateReadingTime` utility from the post's body content.

---

## Story 4: Performance and correctness

**As a** the blog maintainer,  
**I want** the reading time feature to be performant and accurate,  
**So that** it does not impact build times and displays correct estimates.

### Acceptance criteria

- Reading time is computed at build time (SSG) — no client-side JavaScript is added.
- The `calculateReadingTime` utility has >80% test coverage.
- The production build (`astro build`) completes without errors.
- No significant build time regression (reading time is a simple word-count calculation).