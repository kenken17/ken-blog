# Feature: Add Dark Mode — Tasks

## Story 1: Tailwind Dark Mode Configuration & CSS Foundation

### TASK-1-1: Configure Tailwind dark mode strategy

- **File:** `tailwind.config.js`
- **What:** Add `darkMode: 'class'` to the top-level config (before `content`). Add dark color overrides to the `colors` object using CSS custom properties or explicit `dark:` variant support. The approach: define CSS custom properties on `:root` (light) and `.dark` (dark) in `global.css`, then reference them in `tailwind.config.js` so that `bg-background`, `text-foreground`, etc. automatically resolve to the correct color based on the `dark` class on `<html>`.
- **Definition of done:** `tailwind.config.js` has `darkMode: 'class'`. Color tokens use CSS custom properties (e.g., `var(--color-background)`) so that toggling the `dark` class on `<html>` switches all semantic colors. Running `npx tailwindcss --help` confirms config parses without errors.

### TASK-1-2: Add dark mode CSS custom properties and base styles

- **File:** `src/styles/global.css`
- **What:** Define CSS custom properties on `:root` for all semantic colors (light values) and override them under `.dark` (dark values). Update the `html` and `body` rules to use these variables instead of hardcoded hex values. Add a `prose-dark` class (or dark variant within `prose-light`) with dark-mode typography colors. Add `transition: background-color 0.2s, color 0.2s` on `html` for smooth theme switching. Update `::selection` to use CSS variables.
- **Definition of done:** `global.css` defines `:root` variables for all semantic colors (`--color-background`, `--color-background-surface`, `--color-background-elevated`, `--color-background-hover`, `--color-foreground`, `--color-foreground-secondary`, `--color-foreground-muted`, `--color-foreground-inverse`) and `.dark` overrides. The `html` rule uses `var(--color-background)` and `var(--color-foreground)`. A `prose-dark` class exists with dark-appropriate typography colors. Theme transitions are smooth.

### TASK-1-3: Update Tailwind config to reference CSS custom properties

- **File:** `tailwind.config.js`
- **What:** Update the `colors` configuration to reference the CSS custom properties defined in TASK-1-2. For example: `background: { DEFAULT: 'var(--color-background)', surface: 'var(--color-background-surface)', elevated: 'var(--color-background-elevated)', hover: 'var(--color-background-hover)' }` and similarly for `foreground`. This ensures all existing `bg-background`, `text-foreground-muted`, etc. classes automatically switch when the `dark` class is toggled.
- **Definition of done:** All existing Tailwind classes (`bg-background`, `bg-background-surface`, `text-foreground`, `text-foreground-muted`, `text-foreground-secondary`, `border-background-elevated`, etc.) render in the correct color for both light and dark modes when the `dark` class is toggled on `<html>`. No `dark:` variant classes are needed for basic color switching — the CSS variables handle it.

### TASK-1-TEST-1: Unit test for CSS custom property definitions

- **File:** `tests/features/feat_add_dark_mode/story-1.test.ts`
- **What:** Test that `global.css` contains `:root` variable definitions for all 8 semantic color tokens. Test that `.dark` selector overrides all 8 variables. Test that `tailwind.config.js` references CSS custom properties (not hardcoded hex values) for `background` and `foreground` color tokens. Test that `darkMode: 'class'` is set in the Tailwind config.
- **Definition of done:** All assertions pass. Coverage >80% for config/CSS validation logic.

### TASK-1-TEST-2: E2E test for dark mode CSS foundation

- **File:** `e2e/features/feat_add_dark_mode/story-1.spec.ts`
- **What:** Navigate to homepage. Verify that `<html>` or `<body>` has `transition` CSS property for smooth theme switching. Verify that computed `background-color` on `body` is `#FAFAFA` (light) by default. Add `dark` class to `<html>`, verify computed `background-color` changes to the dark value. Remove `dark` class, verify it reverts.
- **Definition of done:** Test passes. CSS custom properties correctly switch values when `dark` class is toggled.

---

## Story 2: Theme Toggle Component & Persistence

### TASK-2-1: Create theme utility module

- **File:** `src/utils/theme.ts`
- **What:** Create a TypeScript module with the following exported functions:
  - `getStoredTheme(): 'light' | 'dark' | null` — reads `localStorage.getItem('theme')`
  - `setStoredTheme(theme: 'light' | 'dark'): void` — writes to `localStorage`
  - `getSystemPreference(): 'light' | 'dark'` — reads `window.matchMedia('(prefers-color-scheme: dark)')`
  - `getEffectiveTheme(): 'light' | 'dark'` — returns stored theme if set, otherwise system preference
  - `applyTheme(theme: 'light' | 'dark'): void` — adds/removes `dark` class on `document.documentElement`
  - `toggleTheme(): 'light' | 'dark'` — toggles between light and dark, applies, and persists
