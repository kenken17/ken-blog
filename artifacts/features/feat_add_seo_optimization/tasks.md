# Feature: Add SEO Optimization — Tasks

## Story 1: On-Page Meta & Open Graph Tags

### TASK-1-1: Create SEO config module

- **File:** `src/config/seo.ts`
- **What:** Create a `siteConfig` object with `title`, `description`, `siteUrl` (from astro.config `site`), `author`, `defaultOgImage`, and `social` (twitter handle). Export typed interfaces.
- **Done when:** Module exports `siteConfig` and `SeoConfig` type; values match existing site metadata; `siteUrl` reads from Astro config.

### TASK-1-2: Create generateMetaTags utility

- **File:** `src/utils/seo.ts`
- **What:** Create `generateMetaTags(opts)` that accepts `{ title, description, canonicalUrl, ogImage, ogType }` and returns an array of `{ name?, property?, content }` objects covering: `<title>`, `<meta name="description">`, `<link rel="canonical">`, `og:title`, `og:description`, `og:type`, `og:url`, `og:image`, `og:site_name`, `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`. Falls back to `siteConfig` defaults for missing values.
- **Done when:** Function returns correct meta tag objects; unit tests pass covering default fallbacks and overrides.

### TASK-1-3: Integrate meta tags into BaseLayout

- **File:** `src/layouts/BaseLayout.astro`
- **What:** Update `BaseLayout` to accept new props (`ogImage`, `ogType`, `canonicalUrl`) and render all meta tags from `generateMetaTags()` in the `<head>`. Remove existing inline `<meta name="description">` and `<title>` in favor of the generated tags.
- **Done when:** All pages render correct meta tags; no duplicate `<title>` or `<meta name="description">`; canonical URL present on every page.

### TASK-1-4: Update page components to pass SEO props

- **Files:** `src/pages/index.astro`, `src/pages/blog.astro`, `src/pages/blog/[slug].astro`, `src/pages/tags/index.astro`, `src/pages/tags/[tag].astro`
- **What:** Pass page-specific `title`, `description`, `ogImage`, `ogType`, and `canonicalUrl` props to `<BaseLayout>`. Blog posts use `post.data.title`, `post.data.description`, and derive canonical from slug. Homepage uses site defaults.
- **Done when:** Each page passes unique, correct SEO props; OG tags render with page-specific values.

### TASK-1-5: Write unit tests for meta tag generation

- **File:** `tests/features/seo/story-1.test.ts`
- **What:** Test `generateMetaTags()` with: (1) all overrides provided, (2) fallback to defaults, (3) canonical URL construction, (4) OG image fallback, (5) Twitter card type selection.
- **Done when:** All assertions pass; coverage > 80% for `src/utils/seo.ts`.

---

## Story 2: Structured Data (Schema.org JSON-LD)

### TASK-2-1: Create generateJsonLd utility

- **File:** `src/utils/seo.ts` (extend existing)
- **What:** Add `generateJsonLd(type, data)` function supporting `WebSite`, `Article`, `CollectionPage`, and `BreadcrumbList` schemas. Each returns a JSON-LD object conforming to Schema.org spec. `Article` includes `headline`, `description`, `datePublished`, `dateModified`, `author`, `image`, `publisher`. `WebSite` includes `name`, `url`, `description`. `BreadcrumbList` accepts an array of `{ name, url }` items.
- **Done when:** Function produces valid JSON-LD for all four types; unit tests pass.

### TASK-2-2: Add JSON-LD to BaseLayout

- **File:** `src/layouts/BaseLayout.astro`
- **What:** Accept a `jsonLd` prop (array of JSON-LD objects). Render each as a `<script type="application/ld+json">` block in `<head>`.
- **Done when:** BaseLayout renders JSON-LD script tags when provided; no script tags rendered when prop is empty/undefined.

### TASK-2-3: Add JSON-LD to page components

- **Files:** `src/pages/index.astro`, `src/pages/blog/[slug].astro`, `src/pages/tags/[tag].astro`
- **What:** Homepage renders `WebSite` schema. Blog post pages render `Article` schema + `BreadcrumbList`. Tag pages render `CollectionPage` schema + `BreadcrumbList`. Pass generated JSON-LD to BaseLayout via `jsonLd` prop.
- **Done when:** Each page type renders the correct schema; JSON-LD validates against Google Rich Results Test.

### TASK-2-4: Write unit tests for JSON-LD generation

