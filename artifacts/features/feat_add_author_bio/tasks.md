# Feature: Add Author Bio — Tasks

## Story 1: Author content collection and data model

### TASK-1-1: Define authors content collection schema

- **File:** `src/content.config.ts`
- **What:** Add an `authors` collection using `defineCollection` with `glob` loader pointing to `./src/content/authors`. Schema: `name` (z.string()), `avatar` (z.string()), `bio` (z.string()). Add optional `author` field (z.string().optional().default("ken")) to the `posts` collection schema. Export updated `collections` object.
- **Definition of done:** TypeScript compiles without errors. Existing posts render unchanged. The new collection is importable via `getCollection('authors')`.

### TASK-1-2: Create author content entry

- **File:** `src/content/authors/ken.md`
- **What:** Create the directory `src/content/authors/` and add `ken.md` with frontmatter: `name: "Ken"`, `avatar: "/images/avatar.png"`, `bio: "Software engineer and designer..."` (placeholder bio text). Place a placeholder avatar image at `public/images/avatar.png` (a simple 320x320 grey placeholder PNG).
- **Definition of done:** `getCollection('authors')` returns the entry. The avatar image is accessible at `/images/avatar.png`.

---

## Story 2: Author bio page

### TASK-2-1: Create author bio page route

- **File:** `src/pages/author/[id].astro`
- **What:** Create a dynamic route page. `getStaticPaths()` fetches all authors from the collection and maps each to `{ params: { id: author.id }, props: { author } }`. The page renders inside `BaseLayout` with: (1) centered profile picture (rounded-full, w-40 h-40, object-cover), (2) author name as h1 with `font-display text-display-sm md:text-display-md text-foreground`, (3) bio paragraph with `text-foreground-secondary text-lg leading-relaxed font-sans max-w-2xl mx-auto`, (4) a "Posts by {name}" section listing all posts by this author (fetched via `getCollection('posts')` filtered by `post.data.author === author.id || (!post.data.author && author.id === 'ken')`), each as a link matching the index.astro post list item style, (5) a footer link "Back to blog" matching the `[slug].astro` footer pattern.
- **Definition of done:** Navigating to `/author/ken` renders the page with name, avatar, bio, and post list. Page is responsive. Uses existing design tokens and layout patterns.

### TASK-2-2: Add author page styles

- **File:** `src/pages/author/[id].astro` (inline within the component)
- **What:** Ensure the author page uses only existing Tailwind utility classes and CSS custom properties. No new global CSS needed — all styling via Tailwind classes consistent with existing pages (animate-fade-in, max-w-3xl mx-auto px-6 py-24, etc.).
- **Definition of done:** Author page visually matches the Swiss Modernism 2.0 aesthetic. Dark mode works via existing `.dark` class toggling.

---

## Story 3: Author link from blog posts

### TASK-3-1: Add author link to blog post header

- **File:** `src/pages/blog/[slug].astro`
- **What:** In the post header metadata line (between date and reading time), add the author name as a link. Fetch the author entry using the post's `author` field (default "ken"). Render: `<a href="/author/{authorId}" class="text-foreground-muted text-sm uppercase tracking-wider font-sans hover:text-foreground transition-colors duration-200">{author.data.name}</a>`. Add a `·` separator before and after, matching the existing separator pattern. Pass the author data through `getStaticPaths` props.
- **Definition of done:** Each blog post shows the author name as a clickable link in the header metadata. Clicking navigates to `/author/ken`. The link style matches existing metadata text.

### TASK-3-2: Update getStaticPaths to include author data

- **File:** `src/pages/blog/[slug].astro`
- **What:** In `getStaticPaths()`, after fetching posts, also fetch authors collection. For each post, resolve the author entry (using `post.data.author` or default "ken") and pass it as a prop alongside the post. Update the `Props` interface to include `author: CollectionEntry<'authors'>`.
- **Definition of done:** The author data is available in the template without additional async calls. TypeScript types are correct.

---

## Story 4: SEO and accessibility for author page

### TASK-4-1: Add SEO metadata to author page

- **File:** `src/pages/author/[id].astro`
- **What:** Pass `title`, `description`, and `canonicalUrl` props to `BaseLayout`. Title: `{author.data.name} | Ken's Blog`. Description: author bio text (truncated to ~160 chars if needed). Canonical: `/author/{author.id}`. Generate JSON-LD using a new `Person` schema object (or inline) with `@type: "Person"`, `name`, `image`, `description`. Pass `ogType="profile"` to BaseLayout.
- **Definition of done:** Page `<title>` is correct. OG tags render. JSON-LD is valid and includes Person schema.

### TASK-4-2: Ensure accessibility on author page

- **File:** `src/pages/author/[id].astro`
- **What:** Verify: (1) single h1 for author name, (2) h2 for "Posts by {name}" section, (3) avatar img has `alt="{author.data.name}"`, (4) all links have visible focus styles (inherited from global), (5) color contrast uses existing design tokens (already WCAG-compliant). No additional code changes expected — just verification that the markup from TASK-2-1 meets these criteria.
- **Definition of done:** Lighthouse accessibility audit passes for the author page. No a11y violations.

---

## Test Tasks

### TASK-1-TEST-1: Unit tests for authors collection schema

- **File:** `tests/features/feat_add_author_bio/story-1.test.ts`
- **What to test:** (1) `getCollection('authors')` returns at least one entry, (2) the "ken" author entry has required fields (name, avatar, bio), (3) posts collection schema accepts optional `author` field, (4) default author value is "ken" when not specified.
- **Acceptance:** All assertions pass. Coverage >80% for `content.config.ts`.

### TASK-2-TEST-1: Unit tests for author bio page rendering

- **File:** `tests/features/feat_add_author_bio/story-2.test.ts`
- **What to test:** (1) `getStaticPaths()` returns a path for each author, (2) the "ken" author page path is `/author/ken`, (3) author page component renders name, avatar, and bio content.
- **Acceptance:** All assertions pass.

### TASK-3-TEST-1: Unit tests for author link in blog posts

- **File:** `tests/features/feat_add_author_bio/story-3.test.ts`
- **What to test:** (1) Blog post page includes author link in rendered HTML, (2) link href points to `/author/ken` for default author, (3) link text matches author name.
- **Acceptance:** All assertions pass.

### TASK-4-TEST-1: E2E test for author bio page

- **File:** `e2e/features/feat_add_author_bio/story-4.spec.ts`
- **What to test:** (1) Navigate to `/author/ken`, verify page title contains "Ken", (2) verify avatar image is visible, (3) verify bio text is present, (4) verify at least one post link appears, (5) from a blog post page, click author name link and verify navigation to author page, (6) verify responsive layout on mobile viewport.
- **Acceptance:** All Playwright assertions pass. No visual regressions.
