# Feature: Add PWA Support — Summary

| Story | One-liner | Acceptance criteria |
|--------|-----------|---------------------|
| Story 1: Web App Manifest | Create and link a `manifest.json` so users can install the blog as a PWA | Manifest has all required fields; linked in BaseLayout; Lighthouse recognizes it |
| Story 2: PWA Icons | Generate and reference PWA icons at required sizes so the installed app looks native | 192x192, 512x512, maskable 512x512, and 180x180 (Apple) icons exist; referenced in manifest and BaseLayout; generation script is reproducible |
| Story 3: Service Worker for Offline Access | Implement a service worker with cache-first for assets and network-first for pages so users can read offline | Service worker caches assets and pages; serves offline fallback page; registered in BaseLayout; cache versioning works |
| Story 4: PWA Meta Tags and Install Prompt Support | Add Apple mobile web app meta tags and verify theme-color consistency so browsers offer install prompts | All PWA meta tags present; theme-color matches manifest; blog passes basic Lighthouse PWA criteria |