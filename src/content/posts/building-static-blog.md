---
title: "Building a Static Blog"
description: "Lessons learned from building a minimal blog with Astro and deploying to Cloudflare Pages."
pubDate: 2025-02-20
tags: ["astro", "cloudflare", "static-site"]
---

Static sites are back, and they're better than ever. Here's what I learned building this blog.

## The Stack

- **Astro 6.x** for static site generation
- **Tailwind CSS** for styling
- **Cloudflare Pages** for hosting

## Key Decisions

### No Backend CMS

For a personal blog, a backend CMS is overkill. I write in Markdown, commit to Git, and the site rebuilds automatically.

### Monochrome Design

Removing color forces you to focus on hierarchy, spacing, and typography. It's liberating.

## Deployment

Cloudflare Pages makes deployment trivial. Connect your GitHub repo, and every push triggers a new build.
