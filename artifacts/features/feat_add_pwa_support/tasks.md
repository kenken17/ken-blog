# Feature: Add PWA Support — Tasks

## Story 1: Web App Manifest

### TASK-1-1: Create manifest.json

- **File:** `public/manifest.json`
- **What:** Create a Web App Manifest with `name` ("Ken's Blog"), `short_name` ("Ken's Blog"), `start_url` ("/"), `display` ("standalone"), `background_color` ("#FAFAFA"), `theme_color` ("#FAFAFA"), `description`, and `icons` array (placeholder paths for 192x192 and 512x512).
- **Definition of done:** `manifest.json` is valid JSON, passes W3C manifest validation, and contains all required fields.

### TASK-1-2: Link manifest in BaseLayout

- **File:** `src/layouts/BaseLayout.astro`
- **What:** Add `<link rel="manifest" href="/manifest.json" />` inside the `<head>` section.
- **Definition of done:** The manifest link is present in the rendered HTML output of every page.

### TASK-1-TEST-1: Unit test for manifest validity

- **File:** `tests/features/feat_add_pwa_support/story-1.test.ts`
- **What:** Test that `public/manifest.json` parses as valid JSON, contains required fields (`name`, `short_name`, `start_url`, `display`, `theme_color`, `background_color`, `icons`), and that `display` equals `"standalone"`.
- **Definition of done:** All assertions pass. Coverage >80% for manifest-related logic.

### TASK-1-TEST-2: E2E test for manifest link

- **File:** `e2e/features/feat_add_pwa_support/story-1.spec.ts`
- **What:** Navigate to homepage, verify `<link rel="manifest">` exists in `<head>` and points to `/manifest.json`.
- **Definition of done:** Test passes. Manifest link is present and correct.

---

## Story 2: PWA Icons

### TASK-2-1: Generate PWA icon files

- **File:** `public/icons/icon-192x192.png`, `public/icons/icon-512x512.png`, `public/icons/apple-touch-icon.png`
- **What:** Generate PNG icons at 192x192, 512x512, and 180x180 (Apple touch) from the existing `favicon.svg` design. Use a script or manual conversion to produce the icons.
- **Definition of done:** All three icon files exist in `public/icons/` with correct dimensions. Icons visually match the favicon (blue background, white "K").

### TASK-2-2: Reference icons in manifest.json

- **File:** `public/manifest.json`
- **What:** Update the `icons` array to include entries for `icon-192x192.png` (sizes "192x192", type "image/png") and `icon-512x512.png` (sizes "512x512", type "image/png"). Also add a `maskable` icon entry for the 512x512 icon with `purpose: "maskable"`.
- **Definition of done:** Manifest icons array references all generated icons with correct paths, sizes, and types.

### TASK-2-3: Add Apple touch icon link in BaseLayout

- **File:** `src/layouts/BaseLayout.astro`
- **What:** Add `<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />` inside the `<head>` section.
- **Definition of done:** Apple touch icon link is present in the rendered HTML output.

### TASK-2-TEST-1: Unit test for icon files existence and dimensions

- **File:** `tests/features/feat_add_pwa_support/story-2.test.ts`
- **What:** Test that icon files exist at expected paths in `public/icons/`. Validate manifest `icons` array references all required icons with correct sizes and types.
- **Definition of done:** All assertions pass. Coverage >80%.

### TASK-2-TEST-2: E2E test for Apple touch icon

- **File:** `e2e/features/feat_add_pwa_support/story-2.spec.ts`
- **What:** Navigate to homepage, verify `<link rel="apple-touch-icon">` exists and points to `/icons/apple-touch-icon.png`.
- **Definition of done:** Test passes. Apple touch icon link is present and correct.

---

## Story 3: Service Worker for Offline Access

### TASK-3-1: Create service worker

- **File:** `public/sw.js`
- **What:** Create a service worker that:
  - Defines a cache name with version (e.g., `ken-blog-v1`)
  - On `install`: pre-caches critical static assets (CSS, JS, fonts, offline fallback page)
  - On `activate`: cleans up old caches
  - On `fetch`: uses cache-first for static assets (CSS, JS, images, fonts) and network-first for HTML pages, falling back to cache when offline
- **Definition of done:** Service worker file exists, is syntactically valid, and implements the described caching strategies.

### TASK-3-2: Register service worker in BaseLayout

- **File:** `src/layouts/BaseLayout.astro`
- **What:** Add a `<script>` block before `</body>` that registers the service worker:
  ```js
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js');
    });
  }
  ```
- **Definition of done:** Service worker registration script is present in the rendered HTML. The service worker is registered on supported browsers.

### TASK-3-TEST-1: Unit test for service worker logic

- **File:** `tests/features/feat_add_pwa_support/story-3.test.ts`
- **What:** Test that `sw.js` file exists and contains expected cache name, install handler, activate handler, and fetch handler logic. Validate cache-first and network-first strategy patterns via string matching or parsed AST.
- **Definition of done:** All assertions pass. Coverage >80%.

### TASK-3-TEST-2: E2E test for service worker registration

- **File:** `e2e/features/feat_add_pwa_support/story-3.spec.ts`
- **What:** Navigate to homepage, verify that the service worker registration script is present in the page. Verify `/sw.js` is a valid JavaScript file by fetching it.
- **Definition of done:** Test passes. Service worker registration script is present and `/sw.js` is accessible.

---

## Story 4: PWA Meta Tags and Install Prompt Support

### TASK-4-1: Add PWA meta tags to BaseLayout

- **File:** `src/layouts/BaseLayout.astro`
- **What:** Add the following meta tags inside `<head>`:
  - `<meta name="apple-mobile-web-app-capable" content="yes" />`
  - `<meta name="apple-mobile-web-app-status-bar-style" content="default" />`
  - `<meta name="apple-mobile-web-app-title" content="Ken's Blog" />`
  - Verify existing `<meta name="theme-color" content="#FAFAFA" />` matches manifest `theme_color`.
- **Definition of done:** All PWA meta tags are present in the rendered HTML output of every page.

### TASK-4-2: Verify manifest theme_color consistency

- **File:** `public/manifest.json`, `src/layouts/BaseLayout.astro`
- **What:** Ensure `manifest.json` `theme_color` and `background_color` match the values used in the HTML meta tags. The existing theme-color is `#FAFAFA`.
- **Definition of done:** Both files use consistent color values. No mismatch between manifest and meta tags.

### TASK-4-TEST-1: Unit test for PWA meta tag consistency

- **File:** `tests/features/feat_add_pwa_support/story-4.test.ts`
- **What:** Test that `manifest.json` `theme_color` matches the theme-color meta tag value (`#FAFAFA`). Validate that all required PWA meta tag names are accounted for.
- **Definition of done:** All assertions pass. Coverage >80%.

### TASK-4-TEST-2: E2E test for PWA meta tags

- **File:** `e2e/features/feat_add_pwa_support/story-4.spec.ts`
- **What:** Navigate to homepage, verify presence of `apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`, `apple-mobile-web-app-title`, and `theme-color` meta tags with correct values.
- **Definition of done:** Test passes. All PWA meta tags are present with correct values.