- **Definition of done:** Module exports all 6 functions. All functions are pure/idiomatic TypeScript. `applyTheme` correctly toggles the `dark` class. `toggleTheme` persists the new theme to localStorage.

### TASK-2-2: Create ThemeToggle component

- **File:** `src/components/ThemeToggle.astro`
- **What:** Create an Astro component that renders a button with a sun icon (visible in dark mode) and moon icon (visible in light mode). The button has `aria-label="Toggle dark mode"`. Include an inline `<script>` that:
  1. On mount, calls `getEffectiveTheme()` and applies it
  2. On click, calls `toggleTheme()` and updates the icon visibility
  3. Listens for `prefers-color-scheme` changes and updates if no stored preference
- The icons should be simple SVGs (sun: circle with rays; moon: crescent). Use `currentColor` for stroke/fill so they inherit text color.
- **Definition of done:** Component renders a button with sun/moon SVG icons. Clicking toggles the `dark` class on `<html>` and persists to localStorage. Icons swap visibility correctly. Button is keyboard-accessible.

### TASK-2-3: Add FOUC-prevention script to BaseLayout

- **File:** `src/layouts/BaseLayout.astro`
- **What:** Add an inline `<script is:inline>` in the `<head>` section (before any CSS links) that:
  1. Reads `localStorage.getItem('theme')`
  2. If no stored preference, checks `window.matchMedia('(prefers-color-scheme: dark)')`
  3. If the effective theme is dark, adds `dark` class to `document.documentElement` immediately
  4. This script must be `is:inline` and not deferred to prevent FOUC
- **Definition of done:** The FOUC-prevention script is the first element in `<head>` (or at least before the CSS links). When a user with dark preference loads the page, no flash of light theme occurs. The script is synchronous and runs before paint.

### TASK-2-4: Integrate ThemeToggle into BaseLayout header

- **File:** `src/layouts/BaseLayout.astro`
- **What:** Import `ThemeToggle.astro` and place it in the header `<div>` after the SearchBar. The header layout should be: `[Logo] [spacer] [SearchBar] [ThemeToggle]`. Ensure the toggle is properly aligned with the search bar on both mobile and desktop.
- **Definition of done:** ThemeToggle appears in the header on all pages. It is visually aligned with the SearchBar. On mobile, it appears alongside the mobile search toggle. The header remains responsive.

### TASK-2-TEST-1: Unit tests for theme utility

- **File:** `tests/features/feat_add_dark_mode/story-2.test.ts`
- **What:** Test `getStoredTheme`, `setStoredTheme`, `getSystemPreference`, `getEffectiveTheme`, `applyTheme`, and `toggleTheme`. Mock `localStorage` and `window.matchMedia`. Verify:
  - `getStoredTheme` returns `null` when no theme stored, `'light'` or `'dark'` when set
  - `setStoredTheme` writes to localStorage
  - `getSystemPreference` returns `'dark'` when system prefers dark
  - `getEffectiveTheme` prioritizes stored over system preference
  - `applyTheme` adds/removes `dark` class on `document.documentElement`
  - `toggleTheme` toggles and persists
- **Definition of done:** All assertions pass. Coverage >80% for `theme.ts`.

### TASK-2-TEST-2: E2E tests for theme toggle and persistence

- **File:** `e2e/features/feat_add_dark_mode/story-2.spec.ts`
- **What:** Test the following scenarios:
  1. Toggle button is visible in the header
  2. Clicking toggle switches from light to dark (verify `dark` class on `<html>`)
  3. Clicking again switches back to light (verify `dark` class removed)
  4. Theme persists across page navigation (navigate to `/blog`, verify theme is still dark)
  5. Theme persists across browser restart (set localStorage, reload, verify dark mode)
  6. System preference is respected when no stored preference (emulate `prefers-color-scheme: dark`)
  7. No FOUC: verify `<html>` has `dark` class before first paint when dark is preferred
- **Definition of done:** All E2E test scenarios pass.

---

## Story 3: Dark Mode Styling for Pages & Components

### TASK-3-1: Add dark mode styles to BaseLayout and global elements

- **File:** `src/layouts/BaseLayout.astro`, `src/styles/global.css`
- **What:** Update `BaseLayout.astro` body classes to use CSS variable-based colors (already handled by TASK-1-3, but verify). Add `dark:` variant classes for any hardcoded colors in BaseLayout (e.g., borders, backgrounds). Update `global.css` `::selection` to use CSS variables. Ensure the `<html>` element has `transition-colors duration-200` for smooth switching.
- **Definition of done:** BaseLayout renders correctly in both light and dark modes. No hardcoded light-only colors remain. Selection colors adapt to theme.

