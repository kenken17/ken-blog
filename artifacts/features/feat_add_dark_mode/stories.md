# Feature: Add Dark Mode — User Stories

## Story 1: Tailwind Dark Mode Configuration & CSS Foundation

As a developer, I want the Tailwind configuration and global CSS to support dark mode via the `class` strategy so that all components can use `dark:` variant classes and the theme switches smoothly.

Acceptance criteria:

- `tailwind.config.js` has `darkMode: 'class'` enabled
- Dark color tokens are defined in `tailwind.config.js` under the existing `background` and `foreground` semantic names (e.g., `background.DEFAULT` remains `#FAFAFA` in light mode; dark mode uses `dark` variant overrides or CSS custom properties)
- `global.css` includes dark mode base styles: dark background, dark foreground, dark selection colors
- A `prose-dark` component class (or dark variant of `prose-light`) is defined in `global.css` with appropriate dark-mode typography colors
- Theme transitions are smooth (CSS `transition` on `background-color` and `color` on `html` or `body`)

## Story 2: Theme Toggle Component & Persistence

As a reader, I want a toggle switch in the header to switch between light and dark modes so that I can choose my preferred reading experience.

Acceptance criteria:

- A `ThemeToggle` component renders a sun/moon icon button in the BaseLayout header, positioned next to the SearchBar
- Clicking the toggle switches between light and dark mode immediately
- The selected theme is persisted in `localStorage` under a `theme` key (`"light"` or `"dark"`)
- On page load, the theme respects the stored preference; if none exists, it respects the system `prefers-color-scheme` media query
- A FOUC-prevention inline `<script>` in `<head>` sets the `dark` class on `<html>` before rendering, so there is no flash of light theme when the user prefers dark
- The toggle component is a client-side island (vanilla JS `<script>` in Astro) to avoid hydration mismatches — no React/Vue/Svelte framework dependency
- The toggle is keyboard-accessible (Enter/Space to activate) and has an appropriate `aria-label`

## Story 3: Dark Mode Styling for Pages & Components

As a reader, I want all pages and components to render correctly in dark mode so that text is readable, backgrounds are dark, and interactive elements are usable.

Acceptance criteria:

- All pages (`index.astro`, `blog.astro`, `blog/[slug].astro`, `tags/index.astro`, `tags/[tag].astro`, `admin/write.astro`) have `dark:` variant classes for backgrounds, text, borders, and interactive states
- All components (`Logo.astro`, `SearchBar.astro`, `SocialLinks.astro`, `LikeButton.astro`, `Editor.astro`) have `dark:` variant classes
- `BaseLayout.astro` body has `dark:bg-background dark:text-foreground` (or equivalent) classes
- The SearchBar mobile overlay has a dark background in dark mode
- The Editor toolbar and content area have dark styling
- Blockquotes, code blocks, and inline code in `prose-light`/`prose-dark` are readable in dark mode
- No hardcoded light-only colors remain in any component or page template (all use semantic tokens or `dark:` overrides)

## Story 4: Dynamic Theme Integration (Giscus, PWA, Meta)

As a reader using dark mode, I want the Giscus comments, browser chrome (theme-color), and PWA experience to also reflect the dark theme so that the entire experience is consistent.

Acceptance criteria:

- The Giscus comment widget switches its theme to `dark` (or `dark_dimmed`) when dark mode is active, and back to `light` when toggled off
- The `<meta name="theme-color">` in BaseLayout updates dynamically to `#09090B` (dark background) when dark mode is active and `#FAFAFA` (light background) when light
- The PWA `manifest.json` `theme_color` and `background_color` remain `#FAFAFA` (documented as static per manifest spec — the dynamic `theme-color` meta tag handles runtime theming)
- The offline fallback page (`public/offline.html`) supports dark mode via the same `class` strategy
- The service worker (`public/sw.js`) caches the FOUC-prevention script so offline pages also respect dark mode

## Story 5: Testing

As a developer, I want comprehensive unit and E2E tests for the dark mode feature so that I can verify correctness and prevent regressions.

Acceptance criteria:

- Unit tests cover: theme utility functions (localStorage read/write, system preference detection, class toggling logic)
- E2E tests cover: toggle visibility, toggle click switches theme, theme persists across page navigation, system `prefers-color-scheme: dark` is respected on first visit, FOUC-prevention script runs before paint
- All tests pass with `vitest` (unit) and `playwright` (E2E)
- Test coverage for theme-related utility files exceeds 80%