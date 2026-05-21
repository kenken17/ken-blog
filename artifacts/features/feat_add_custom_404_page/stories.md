# User Stories — feat_add_custom_404_page

## Story 1: Create the Custom 404 Page Template

**As a** blog visitor,
**I want** to see a helpful 404 error page when I encounter broken links or mistyped URLs,
**so that** I can easily navigate to other content instead of leaving the site.

**Acceptance criteria:**
- A new `404.astro` file is created in `src/pages/`
- The page displays a clear "404 - Page Not Found" heading
- The page includes a friendly message explaining the error
- The page uses the existing `BaseLayout.astro` for consistent styling
- The page is visually consistent with the overall blog design (dark/light mode support)
- The page returns a proper HTTP 404 status code

---

## Story 2: Add Navigation Options to the 404 Page

**As a** blog visitor,
**I want** the 404 page to include navigation options like links to popular posts, categories, and a search bar,
**so that** I can find content I'm interested in without leaving the site.

**Acceptance criteria:**
- The 404 page includes a search bar component (reusing `SearchBar.astro`)
- The 404 page displays links to recent/popular blog posts (fetched from content collection)
- The 404 page includes navigation links to main sections (Home, Blog, Tags)
- All navigation links are functional and lead to the correct pages
- The search bar allows users to search for content directly from the 404 page

---

## Story 3: Ensure Responsive Design and Accessibility

**As a** blog administrator,
**I want** the 404 page to be responsive and accessible across all device sizes,
**so that** it provides a seamless user experience for all visitors.

**Acceptance criteria:**
- The 404 page is fully responsive on mobile, tablet, and desktop viewports
- The layout adapts gracefully to different screen sizes using Tailwind CSS
- The page follows accessibility best practices (proper heading hierarchy, ARIA labels, keyboard navigation)
- The page maintains visual consistency with other pages (colors, typography, spacing)
- The page loads quickly without significant performance impact

---

## Story 4: Test the 404 Page Functionality

**As a** developer,
**I want** comprehensive tests for the 404 page,
**so that** I can ensure it works correctly and maintain quality over time.

**Acceptance criteria:**
- Unit tests verify the 404 page renders correctly with expected content
- Unit tests verify navigation links are present and functional
- E2e tests verify the 404 page is served for non-existent routes
- E2e tests verify responsive behavior across different viewports
- All tests pass with >80% coverage for the 404 page files
