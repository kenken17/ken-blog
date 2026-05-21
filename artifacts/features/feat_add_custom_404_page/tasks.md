# Tasks — feat_add_custom_404_page

## Story 1: Create the Custom 404 Page Template

### TASK-1-1: Create 404.astro page file
- **File:** `src/pages/404.astro`
- **Change:** Create a new Astro page that renders a custom 404 error page
- **Details:**
  - Import and use `BaseLayout.astro` as the wrapper
  - Add a prominent "404" heading with a "Page Not Found" subheading
  - Add a friendly message explaining the error to users
  - Use Tailwind CSS classes consistent with the blog design
  - Support dark/light mode via existing CSS variable system
- **Definition of Done:** Page renders at `404.astro`, displays heading and message, uses BaseLayout

### TASK-1-2: Configure 404 page metadata
- **File:** `src/pages/404.astro`
- **Change:** Add proper meta tags and SEO configuration
- **Details:**
  - Set page title to "404 - Page Not Found | Ken's Blog"
  - Set appropriate meta description
  - Set canonical URL to avoid indexing the 404 page
  - Use `generateMetaTags` utility for consistency
- **Definition of Done:** Page has proper title, description, and canonical URL configured

### TASK-1-3: Add back-to-home navigation
- **File:** `src/pages/404.astro`
- **Change:** Add a prominent "Back to Home" button/link
- **Details:**
  - Add a styled button/link that navigates to the homepage
  - Use consistent styling with other page links
  - Ensure the link is keyboard accessible
- **Definition of Done:** "Back to Home" link is visible and navigates to `/`

---

## Story 2: Add Navigation Options to the 404 Page

### TASK-2-1: Fetch recent posts for 404 page
- **File:** `src/pages/404.astro`
- **Change:** Add content collection query to fetch recent posts
- **Details:**
  - Import `getCollection` from `astro:content`
  - Query the posts collection, filtering out drafts
  - Sort by publication date (newest first)
  - Limit to 3 recent posts for display
- **Definition of Done:** 404 page has access to recent posts data

### TASK-2-2: Add recent posts section to 404 page
- **File:** `src/pages/404.astro`
- **Change:** Render recent posts with links
- **Details:**
  - Create a "Recent Posts" section below the error message
  - Display each post with title, date, and link to the post slug
  - Use consistent styling with the blog page
  - Make posts clickable to navigate to the post
- **Definition of Done:** Recent posts are displayed with titles, dates, and working links

### TASK-2-3: Add SearchBar component to 404 page
- **File:** `src/pages/404.astro`
- **Change:** Import and render the SearchBar component
- **Details:**
  - Import `SearchBar` from `../components/SearchBar.astro`
  - Place the search bar prominently on the page
  - Ensure it functions correctly for searching content
- **Definition of Done:** SearchBar component is rendered and functional

### TASK-2-4: Add navigation links section
- **File:** `src/pages/404.astro`
- **Change:** Add main navigation links
- **Details:**
  - Add links to Home (`/`), Blog (`/blog`), and Tags (`/tags`)
  - Style consistently with other navigation elements
  - Ensure links are accessible and keyboard navigable
- **Definition of Done:** Navigation links to Home, Blog, and Tags are present and functional

---

## Story 3: Ensure Responsive Design and Accessibility

### TASK-3-1: Implement responsive layout
- **File:** `src/pages/404.astro`
- **Change:** Ensure responsive design using Tailwind CSS
- **Details:**
  - Use responsive Tailwind classes (e.g., `md:`, `lg:` breakpoints)
  - Ensure layout works on mobile (single column), tablet, and desktop
  - Test that content doesn't overflow on small screens
  - Use `max-w-3xl mx-auto` container for consistency with other pages
- **Definition of Done:** Layout is responsive across mobile, tablet, and desktop viewports

### TASK-3-2: Ensure accessibility compliance
- **File:** `src/pages/404.astro`
- **Change:** Add accessibility attributes and proper semantics
- **Details:**
  - Use proper heading hierarchy (h1 for 404, h2 for sections)
  - Add `aria-label` attributes where needed
  - Ensure all interactive elements are keyboard accessible
  - Add `role` attributes for non-semantic elements if needed
- **Definition of Done:** Page passes basic accessibility checks (heading hierarchy, keyboard navigation)

### TASK-3-3: Verify dark mode support
- **File:** `src/pages/404.astro`
- **Change:** Ensure dark mode works correctly
- **Details:**
  - Use CSS variables and Tailwind dark mode classes
  - Test both light and dark themes visually
  - Ensure text contrast meets accessibility standards
- **Definition of Done:** 404 page looks correct in both light and dark modes

---

## Story 4: Test the 404 Page Functionality

### TASK-4-TEST-1: Write unit tests for 404 page
- **File:** `tests/features/feat_add_custom_404_page/story-1.test.ts`
- **Change:** Create unit tests for the 404 page
- **Details:**
  - Test that the page renders with "404" heading
  - Test that "Page Not Found" message is present
  - Test that "Back to Home" link is present
  - Test that search bar component is rendered
  - Test that recent posts section is rendered
  - Test that navigation links are present
- **Definition of Done:** All unit tests pass, covering Story 1 and Story 2 requirements

### TASK-4-TEST-2: Write e2e tests for 404 page
- **File:** `e2e/features/feat_add_custom_404_page/story-1.spec.ts`
- **Change:** Create e2e tests for the 404 page
- **Details:**
  - Test that visiting a non-existent URL returns the 404 page
  - Test that the 404 page displays correctly
  - Test that "Back to Home" link navigates to homepage
  - Test that navigation links work correctly
  - Test responsive behavior at different viewports
- **Definition of Done:** All e2e tests pass, covering Story 1, Story 2, and Story 3 requirements

### TASK-4-TEST-3: Write e2e tests for responsive behavior
- **File:** `e2e/features/feat_add_custom_404_page/story-3.spec.ts`
- **Change:** Create e2e tests for responsive design
- **Details:**
  - Test 404 page layout at mobile viewport (375px)
  - Test 404 page layout at tablet viewport (768px)
  - Test 404 page layout at desktop viewport (1280px)
  - Verify content doesn't overflow at any viewport
- **Definition of Done:** All responsive e2e tests pass
