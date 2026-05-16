# Feature: Add SEO Optimization — User Stories

## Story 1: On-Page Meta & Open Graph Tags

**As a** blog reader coming from a search engine or social media link,
**I want** each page to have proper meta titles, descriptions, canonical URLs, and Open Graph / Twitter Card tags,
**so that** search engines index my pages correctly and social platforms display rich previews.

Acceptance criteria:

- Every page renders a unique `<title>` tag and `<meta name="description">`.
- Every page includes `<link rel="canonical">` pointing to the absolute URL.
- Blog post pages include Open Graph tags: `og:title`, `og:description`, `og:type`, `og:url`, `og:image` (if available), `og:site_name`.
- Blog post pages include Twitter Card tags: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image` (if available).
- The homepage and blog listing page include appropriate OG/Twitter tags.
- Tag listing pages include OG/Twitter tags with tag-specific titles.

---

## Story 2: Structured Data (Schema.org JSON-LD)

**As a** search engine crawler,
**I want** each page to include Schema.org structured data in JSON-LD format,
**so that** search results can display rich snippets (article info, breadcrumbs, site name).

Acceptance criteria:

- Blog post pages include `Article` schema with `headline`, `description`, `datePublished`, `dateModified`, `author`, `image`, and `publisher`.
- The homepage includes `WebSite` schema with `name`, `url`, and `description`.
- Tag listing pages include `CollectionPage` schema.
- All JSON-LD is valid per Google's Structured Data Testing Tool / Rich Results Test.
- Schema.org types used: `Article`, `WebSite`, `CollectionPage`, `BreadcrumbList`.

---

## Story 3: XML Sitemap

**As a** search engine bot,
**I want** an XML sitemap listing all published blog posts, tag pages, and the homepage,
**so that** I can discover and index all pages efficiently.

Acceptance criteria:

- A `/sitemap.xml` endpoint is generated at build time listing all non-draft posts, tag pages, the homepage, and the blog listing page.
- Each URL entry includes `<lastmod>` derived from `pubDate` (or `updatedDate` if present).
- The sitemap is referenced in `robots.txt` with a `Sitemap:` directive.
- The sitemap is valid per the sitemaps.org protocol.

---

## Story 4: Performance & Mobile-Friendliness

**As a** blog reader on a mobile device,
**I want** pages to load quickly and display correctly on my screen,
**so that** I can read content without frustration and search engines rank the site favorably.

Acceptance criteria:

- Astro's built-in image optimization is used for all content images (via `<Image />` component or `getImage`).
- Font loading uses `font-display: swap` (already present via Google Fonts URL param).
- `<meta name="viewport">` is present (already exists).
- Preconnect hints for external resources are in place (already present for Google Fonts).
- Lighthouse performance score ≥ 90 on mobile for the homepage.
- Lighthouse accessibility score ≥ 90 on mobile for the homepage.

---

## Story 5: SEO Configuration Utility

**As a** developer maintaining the blog,
**I want** a centralized SEO configuration module that provides site-wide defaults and per-page overrides,
**so that** I can manage SEO metadata consistently without duplicating logic across pages.

Acceptance criteria:

- A `src/config/seo.ts` module exports a `siteConfig` object with `title`, `description`, `siteUrl`, `author`, `defaultImage`, and `social` (Twitter handle, etc.).
- A `generateMetaTags()` utility function accepts page-specific overrides and returns an array of meta tag objects.
- A `generateJsonLd()` utility function accepts page type and data, returning a JSON-LD script object.
- All existing pages are refactored to use these utilities instead of inline meta tags.