### TASK-3-2: Add dark mode styles to page templates

- **Files:** `src/pages/index.astro`, `src/pages/blog.astro`, `src/pages/blog/[slug].astro`, `src/pages/tags/index.astro`, `src/pages/tags/[tag].astro`, `src/pages/admin/write.astro`
- **What:** Review each page template and add `dark:` variant classes where needed. Since the CSS variable approach from TASK-1-3 handles most color switching automatically, focus on:
  - Any hardcoded hex colors (e.g., `border-t border-background-elevated` — verify these work via CSS vars)
  - Any inline styles with hardcoded colors
  - The `prose-light` class on article content — ensure `prose-dark` is applied when in dark mode (may need a conditional class or CSS approach)
  - Border colors, hover states, and focus rings that may need explicit `dark:` overrides
- **Definition of done:** All pages render correctly in dark mode with proper contrast and readability. No light-on-light or dark-on-dark text issues.

### TASK-3-3: Add dark mode styles to components

- **Files:** `src/components/Logo.astro`, `src/components/SearchBar.astro`, `src/components/SocialLinks.astro`, `src/components/LikeButton.astro`, `src/components/Editor.astro`
- **What:** Review each component and add `dark:` variant classes where needed. Key areas:
  - **SearchBar**: Input fields (`bg-background-surface`, `border-background-elevated`) should work via CSS vars, but verify focus rings and mobile overlay backdrop. Add `dark:` overrides for any hardcoded colors.
  - **LikeButton**: The heart icon highlight (`ring-foreground-muted`) needs a dark variant. Verify `currentColor`-based SVGs work in both modes.
  - **SocialLinks**: Focus rings (`focus-visible:ring-foreground`, `focus-visible:ring-offset-background`) need dark variants.
  - **Editor**: Toolbar (`bg-background/95`), buttons, and content area need dark styling. The editor's inline styles and dynamic classes need dark variants.
  - **Logo**: Verify `text-foreground` and `text-foreground-muted` work via CSS vars.
- **Definition of done:** All components render correctly in dark mode. Interactive states (hover, focus, active) are visible and accessible in both themes.

### TASK-3-4: Add dark prose styling for article content

- **File:** `src/styles/global.css`
- **What:** Create a `prose-dark` class (or use a dark-mode-aware approach) that provides dark-mode typography for the `prose-light` content area. This should cover:
  - Headings: light text on dark background
  - Paragraphs: light secondary text
  - Links: light colors with hover states
  - Code blocks: dark elevated background with light text
  - Inline code: subtle dark background
  - Blockquotes: adapted border and text colors for dark mode
  - Images: ensure no overflow issues
- The approach: either define `.dark .prose-light` overrides, or create a separate `prose-dark` class and conditionally apply it. The simplest approach is `.dark .prose-light` CSS overrides in `global.css`.
- **Definition of done:** Article content in `blog/[slug].astro` is fully readable in dark mode. Headings, paragraphs, links, code, blockquotes, and images all have appropriate dark-mode styling.

### TASK-3-TEST-1: E2E test for dark mode visual correctness

- **File:** `e2e/features/feat_add_dark_mode/story-3.spec.ts`
- **What:** Test the following in dark mode:
  1. Homepage renders with dark background and light text
  2. Blog listing page renders correctly in dark mode
  3. Individual blog post renders correctly (headings, paragraphs, links, code blocks)
  4. Tags pages render correctly in dark mode
  5. SearchBar input and overlay render correctly in dark mode
  6. Logo text is visible in dark mode
  7. Social links are visible and hoverable in dark mode
  8. Like button is visible in dark mode
- For each test: toggle dark mode, verify `dark` class on `<html>`, then check computed styles or visual indicators.
- **Definition of done:** All E2E tests pass. No visual regressions in dark mode.

---

## Story 4: Dynamic Theme Integration (Giscus, PWA, Meta)

### TASK-4-1: Update Giscus theme dynamically

- **File:** `src/components/Comments.astro`
- **What:** Modify the Giscus initialization script to detect the current theme and pass it to Giscus. Add a `data-theme` attribute based on the effective theme (`'light'` or `'dark'`). Also add a `MutationObserver` or event listener that watches for theme changes and sends a message to the Giscus iframe to update its theme via `postMessage`. The Giscus theme values should be `'light'` for light mode and `'dark'` (or `'dark_dimmed'`) for dark mode.
- **Definition of done:** Giscus comments render in light theme when light mode is active and dark theme when dark mode is active. Toggling the theme mid-session updates the Giscus widget without requiring a page reload.

