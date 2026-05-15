# feat_add_reading_time — Summary

| # | Story | Acceptance Criteria |
|---|-------|-------------------|
| 1 | Calculate reading time from word count | `calculateReadingTime` utility in `src/utils/reading-time.ts` uses 200 WPM, rounds up, minimum 1 min; unit tests cover edge cases |
| 2 | Display reading time on blog post detail page | `/blog/[slug]` shows "X min read" next to date in post header; uses muted text style consistent with existing design |
| 3 | Display reading time on blog listing page | `/blog` listing shows "X min read" next to date on each post card; same style as detail page |
| 4 | Performance and correctness | SSG-only (no client JS); >80% test coverage; `astro build` and `astro check` pass with zero errors |