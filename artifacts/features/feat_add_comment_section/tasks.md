# feat_add_comment_section — Task List

## TASK-1-1: Create Giscus configuration module

- **File:** `src/config/giscus.ts`
- **What:** Create a configuration module that exports a typed `giscusConfig` object containing all Giscus parameters:
  - `repo`: GitHub repository in `owner/repo` format (e.g., `'kenken17/ken-blog-comments'`)
  - `repoId`: GitHub repository ID
  - `category`: Discussion category name (e.g., `'Comments'`)
  - `categoryId`: Discussion category ID
  - `mapping`: Mapping strategy (use `'pathname'` to map each blog post URL to a unique discussion)
  - `theme`: Set to `'light'` to match the blog's color scheme
  - `lang`: Set to `'en'`
  - `reactionsEnabled`: Set to `1` (enabled)
  - `emitMetadata`: Set to `0` (disabled)
- **Definition of done:** Configuration is typed, centralized, and importable by the Comments component. No Giscus values are hard-coded in component templates.

---

## TASK-1-2: Create Comments Astro component

- **File:** `src/components/Comments.astro`
- **What:** Create a new Astro component that renders the Giscus comment widget:
  - Import `giscusConfig` from `src/config/giscus.ts`.
  - Accept an optional `slug` prop (string) to use as the discussion mapping term when `mapping` is set to `'pathname'`.
  - Render a `<section>` container with:
    - A heading: `<h2 class="font-display text-2xl text-foreground-muted mb-6">Comments</h2>` matching the site's typographic style.
    - A `<div>` with `id="giscus"` as the Giscus mount target.
  - Include a `<script>` tag that dynamically creates and inserts the Giscus `<script>` element:
    - Set `src="https://giscus.app/client.js"`.
    - Set all `data-*` attributes from the config object.
    - Set `data-loading="lazy"` for deferred loading.
    - Use the `slug` prop (or `Astro.url.pathname`) as the `data-mapping` term.
  - Wrap the Giscus insertion in a try/catch so a script load failure does not break the page.
  - Apply container styling: `max-w-3xl mx-auto` alignment is handled by the parent page layout.
- **Definition of done:** Component renders a Giscus widget section with proper configuration, lazy loading, and error resilience. No external npm dependencies added.

---

## TASK-1-3: Integrate Comments component into blog post detail page

- **File:** `src/pages/blog/[slug].astro`
- **What:** Import `Comments.astro` and place it inside the `<article>` element, between the post content `<div class="prose-light">` and the `<footer>`:
  - Add the `<Comments slug={post.id} />` component after the content div and before the footer.
  - Add a visual separator above the Comments section: `mt-16 pt-8 border-t border-background-elevated` on the Comments container, consistent with the existing footer divider style.
- **Definition of done:** Every `/blog/[slug]` page renders the comment section between the post content and the back link. No layout shift or visual regression to existing content.

---

## TASK-2-1: Verify responsive design and visual consistency

- **File:** Manual verification on `src/components/Comments.astro` and `src/pages/blog/[slug].astro`
- **What:** Confirm the following:
  - Comment section heading uses `font-display` (Barlow Condensed) and `text-foreground-muted` matching the site's typographic hierarchy.
  - The Giscus widget renders within the `max-w-3xl` content width and does not overflow on mobile viewports (< 640px).
  - The border separator between content and comments matches the existing footer separator style (`border-t border-background-elevated`).
  - The Giscus `light` theme renders correctly and visually integrates with the blog's black/grey/white palette.
  - No horizontal scroll or overflow issues on mobile.
- **Definition of done:** Comment section is visually consistent with the blog design and responsive across desktop and mobile viewports.

---

## TASK-3-1: Verify performance and build integrity

- **File:** `src/config/giscus.ts`, `src/components/Comments.astro`, `src/pages/blog/[slug].astro`
- **What:** Confirm the following:
  - The Giscus script uses `data-loading="lazy"` and does not block initial page render.
  - `astro check` passes with zero errors.
  - `astro build` succeeds and produces static output for all blog post pages.
  - The `output: 'static'` configuration in `astro.config.mjs` is unchanged — no server-side rendering or API routes introduced.
  - No new npm dependencies are added to `package.json`.
- **Definition of done:** Build succeeds, Giscus loads lazily, and no performance regression or configuration changes to the static build pipeline.

---

## TASK-3-TEST-1: Write tests for Giscus configuration module

- **File:** `src/config/__tests__/giscus.test.ts`
- **What:** Write unit tests for the Giscus configuration:
  - Verify `giscusConfig` exports all required fields (`repo`, `repoId`, `category`, `categoryId`, `mapping`, `theme`, `lang`).
  - Verify `theme` is `'light'`.
  - Verify `mapping` is `'pathname'`.
  - Verify `lang` is `'en'`.
- **Definition of done:** All tests pass. Coverage for `giscus.ts` is >80%.

---

## TASK-3-TEST-2: Write tests for Comments component rendering

- **File:** `tests/features/feat_add_comment_section/story-1.test.ts`
- **What:** Write tests that verify:
  - The Comments component renders a `<section>` with an `<h2>` heading containing "Comments".
  - The component renders a `<div id="giscus">` mount target.
  - The component renders a `<script>` tag with `src` pointing to `https://giscus.app/client.js`.
  - The script tag includes `data-loading="lazy"`.
  - The component accepts a `slug` prop and passes it as the mapping term.
- **Definition of done:** All tests pass. Component rendering is verified for correct structure and attributes.