### TASK-4-2: Update theme-color meta tag dynamically

- **File:** `src/layouts/BaseLayout.astro`
- **What:** Change the static `<meta name="theme-color" content="#FAFAFA" />` to use a dynamic approach. Add an inline script (or extend the FOUC-prevention script) that updates `document.querySelector('meta[name="theme-color"]')` whenever the theme changes. Light mode: `#FAFAFA`. Dark mode: `#09090B` (or the dark background color). Also update the `apple-mobile-web-app-status-bar-style` meta tag: `default` for light, `black-translucent` for dark.
- **Definition of done:** The `theme-color` meta tag updates dynamically when toggling themes. On initial load with dark preference, the meta tag is set to the dark color before first paint.

### TASK-4-3: Add dark mode support to offline page

- **File:** `public/offline.html`
- **What:** Update `offline.html` to include the same FOUC-prevention inline script from TASK-2-3. Add CSS that respects the `dark` class on `<html>` for dark mode styling. Ensure the offline page uses the same semantic color tokens (or inline dark mode CSS) so it renders correctly in dark mode when offline.
- **Definition of done:** The offline page renders in dark mode when the user's preference is dark. The FOUC-prevention script runs correctly on the offline page.

### TASK-4-4: Update service worker to cache theme-related assets

- **File:** `public/sw.js`
- **What:** Ensure the service worker caches the FOUC-prevention inline script (if externalized) and any theme-related CSS. Since the FOUC script is inline in the HTML, it's already cached with the page. Verify that the service worker's cache list includes all CSS files needed for dark mode rendering. No changes needed if the FOUC script is inline and CSS is in global.css (already cached).
- **Definition of done:** Offline pages render correctly in dark mode. The service worker does not interfere with theme switching. Cached pages include the FOUC-prevention script.

### TASK-4-TEST-1: E2E test for dynamic theme integration

- **File:** `e2e/features/feat_add_dark_mode/story-4.spec.ts`
- **What:** Test the following:
  1. Giscus iframe receives correct theme on initial load (light or dark)
  2. Toggling theme sends a message to Giscus to update its theme
  3. `theme-color` meta tag updates when toggling between light and dark
  4. `theme-color` meta tag is correct on initial load with dark preference
  5. Offline page renders in dark mode when dark preference is stored
- **Definition of done:** All E2E tests pass.

---

## Story 5: Testing

### TASK-5-TEST-1: Unit tests for theme utility module

- **File:** `tests/features/feat_add_dark_mode/story-5.test.ts`
- **What:** Comprehensive unit tests for `src/utils/theme.ts`:
  - `getStoredTheme`: returns `null` when no theme, returns `'light'` or `'dark'` when set
  - `setStoredTheme`: writes correct value to localStorage
  - `getSystemPreference`: returns `'dark'` when system prefers dark, `'light'` otherwise
  - `getEffectiveTheme`: prioritizes stored theme over system preference; falls back to system when no stored preference
  - `applyTheme`: adds `dark` class for dark theme, removes it for light theme
  - `toggleTheme`: toggles from light to dark and back, persists, and applies
  - Edge cases: corrupted localStorage values, missing `matchMedia` API
- **Definition of done:** All assertions pass. Coverage >80% for `theme.ts`.

### TASK-5-TEST-2: E2E test for full dark mode flow

- **File:** `e2e/features/feat_add_dark_mode/story-5.spec.ts`
- **What:** End-to-end integration test covering the complete dark mode flow:
  1. Fresh visit (no stored preference) with system light → renders in light mode
  2. Fresh visit with system dark → renders in dark mode (no FOUC)
  3. Toggle to dark → dark mode active, stored as `'dark'`
  4. Navigate to another page → dark mode persists
  5. Toggle back to light → light mode active, stored as `'light'`
  6. Clear localStorage, set system to dark → dark mode active
  7. Verify all pages (home, blog, post, tags) render correctly in both themes
  8. Verify keyboard accessibility of toggle (Tab to focus, Enter/Space to activate)
- **Definition of done:** All E2E scenarios pass. No regressions in existing E2E tests.

### TASK-5-TEST-3: Build verification

- **File:** N/A (CLI command)
- **What:** Run `astro check` and `astro build` to verify that:
  - No TypeScript errors are introduced
  - Build completes successfully
  - All pages are generated correctly
  - No CSS class conflicts or missing styles
- **Definition of done:** `astro check` reports 0 errors, 0 warnings. `astro build` completes with exit code 0. All expected pages are generated.