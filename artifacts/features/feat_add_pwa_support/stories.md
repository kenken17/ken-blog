# Feature: Add PWA Support — User Stories

## Story 1: Web App Manifest

As a mobile user, I want to install the blog as a PWA on my device so that I can access it like a native app from my home screen.

Acceptance criteria:

- A `manifest.json` file exists in `public/` with `name`, `short_name`, `start_url`, `display`, `background_color`, `theme_color`, `description`, and `icons` fields
- The manifest is linked via `<link rel="manifest">` in `BaseLayout.astro`
- The manifest's `theme_color` matches the existing `<meta name="theme-color">` value (`#FAFAFA`)
- The manifest's `background_color` matches the site background (`#FAFAFA`)
- The manifest's `display` is set to `standalone`
- Lighthouse PWA audit recognizes the manifest without errors

## Story 2: PWA Icons

As a user, I want the installed PWA to display proper icons on my home screen and task switcher so that it looks like a native app.

Acceptance criteria:

- PWA icon files exist at `public/icons/icon-192x192.png` and `public/icons/icon-512x512.png`
- A maskable icon exists at `public/icons/maskable-icon-512x512.png` with safe-zone padding
- Icons are referenced in `manifest.json` with correct `src`, `sizes`, `type`, and `purpose` fields
- An Apple touch icon (`public/icons/apple-touch-icon.png`, 180x180) exists and is linked in `BaseLayout.astro` via `<link rel="apple-touch-icon">`
- Icons are derived from the existing `favicon.svg` design (blue background `#2563EB`, white "K")
- A script exists to regenerate icons from `favicon.svg` for reproducibility

## Story 3: Service Worker for Offline Access

As a reader, I want to access previously visited blog posts offline so that I can read content without an internet connection.

Acceptance criteria:

- A service worker file (`public/sw.js`) implements a cache-first strategy for static assets (CSS, JS, fonts, images)
- The service worker implements a network-first strategy for HTML pages, falling back to cache when offline
- The service worker is registered in `BaseLayout.astro` with a `<script>` tag
- Cache versioning uses a build-time version string so the service worker updates cached resources when the blog is redeployed
- The service worker does not interfere with the blog's existing functionality when online
- An offline fallback page (`public/offline.html`) is served when the user is offline and the requested page is not in cache

## Story 4: PWA Meta Tags and Install Prompt Support

As a mobile user, I want the browser to offer me an install prompt so that I can easily add the blog to my home screen with a single tap.

Acceptance criteria:

- `<meta name="apple-mobile-web-app-capable" content="yes">` is present in `BaseLayout.astro`
- `<meta name="apple-mobile-web-app-status-bar-style" content="default">` is present in `BaseLayout.astro`
- `<meta name="apple-mobile-web-app-title" content="Ken's Blog">` is present in `BaseLayout.astro`
- The existing `<meta name="theme-color">` value matches the manifest's `theme_color`
- The blog passes Lighthouse's basic PWA criteria (manifest, service worker, installability)