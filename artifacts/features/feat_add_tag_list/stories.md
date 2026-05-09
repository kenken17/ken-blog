# feat_add_tag_list — User Stories

## Story 1: View all tags on a dedicated page

**As a** blog reader,  
**I want** to visit a dedicated tag listing page that shows all tags used across blog posts,  
**So that** I can discover what topics are covered and browse content by interest.

### Acceptance criteria

- A `/tags` route renders a page listing every unique tag found across published (non-draft) posts.
- Each tag displays its name and the number of associated posts.
- Tags are sorted alphabetically for predictable scanning.
- The page uses the existing `BaseLayout` for consistent branding and navigation.
- The page is responsive: tags reflow naturally on mobile and remain readable on desktop.

---

## Story 2: Navigate from a tag to its filtered post list

**As a** blog reader,  
**I want** to click a tag on the tag listing page and see all posts associated with that tag,  
**So that** I can quickly find content relevant to my interests.

### Acceptance criteria

- Each tag on the `/tags` page links to `/tags/[tag]`.
- The `/tags/[tag]` page displays the tag name as a heading and lists all published posts that carry that tag, sorted by `pubDate` descending.
- Each post entry shows the same card format as the `/blog` listing (date, title, description).
- If a tag has no published posts, the page shows a friendly "No posts found" message.
- The `/tags/[tag]` page uses `BaseLayout`.

---

## Story 3: Navigate from a blog post to the tag listing page

**As a** blog reader,  
**I want** each tag displayed on a blog post page to link to the tag's filtered post list,  
**So that** I can explore related content without manually searching.

### Acceptance criteria

- In the blog post detail page (`/blog/[slug].astro`), each tag in the header renders as a clickable link to `/tags/[tag]`.
- In the blog listing page (`/blog.astro`), the single tag shown per post also links to `/tags/[tag]`.
- Tag links use the existing muted text style and include a subtle hover transition consistent with the blog's design language.
- Links are keyboard-accessible and have appropriate `aria-label` attributes (e.g., `aria-label="Posts tagged ai"`).

---

## Story 4: Performance and SEO

**As a** the blog maintainer,  
**I want** the tag listing and tag detail pages to be statically generated and SEO-friendly,  
**So that** page load times remain fast and search engines can index tag pages.

### Acceptance criteria

- Both `/tags` and `/tags/[tag]` pages are statically generated at build time (SSG via `getStaticPaths`).
- Each tag detail page includes a `<title>` in the format `Tag: {tag} | Ken's Blog` and a `<meta name="description">`.
- The tag listing page includes a `<title>` of `Tags | Ken's Blog` and a meta description.
- No client-side JavaScript is added — pages are fully server-rendered.