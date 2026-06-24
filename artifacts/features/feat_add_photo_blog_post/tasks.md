# Tasks for feat_add_photo_blog_post

## Story 1: Content Model for Photo Blog Posts

### TASK-1-1: Define Photo Blog Post Schema
- File: `src/content/config.ts`
- Change: Add new content collection schema for photo blog posts with fields:
  - title (string, required)
  - description (string, required)
  - images (array of objects with url, alt, caption)
  - pubDate (date, required)
  - tags (array of strings, optional)
  - draft (boolean, optional, default false)
- Definition of done: Schema compiles without errors, supports required and optional fields

### TASK-1-2: Create Sample Photo Blog Post
- File: `src/content/posts/photo-post-sample.md`
- Change: Create sample photo blog post with proper frontmatter including multiple images
- Definition of done: Sample post exists and validates against schema

### TASK-1-3: Update Post Type Detection
- File: `src/utils/posts.ts`
- Change: Add utility function to detect if a post is a photo blog post based on schema
- Definition of done: Function correctly identifies photo posts vs regular posts

## Story 2: Photo Gallery Display Component

### TASK-2-1: Create PhotoGallery Component
- File: `src/components/PhotoGallery.astro`
- Change: Create new Astro component that:
  - Accepts images array prop
  - Renders responsive grid layout with Tailwind
  - Supports lightbox/modal viewing on image click
  - Displays image captions
  - Uses lazy loading for images
- Definition of done: Component renders correctly with sample data

### TASK-2-2: Add Lightbox Functionality
- File: `src/components/PhotoGallery.astro`
- Change: Implement lightbox/modal for full-size image viewing with:
  - Close button and escape key support
  - Navigation between images
  - Overlay background
  - Keyboard accessibility
- Definition of done: Lightbox opens/closes correctly, keyboard accessible

### TASK-2-3: Add Responsive Grid Styles
- File: `src/components/PhotoGallery.astro`
- Change: Implement responsive grid using Tailwind:
  - Mobile: 1 column
  - Tablet: 2 columns
  - Desktop: 3-4 columns
- Definition of done: Grid adapts correctly to different screen sizes

## Story 3: Create Photo Blog Post Page

### TASK-3-1: Create Photo Post Form Component
- File: `src/components/PhotoPostForm.astro`
- Change: Create form component with:
  - Title input field
  - Description textarea
  - Image upload area with drag-and-drop
  - Image preview thumbnails
  - Reorder images functionality
- Definition of done: Form renders with all required fields

### TASK-3-2: Implement Image Upload Logic
- File: `src/components/PhotoPostForm.astro`
- Change: Add client-side JavaScript for:
  - File selection via input and drag-and-drop
  - Image preview generation
  - File validation (size, type)
  - Upload to server endpoint
- Definition of done: Images can be uploaded and previewed

### TASK-3-3: Create Photo Post API Endpoint
- File: `src/pages/api/photo-post.ts`
- Change: Create API endpoint to handle photo post creation:
  - Accept POST request with form data
  - Validate required fields
  - Save images to public/images/posts/
  - Create markdown file in src/content/posts/
- Definition of done: API endpoint processes photo post creation correctly

## Story 4: Individual Photo Blog Post Page

### TASK-4-1: Create Photo Post Page
- File: `src/pages/blog/[slug].astro`
- Change: Update existing blog post page to:
  - Detect photo blog posts
  - Render PhotoGallery component for photo posts
  - Display title and description
  - Maintain existing functionality for regular posts
- Definition of done: Photo posts render with gallery, regular posts unchanged

### TASK-4-2: Add Photo Post SEO Metadata
- File: `src/pages/blog/[slug].astro`
- Change: Add SEO metadata for photo posts:
  - Title tag
  - Meta description
  - Canonical URL
  - Open Graph tags
  - JSON-LD structured data
- Definition of done: SEO metadata is correct and valid

### TASK-4-3: Add Photo Post Navigation
- File: `src/pages/blog/[slug].astro`
- Change: Add navigation elements:
  - Back to blog link
  - Previous/next post navigation (if applicable)
- Definition of done: Navigation works correctly

