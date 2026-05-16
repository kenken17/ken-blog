# Feature: Add SEO Optimization — Summary

| Story | One-liner | Acceptance criteria |
|-------|-----------|---------------------|
| S1: On-Page Meta & Open Graph Tags | Every page renders unique title, description, canonical URL, and OG/Twitter Card meta tags | Unique `<title>` and `<meta description>` per page; canonical URLs present; OG and Twitter Card tags on all page types |
| S2: Structured Data (Schema.org JSON-LD) | Pages include Schema.org JSON-LD for rich search results | `Article` schema on posts, `WebSite` on homepage, `CollectionPage` on tag pages, `BreadcrumbList` where applicable; valid per Google Rich Results Test |
| S3: XML Sitemap | Auto-generated sitemap listing all published pages | `/sitemap-index.xml` lists all non-draft posts, tag pages, homepage, blog listing; `robots.txt` references sitemap |
| S4: Performance & Mobile-Friendliness | Pages load fast and render correctly on mobile | Images use Astro `<Image />` with alt text; Lighthouse performance ≥ 90, accessibility ≥ 90 on homepage |
| S5: SEO Configuration Utility | Centralized config and utility functions for all SEO metadata | `src/config/seo.ts` provides site-wide defaults; `src/utils/seo.ts` provides `generateMetaTags()` and `generateJsonLd()`; all pages use these utilities |