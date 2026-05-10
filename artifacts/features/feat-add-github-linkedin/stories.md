# feat_add_github_linkedin — User Stories

## Story 1: Display GitHub and LinkedIn icons under the tagline

**As a** blog visitor,  
**I want** to see GitHub and LinkedIn icons displayed under the tagline on the landing page,  
**So that** I can easily discover and visit the author's social profiles.

### Acceptance criteria

- GitHub and LinkedIn icons appear below the tagline text ("A place for thoughts on engineering, design, and technology.") in the hero section of the landing page.
- The GitHub icon links to `https://github.com/kenken17`.
- The LinkedIn icon links to `https://www.linkedin.com/in/tze-ken-lee/`.
- Icons use inline SVGs (no external icon library dependency) styled with the existing design tokens (foreground-muted color, Space Grotesk font family, consistent sizing).
- Icons are horizontally centered and spaced evenly with a small gap between them.
- Icons have a subtle hover effect (e.g., color transition to foreground) consistent with the site's existing interactive elements.

---

## Story 2: Links open in new tab with proper accessibility

**As a** blog visitor,  
**I want** the social profile links to open in a new browser tab,  
**So that** I don't lose my place on the blog when visiting an external profile.

### Acceptance criteria

- Both links include `target="_blank"` and `rel="noopener noreferrer"` attributes.
- Each link has an `aria-label` describing its destination (e.g., `aria-label="GitHub profile"` and `aria-label="LinkedIn profile"`).
- The icons are keyboard-focusable and show a visible focus ring consistent with the site's focus styles.
- The component renders correctly on mobile (icons remain centered and tappable) and desktop.