- **File:** `tests/features/seo/story-2.test.ts`
- **What:** Test `generateJsonLd()` for each schema type: (1) `WebSite` has required fields, (2) `Article` includes all required fields and falls back for optional ones, (3) `CollectionPage` is valid, (4) `BreadcrumbList` generates correct itemListElement structure.
- **Done when:** All assertions pass; coverage > 80% for JSON-LD generation code.

---

## Story 3: XML Sitemap

### TASK-3-1: Add @astrojs/sitemap integration

- **File:** `astro.config.mjs`, `package.json`
- **What:** Install `@astrojs/sitemap` and add it to Astro config integrations. Configure `filter` to exclude draft posts (if applicable) and `changefreq`/`priority` defaults.
- **Done when:** `npm run build` succeeds; `/sitemap-index.xml` is generated in `dist/`; sitemap contains all non-draft post URLs, tag pages, homepage, and blog listing page.

### TASK-3-2: Create robots.txt

- **File:** `public/robots.txt`
- **What:** Create a `robots.txt` that allows all crawlers, references the sitemap URL (`https://ken-blog.pages.dev/sitemap-index.xml`), and disallows `/api/` and `/admin/` paths.
- **Done when:** `robots.txt` is served at `/robots.txt`; contains `Sitemap:` directive; blocks `/api/` and `/admin/`.

### TASK-3-3: Write tests for sitemap generation

- **File:** `tests/features/seo/story-3.test.ts`
- **What:** Integration test that runs `astro build` (or uses Astro's build output) and verifies: (1) `sitemap-index.xml` exists, (2) all non-draft post URLs are present, (3) homepage and blog listing URLs are present, (4) draft posts are excluded.
- **Done when:** All assertions pass.

---

## Story 4: Performance & Mobile-Friendliness

### TASK-4-1: Audit and optimize images

- **File:** `src/pages/blog/[slug].astro`, any component rendering `<img>`
- **What:** Replace any raw `<img>` tags for content images with Astro's `<Image />` component for automatic width/height, format conversion, and responsive sizing. Ensure all images have `alt` text (fall back to post title if no alt provided).
- **Done when:** No raw `<img>` tags without width/height attributes remain; all images have `alt` text; build succeeds.

### TASK-4-2: Add resource hints for performance

- **File:** `src/layouts/BaseLayout.astro`
- **What:** Add `<meta name="format-detection" content="telephone=no">` to prevent unwanted phone number linking. Ensure `preconnect` hints are present for Google Fonts (already done). Add `dns-prefetch` for any other external resources if applicable.
- **Done when:** No unnecessary format detection; preconnect hints in place; Lighthouse performance ≥ 90.

### TASK-4-3: Verify Lighthouse scores

- **File:** N/A (manual verification)
- **What:** Run Lighthouse audit on the production build for homepage and a blog post page. Document scores. If performance < 90 or accessibility < 90, create follow-up tasks.
- **Done when:** Lighthouse performance ≥ 90 and accessibility ≥ 90 on homepage; scores documented in `summary.md`.

---

## Story 5: SEO Configuration Utility

### TASK-5-1: Create centralized SEO config

- **File:** `src/config/seo.ts`
- **What:** (Covered in TASK-1-1) Ensure `siteConfig` exports all needed fields: `title`, `description`, `siteUrl`, `author`, `defaultOgImage`, `social.twitter`, `social.github`. Add JSDoc comments for each field.
- **Done when:** Module is importable; all fields have sensible defaults; TypeScript compiles without errors.

### TASK-5-2: Refactor existing pages to use SEO utilities

- **Files:** `src/pages/index.astro`, `src/pages/blog.astro`, `src/pages/blog/[slug].astro`, `src/pages/tags/index.astro`, `src/pages/tags/[tag].astro`
- **What:** (Covered in TASK-1-4) Ensure all pages use `generateMetaTags()` and `generateJsonLd()` from `src/utils/seo.ts` instead of inline meta tags. Remove any hardcoded meta values.
- **Done when:** No inline meta tag construction outside of `src/utils/seo.ts`; all pages use the utility functions.

### TASK-5-3: Write integration tests for SEO config

- **File:** `tests/features/seo/story-5.test.ts`
- **What:** Test that `siteConfig` values are consistent with `astro.config.mjs` site URL. Test that `generateMetaTags()` and `generateJsonLd()` produce valid output when using `siteConfig` defaults.
- **Done when:** All assertions pass; config values are consistent across modules.