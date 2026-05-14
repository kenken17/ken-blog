# feat_add_like_button — Summary

| # | Story | Points | Priority | Acceptance Criteria |
|---|-------|--------|----------|---------------------|
| 1 | Display like count from Giscus reactions on blog posts | 3 | P0 | LikeButton.astro renders on every `/blog/[slug]` page; fetches 👍 reaction count from GitHub GraphQL API using giscusConfig; displays count with icon; returns 0 on API failure; no layout shift |
| 2 | Allow users to react (like) via Giscus | 5 | P0 | Click triggers Giscus reaction flow (iframe message API or fallback); count increments optimistically; visual hover/click feedback; reflects already-reacted state |
| 3 | Visually consistent and performant like button | 3 | P1 | Container aligns with `max-w-prose`; border separator matches existing pattern; heading uses `font-display`/`text-foreground-muted`; async count loading; static build unchanged; zero new npm deps |

**Total points:** 11 | **Complexity:** Medium | **Risk:** Low (client-side only, public GitHub API, graceful fallback)

### Key Design Decisions

- **GitHub GraphQL API for reaction counts** — Fetches the 👍 reaction count from the public GitHub Discussions API. No authentication required for public repos. Falls back to 0 on any failure.
- **Giscus iframe message API for reacting** — Uses `giscus-toggle-reaction` message to toggle the 👍 reaction within the existing Giscus iframe, avoiding the need for a separate GitHub OAuth flow. Falls back to opening the discussion in a new tab if the iframe API is unavailable.
- **No new dependencies** — The GitHub API is called via native `fetch`. No npm packages added. Compatible with `output: 'static'`.
- **Async count loading** — The reaction count fetches client-side after page render, showing a loading placeholder. This preserves the blog's fast static-first load.
- **Consistent design language** — The like section mirrors the Comments section styling (border separator, `font-display` heading, `text-foreground-muted` color) to feel native to the Swiss Modernism design.