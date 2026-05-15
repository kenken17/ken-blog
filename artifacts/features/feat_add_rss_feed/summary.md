# feat_add_rss_feed — Summary

| # | Story | Acceptance Criteria |
|---|-------|-------------------|
| 1 | RSS Feed Endpoint | Feed accessible at `/rss.xml`, valid RSS 2.0, non-draft posts sorted newest first; correct channel metadata (title, description, site URL) |
| 2 | Feed Content Quality | Each `<item>` has title, link, pubDate (RFC 822), description (with fallback), and guid; all required RSS 2.0 fields present per item |
| 3 | RSS Autodiscovery | `<link rel="alternate" type="application/rss+xml">` in every page's `<head>` pointing to `/rss.xml`; autodiscovery tag present on all pages |
| 4 | Validation and Testing | Unit tests verify feed structure and draft exclusion; E2E tests confirm `/rss.xml` accessibility and autodiscovery; coverage >80% for RSS module |
