# Feature: Add Author Bio — User Stories

## Story 1: Author content collection and data model

As a blog author, I want to define my bio information (name, profile picture, description) in a content collection so that it is managed alongside my posts in a structured, type-safe way.

Acceptance criteria:

- A new `authors` content collection is defined in `src/content.config.ts` with schema fields: `name` (string, required), `avatar` (string, required — path to image), `bio` (string, required).
- A single author entry exists at `src/content/authors/ken.md` (or `.mdx`) with Ken's real data.
- The `posts` collection schema gains an optional `author` field (string, default `"ken"`) referencing an author ID.
- Existing posts continue to render without changes (backward compatible — default author assumed).

## Story 2: Author bio page

As a reader, I want to visit a dedicated author bio page so that I can learn more about the person behind the blog posts.

Acceptance criteria:

- A new page exists at `/author/[id]` (e.g. `/author/ken`) that renders the author's name, profile picture, and biography.
- The page uses `BaseLayout` and follows the Swiss Modernism 2.0 design system (Barlow Condensed for headings, Space Grotesk for body, existing color tokens).
- The page is fully responsive — works on mobile (single column, stacked) and desktop (centered, max-w-3xl like posts).
- The profile picture is displayed as a rounded image, max 160px, centered above the name.
- The author name uses `font-display text-display-sm` styling consistent with the blog.
- The bio text uses `text-foreground-secondary` and `font-sans` consistent with post descriptions.
- A list of the author's recent posts appears below the bio, each linking to `/blog/{slug}`.
- A "Back to blog" link appears at the bottom, matching the existing footer link pattern in `[slug].astro`.

## Story 3: Author link from blog posts

As a reader, I want to click the author's name on a blog post to navigate to their bio page so that I can easily find more context about the author.

Acceptance criteria:

- The blog post page (`/blog/[slug]`) displays the author's name as a clickable link in the post header area.
- The link navigates to `/author/{authorId}`.
- The author name link uses the same muted text style as the date/reading-time metadata (`text-foreground-muted text-sm uppercase tracking-wider font-sans`).
- On hover, the link transitions to `text-foreground` (matching existing link patterns).
- If no author field is specified on a post, the link defaults to `/author/ken`.
- The author name appears between the date and reading time in the post header metadata line.

## Story 4: SEO and accessibility for author page

As a site owner, I want the author bio page to have proper SEO metadata and be accessible so that it can be indexed by search engines and used by all visitors.

Acceptance criteria:

- The author page sets `<title>` to `{author.name} | Ken's Blog`.
- Open Graph meta tags include the author name as title and bio as description.
- JSON-LD structured data for `Person` schema is generated and included.
- The profile picture has a descriptive `alt` attribute using the author's name.
- The page passes basic accessibility: heading hierarchy (h1 for name), link focus styles (already inherited from global styles), and sufficient color contrast (using existing design tokens).
