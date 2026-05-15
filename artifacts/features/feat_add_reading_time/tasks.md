# feat_add_reading_time — Task List

## TASK-1-1: Create reading time utility

- **File:** `src/utils/reading-time.ts`
- **What:** Create a utility module that:
  - Exports `calculateReadingTime(content: string): number` — takes a markdown string, strips markdown syntax, counts words, divides by 200 WPM, and rounds up to the nearest whole minute. Returns a minimum of 1 minute.
  - Exports `WORDS_PER_MINUTE` constant (set to 200) for future configurability.
- **Definition of done:** Function is pure, typed, handles edge cases (empty string, single word, very long content), and is covered by unit tests.

---

## TASK-1-TEST-1: Write unit tests for reading time utility

- **File:** `src/utils/__tests__/reading-time.test.ts`
- **What:** Write unit tests covering:
  - Normal multi-paragraph content returns correct reading time.
  - Empty string returns 1 (minimum).
  - Single word returns 1.
  - Content with exactly 200 words returns 1.
  - Content with 201 words returns 2 (rounds up).
  - Content with markdown syntax (headings, links, images, code blocks) is stripped before counting.
  - Very long content (10,000+ words) returns correct time.
- **Definition of done:** All tests pass, coverage >80% for `reading-time.ts`.

---

## TASK-2-1: Display reading time on blog post detail page

- **File:** `src/pages/blog/[slug].astro`
- **What:** Update the post header to display reading time:
  - Import `calculateReadingTime` from `src/utils/reading-time.ts`.
  - Compute reading time from `post.body` (the raw markdown content).
  - Display the reading time in the header area, next to the date, in the format "X min read".
  - Use the existing muted text style: `text-foreground-muted text-sm font-sans uppercase tracking-wider`.
  - Add a separator (e.g., `·` or `|`) between the date and reading time for visual clarity.
- **Definition of done:** Reading time appears on every blog post detail page next to the date, styled consistently with the existing design language.

---

## TASK-3-1: Display reading time on blog listing page

- **File:** `src/pages/blog.astro`
- **What:** Update each post card in the listing to display reading time:
  - Import `calculateReadingTime` from `src/utils/reading-time.ts`.
  - Compute reading time from each `post.body` in the map loop.
  - Display the reading time next to the date in each post card, in the format "X min read".
  - Use the same muted text style as the date.
  - Add a separator between the date and reading time matching the detail page style.
- **Definition of done:** Reading time appears on every post card in the blog listing, styled consistently with the detail page and existing design.

---

## TASK-4-1: Verify build and tests pass

- **What:** Run the full verification suite:
  - `npx vitest run` — all unit tests pass.
  - `npx astro check` — zero type errors.
  - `npx astro build` — production build succeeds with no errors.
- **Definition of done:** All three commands exit with code 0. No regressions introduced.