# feat_add_like_button — User Stories

## Story 1: Display like count from Giscus reactions on blog posts

**As a** blog reader,  
**I want** to see the current like count on each blog post,  
**So that** I can gauge how well-received the content is before reading or engaging.

### Acceptance criteria

- A `LikeButton.astro` component renders below the blog post content and above the comments section on every `/blog/[slug]` page.
- On page load, the component fetches the reaction count (specifically the 👍 reaction) from the GitHub GraphQL API for the discussion associated with the blog post slug.
- The like count is displayed next to a heart/thumbs-up icon using the site's typographic style (`font-sans`, `text-foreground-muted`).
- If the API call fails or returns no discussion, the component displays a like count of 0 without throwing errors or causing layout shift.
- The component uses the existing `giscusConfig` (repo, mapping, term) to identify the correct GitHub Discussion.

---

## Story 2: Allow users to react (like) via Giscus

**As a** blog reader,  
**I want** to click a like button to add my reaction to the blog post,  
**So that** I can express appreciation for the content without leaving a full comment.

### Acceptance criteria

- The like button is clickable and triggers the Giscus reaction flow when clicked.
- Clicking the like button opens the Giscus iframe's reaction panel (or uses the Giscus `sendMessage` API to toggle the 👍 reaction), allowing the user to add their reaction via GitHub authentication.
- After a successful reaction, the displayed like count increments by 1 without requiring a full page refresh.
- The button provides visual feedback on hover and click (scale/color transition) consistent with the blog's Swiss Modernism design language.
- If the user has already reacted, the button reflects that state (e.g., filled vs. outline heart icon).

---

## Story 3: Visually consistent and performant like button

**As a** the blog maintainer,  
**I want** the like button to match the blog's design and not degrade page performance,  
**So that** the feature feels native to the site and doesn't slow down the reader experience.

### Acceptance criteria

- The like button container uses `max-w-prose` alignment to sit within the blog post content width, consistent with the Comments section.
- A visual separator (`border-t border-background-elevated` with `mt-12 pt-8`) separates the like section from the post content, matching the existing divider pattern.
- The section heading ("Like this post?") uses `font-display` (Barlow Condensed) and `text-foreground-muted`, consistent with the Comments heading style.
- The GitHub GraphQL API call for fetching reaction counts is made client-side only (no SSR) and does not block initial page render — the count loads asynchronously with a subtle loading state.
- The `output: 'static'` build mode continues to work — no server-side rendering required.
- No new npm dependencies are added; the GitHub API is called via `fetch` with the existing public Giscus configuration.