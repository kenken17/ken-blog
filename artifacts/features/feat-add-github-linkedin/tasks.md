# feat_add_github_linkedin — Task List

## TASK-1-1: Create SocialLinks Astro component

- **File:** `src/components/SocialLinks.astro`
- **What:** Create a new Astro component that renders GitHub and LinkedIn icons as inline SVGs inside anchor tags:
  - GitHub link: `href="https://github.com/kenken17"`, `target="_blank"`, `rel="noopener noreferrer"`, `aria-label="GitHub profile"`
  - LinkedIn link: `href="https://www.linkedin.com/in/tze-ken-lee/"`, `target="_blank"`, `rel="noopener noreferrer"`, `aria-label="LinkedIn profile"`
  - Use the GitHub Octicon (24×24 viewBox) and LinkedIn standard icon (24×24 viewBox) as inline SVG paths.
  - Style icons with Tailwind: `text-foreground-muted hover:text-foreground transition-colors duration-200` for consistent hover behavior matching existing interactive elements (e.g., tag links in blog posts).
  - Size icons at `w-6 h-6` (24px) for comfortable tap targets on mobile.
  - Wrap both links in a flex container: `flex items-center justify-center gap-4`.
  - Add `focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background outline-none` for keyboard accessibility.
- **Definition of done:** Component renders two styled, accessible icon links. No external dependencies added.

---

## TASK-1-2: Integrate SocialLinks into the landing page hero section

- **File:** `src/pages/index.astro`
- **What:** Import `SocialLinks.astro` and place it immediately after the tagline paragraph (`<p class="text-xl ...">A place for thoughts...</p>`) inside the hero section's centered `<div>`. Add `mt-6` margin-top on the component to create visual separation from the tagline.
- **Definition of done:** GitHub and LinkedIn icons appear below the tagline on the landing page. Layout is centered and responsive. No layout shift or visual regression to existing hero content.

---

## TASK-2-1: Verify accessibility and link behavior

- **File:** Manual verification on `src/pages/index.astro` and `src/components/SocialLinks.astro`
- **What:** Confirm the following:
  - Both links have `target="_blank"` and `rel="noopener noreferrer"`.
  - Both links have descriptive `aria-label` attributes.
  - Icons are keyboard-navigable (Tab key reaches each link, Enter activates).
  - Focus ring is visible on keyboard focus.
  - Icons are properly sized and spaced on mobile (≥44px tap target area) and desktop.
  - Hover color transition works smoothly.
  - Links navigate to the correct URLs.
- **Definition of done:** All accessibility and link behavior criteria pass. Build succeeds with `astro check` and `astro build` reporting zero errors.