## Story 5: Blog List Integration

### TASK-5-1: Update Blog List for Photo Posts
- File: `src/pages/blog.astro`
- Change: Update blog list to:
  - Display photo blog posts with thumbnail
  - Add visual indicator (camera icon) for photo posts
  - Maintain consistent styling with regular posts
- Definition of done: Photo posts appear correctly in blog list

### TASK-5-2: Add Photo Post Thumbnail
- File: `src/pages/blog.astro`
- Change: Extract first image from photo posts as thumbnail
- Definition of done: Thumbnails display correctly for photo posts

### TASK-5-3: Update Search Index
- File: `scripts/generate-search-index.ts`
- Change: Update search index generation to include photo posts
- Definition of done: Photo posts appear in search results

## Story 6: Responsive Design and Performance

### TASK-6-1: Implement Lazy Loading
- File: `src/components/PhotoGallery.astro`
- Change: Add lazy loading to images using native loading="lazy" attribute
- Definition of done: Images load lazily, improving performance

### TASK-6-2: Optimize Image Delivery
- File: `src/components/PhotoGallery.astro`
- Change: Implement responsive image attributes:
  - srcset for different sizes
  - sizes attribute for viewport detection
- Definition of done: Images are optimized for different viewports

### TASK-6-3: Add Accessibility Features
- File: `src/components/PhotoGallery.astro`
- Change: Ensure accessibility:
  - Alt text on all images
  - Keyboard navigation for lightbox
  - Focus states
  - ARIA labels
- Definition of done: Component meets accessibility standards

### TASK-6-4: Performance Testing
- File: Various
- Change: Test performance impact:
  - Measure page load times with photo posts
  - Verify no layout shift
  - Check bundle size impact
- Definition of done: Performance impact is minimal

## Test Tasks

### TASK-1-TEST-1: Test Photo Post Schema
- File: `tests/features/feat_add_photo_blog_post/story-1.test.ts`
- Type: Unit test
- Definition of done: All schema validation tests pass

### TASK-2-TEST-1: Test Photo Gallery Component
- File: `tests/features/feat_add_photo_blog_post/story-2.test.ts`
- Type: Unit test
- Definition of done: Component renders correctly with sample data

### TASK-2-TEST-2: Test Photo Gallery E2E
- File: `e2e/features/feat_add_photo_blog_post/story-2.spec.ts`
- Type: E2E test
- Definition of done: Gallery displays correctly and lightbox works

### TASK-3-TEST-1: Test Photo Post Form
- File: `tests/features/feat_add_photo_blog_post/story-3.test.ts`
- Type: Unit test
- Definition of done: Form validates correctly

### TASK-3-TEST-2: Test Photo Post API
- File: `tests/features/feat_add_photo_blog_post/story-3-api.test.ts`
- Type: Unit test
- Definition of done: API endpoint processes requests correctly

### TASK-4-TEST-1: Test Photo Post Page
- File: `tests/features/feat_add_photo_blog_post/story-4.test.ts`
- Type: Unit test
- Definition of done: Page renders correctly for photo posts

### TASK-4-TEST-2: Test Photo Post Page E2E
- File: `e2e/features/feat_add_photo_blog_post/story-4.spec.ts`
- Type: E2E test
- Definition of done: Page displays correctly with all elements

### TASK-5-TEST-1: Test Blog List Integration
- File: `tests/features/feat_add_photo_blog_post/story-5.test.ts`
- Type: Unit test
- Definition of done: Photo posts appear correctly in list

### TASK-5-TEST-2: Test Blog List Integration E2E
- File: `e2e/features/feat_add_photo_blog_post/story-5.spec.ts`
- Type: E2E test
- Definition of done: Photo posts display correctly in blog list

### TASK-6-TEST-1: Test Responsive Design
- File: `e2e/features/feat_add_photo_blog_post/story-6.spec.ts`
- Type: E2E test
- Definition of done: All features work on mobile, tablet, desktop

### TASK-6-TEST-2: Test Accessibility
- File: `e2e/features/feat_add_photo_blog_post/story-6-a11y.spec.ts`
- Type: E2E test
- Definition of done: Component meets accessibility standards
