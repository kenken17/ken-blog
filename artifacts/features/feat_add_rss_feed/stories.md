# Feature: Add RSS Feed to the Blog

## Story 1: RSS Feed Endpoint

As a blog reader, I want to subscribe to an RSS feed at a standard URL so that I can receive updates when new posts are published in my feed reader.

Acceptance criteria:

- An RSS feed is accessible at `/rss.xml`
- The feed is valid RSS 2.0 XML
- The feed channel includes the blog title ("Ken's Blog"), description, and site URL
- Only non-draft posts appear in the feed
- Posts are sorted by publication date (newest first)
- The feed is generated at build time (static output compatible)

## Story 2: Feed Content Quality

As a blog reader, I want each RSS item to include the post title, summary/description, publication date, and a direct link to the full article so that I can quickly scan and decide which posts to read.

Acceptance criteria:

- Each `<item>` contains a `<title>` matching the post's frontmatter title
- Each `<item>` contains a `<link>` pointing to the full post URL (e.g., `https://ken-blog.pages.dev/blog/my-ai-era`)
- Each `<item>` contains a `<pubDate>` in RFC 822 format
- Each `<item>` contains a `<description>` with the post's frontmatter description (or a fallback if empty)
- Each `<item>` contains a `<guid>` set to the post's canonical URL

## Story 3: RSS Autodiscovery

As a blog reader using a web browser, I want the RSS feed to be auto-discoverable so that my browser or feed reader extension can detect and offer subscription automatically.

Acceptance criteria:

- The `<head>` of every page includes a `<link rel="alternate" type="application/rss+xml">` tag pointing to `/rss.xml`
- The autodiscovery link includes a `title` attribute (e.g., "Ken's Blog RSS Feed")

## Story 4: Validation and Testing

As a developer, I want the RSS feed to be validated against the RSS 2.0 specification and covered by automated tests so that I can be confident it works with popular feed readers and regressions are caught early.

Acceptance criteria:

- The generated RSS feed passes W3C Feed Validation or equivalent
- Unit tests verify feed structure (channel metadata, item count, required fields)
- E2E test confirms `/rss.xml` returns HTTP 200 with `application/xml` content type
- All tests pass, coverage >80% for the RSS feed module