# feat_add_comment_section — User Stories

## Story 1: Display Giscus comment section on blog posts

**As a** blog reader,  
**I want** to see a comment section at the bottom of every blog post,  
**So that** I can read existing comments and leave my own thoughts on the content.

### Acceptance criteria

- A `Comments.astro` component renders the Giscus comment widget below the blog post content on every `/blog/[slug]` page.
- The Giscus widget is configured to use GitHub Discussions as the backend, with the blog post slug as the discussion mapping key.
- The comment section appears between the post content and the "← Back to all posts" footer link.
- The component accepts configuration props (repo, repoId, category, categoryId) so values are not hard-coded in the template.
- If the Giscus script fails to load, the page remains functional — no layout shift or console errors beyond a network failure warning.

---

## Story 2: Responsive and visually consistent comment section

**As a** blog reader on any device,  
**I want** the comment section to look clean and match the blog's design on both desktop and mobile,  
**So that** reading and writing comments feels natural regardless of screen size.

### Acceptance criteria

- The comment section container uses `max-w-3xl mx-auto` to align with the blog post content width.
- A visual separator (border-top with `border-background-elevated`) and `mt-16 pt-8` spacing separates the comment section from the post content, consistent with the existing footer divider style.
- A section heading ("Comments") uses the site's `font-display` (Barlow Condensed) and `text-foreground-muted` styling, matching the typographic hierarchy of the post header.
- The Giscus widget is configured with the `light` theme to match the blog's light color scheme.
- On mobile viewports (< 640px), the comment section remains fully usable with no horizontal overflow.

---

## Story 3: Performance and configuration

**As a** the blog maintainer,  
**I want** the Giscus script to load lazily and configuration to be centralized,  
**So that** the comment system does not impact initial page load performance and is easy to update.

### Acceptance criteria

- The Giscus script loads only after the page content has rendered (using `data-loading="lazy"` attribute or equivalent deferred loading strategy).
- All Giscus configuration values (repo, repoId, category, categoryId, mapping) are stored in a single configuration object/module, not scattered across templates.
- The blog post page's Lighthouse Performance score does not degrade by more than 5 points after integration.
- The `output: 'static'` build mode continues to work — no server-side rendering or API routes are introduced.
- Build succeeds with `astro check` and `astro build` reporting zero errors.