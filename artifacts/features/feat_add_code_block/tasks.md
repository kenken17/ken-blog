# Tasks — feat_add_code_block

## Story 1: Enhanced Code Block Rendering with Language Label, Filename, and Copy Button

### TASK-1-1: Create CodeBlock.astro component
- **File:** `src/components/CodeBlock.astro`
- **Change:** Create a new Astro component that wraps rendered `<pre>` elements with enhancements
- **Details:**
  - Accept the original `<pre>` content via `<slot />`
  - Extract language from `class` prop (e.g., `language-javascript`, `language-python`)
  - Read optional `data-filename` attribute from props for filename display
  - Render a header bar with language badge (left) and copy button (right)
  - Render filename below or within the header when present
  - Style with Tailwind CSS using existing CSS custom properties for dark/light mode
  - Include an inline script for copy-to-clipboard functionality using Clipboard API
  - Provide visual feedback on copy (icon swap or brief "Copied!" text)
- **Definition of Done:** Component renders in isolation with header, language badge, copy button, and preserves original `<pre>` content

### TASK-1-2: Configure markdown filename metadata support
- **File:** `astro.config.mjs`
- **Change:** Add a remark/rehype plugin to parse code fence metadata and attach `data-filename` to `<pre>` tags
- **Details:**
  - Implement or install a remark plugin that parses ` ```javascript title="example.js" ` syntax
  - The plugin should add `data-filename="example.js"` to the generated `<pre>` element's properties
  - Ensure the plugin does not interfere with existing Shiki syntax highlighting
  - Register the plugin in `astro.config.mjs` under `markdown.remarkPlugins`
- **Definition of Done:** Markdown code fences with `title="..."` render `<pre>` tags containing `data-filename` attributes

### TASK-1-3: Integrate CodeBlock into blog post pages
- **File:** `src/pages/blog/[slug].astro`
- **Change:** Pass the custom `CodeBlock` component to `<Content />` via the `components` prop
- **Details:**
  - Import `CodeBlock` from `../../components/CodeBlock.astro`
  - Update `<Content />` to `<Content components={{ pre: CodeBlock }} />`
  - Verify that existing code blocks in blog posts render correctly with the new wrapper
  - Ensure non-code `<pre>` blocks (if any) still render properly
- **Definition of Done:** All blog post code blocks render inside the `CodeBlock` wrapper with language badge and copy button visible

### TASK-1-4: Style code blocks for dark/light mode consistency
- **File:** `src/components/CodeBlock.astro`, `src/styles/global.css`
- **Change:** Ensure code block wrapper, header, and buttons use theme-aware colors
- **Details:**
  - Header background uses a slightly elevated surface color (`bg-background-elevated`)
  - Border uses `border-background-hover` for subtle separation
  - Copy button uses `text-foreground-muted` with hover state `text-foreground`
  - Dark mode variables are already handled by `.dark` class in global.css; component should use semantic Tailwind classes
- **Definition of Done:** Code blocks look correct in both light and dark modes with proper contrast

### TASK-1-TEST-1: Write unit tests for CodeBlock component
- **File:** `tests/features/feat_add_code_block/story-1.test.ts`
- **Change:** Create unit tests for language detection, filename extraction, and copy logic
- **Details:**
  - Test language detection from various class names (`language-js`, `language-python`, `language-text`)
  - Test that `data-filename` prop renders the filename header
  - Test that the copy button is present and has correct accessibility attributes
  - Test that component renders the `<slot>` content unchanged
  - Mock Clipboard API for copy functionality tests
- **Definition of Done:** All unit tests pass with >80% coverage for CodeBlock.astro logic

### TASK-1-TEST-2: Write e2e tests for enhanced code blocks
- **File:** `e2e/features/feat_add_code_block/story-1.spec.ts`
- **Change:** Create e2e tests verifying code block rendering on published blog posts
- **Details:**
  - Navigate to a blog post containing code blocks
  - Verify language badge is visible and shows correct language
  - Verify filename header is visible when `title="..."` is used
  - Verify copy button is visible and clickable
  - Verify copying code places the correct text on clipboard (no badge/filename/line numbers)
- **Definition of Done:** All e2e tests pass on Chromium

---

## Story 2: Line Numbers in Code Blocks

### TASK-2-1: Configure Shiki line number transformer
- **File:** `astro.config.mjs`, `package.json`
- **Change:** Install and configure `@shikijs/transformers` with `transformerLineNumbers`
- **Details:**
  - Add `@shikijs/transformers` as a dependency
  - Import `transformerLineNumbers` in `astro.config.mjs`
  - Add it to `markdown.shikiConfig.transformers` array
  - Configure line number start offset (default 1) and styling options
- **Definition of Done:** `astro.config.mjs` builds successfully; rendered code blocks contain line number markup

### TASK-2-2: Style line numbers in CodeBlock component
- **File:** `src/components/CodeBlock.astro`, `src/styles/global.css`
- **Change:** Add CSS for line number appearance and copy-safe behavior
- **Details:**
  - Line numbers should use `text-foreground-muted` color
  - Add a right border or padding to separate line numbers from code
  - Use `user-select: none` or equivalent to prevent line numbers from being selected/copied
  - Ensure line numbers align properly with code lines across different font sizes
  - Maintain consistency in both light and dark modes
- **Definition of Done:** Line numbers are visible, aligned, and not copied when using the copy button

### TASK-2-TEST-1: Write e2e tests for line numbers
- **File:** `e2e/features/feat_add_code_block/story-2.spec.ts`
- **Change:** Create e2e tests verifying line number rendering and copy behavior
- **Details:**
  - Verify line numbers are visible in code blocks
  - Verify line numbers start at 1 and increment correctly
  - Verify copying code does not include line numbers in clipboard
  - Verify line numbers are readable in both light and dark modes
- **Definition of Done:** All e2e tests pass on Chromium

---

## Story 3: Responsive Code Block Design

### TASK-3-1: Implement responsive styles for CodeBlock
- **File:** `src/components/CodeBlock.astro`
- **Change:** Add responsive Tailwind classes and ensure mobile-friendly behavior
- **Details:**
  - Wrap `<pre>` in a container with `overflow-x-auto` for horizontal scrolling
  - Ensure copy button is at least 44×44px on mobile (`min-w-[44px] min-h-[44px]`)
  - Use responsive text sizes (`text-sm md:text-base`) for code content
  - Header should flex-wrap on mobile so language badge and filename don't overflow
  - Add `scrollbar-thin` or custom scrollbar styling if desired
- **Definition of Done:** Code blocks scroll horizontally on mobile without layout breakage

### TASK-3-2: Verify responsive behavior across breakpoints
- **File:** `src/components/CodeBlock.astro`
- **Change:** Manual/visual verification of code block at multiple viewports
- **Details:**
  - Test at 320px, 375px, 768px, 1024px, and 1440px viewports
  - Confirm copy button remains accessible at all sizes
  - Confirm language badge and filename don't cause overflow
  - Confirm line numbers remain aligned at all breakpoints
- **Definition of Done:** No overflow, truncation, or accessibility issues at any tested viewport

### TASK-3-TEST-1: Write e2e tests for responsive code blocks
- **File:** `e2e/features/feat_add_code_block/story-3.spec.ts`
- **Change:** Create e2e tests for responsive design verification
- **Details:**
  - Test code block rendering at mobile (375px), tablet (768px), and desktop (1280px) viewports
  - Verify horizontal scroll is present on mobile for long lines
  - Verify copy button is visible and clickable at all breakpoints
  - Verify no horizontal page overflow caused by code blocks
- **Definition of Done:** All responsive e2e tests pass on Chromium

---

## Story 4: Editor Integration for Code Blocks

### TASK-4-1: Add code block button to Editor toolbar
- **File:** `src/components/Editor.astro`
- **Change:** Add a "Code Block" toolbar button alongside existing formatting buttons
- **Details:**
  - Add an SVG icon representing code (e.g., `</>` or brackets)
  - Insert the button in the toolbar `div` with consistent styling
  - Assign `data-command="codeBlock"` for event delegation
  - Ensure the button is keyboard accessible with a `title` attribute
- **Definition of Done:** Code block button is visible in the editor toolbar and matches existing button styling

### TASK-4-2: Implement language selection in editor
- **File:** `src/components/Editor.astro`
- **Change:** Add a language selection dropdown/modal triggered by the code block button
- **Details:**
  - Supported languages: Text, Bash, Python, JavaScript, Java, C++, Ruby
  - Show a dropdown or inline select element when the code block button is clicked
  - Default selection is "Text" (plain text)
  - Store last selected language in a variable for convenience
  - Allow the user to proceed or cancel the insertion
- **Definition of Done:** Clicking the code block button shows a language selector with all supported options

### TASK-4-3: Implement code block insertion logic
- **File:** `src/components/Editor.astro`
- **Change:** Insert a `<pre><code class="language-xxx">` structure when a language is selected
- **Details:**
  - Use `execCommand('insertHTML', false, ...)` or equivalent to insert the code block
  - Wrap content in `<pre><code class="language-{selected}"></code></pre>`
  - If text is selected in the editor, wrap it inside the code block
  - Otherwise, insert an empty code block and focus it for typing
  - Ensure the inserted HTML matches what `htmlToMarkdown` expects
- **Definition of Done:** Selected text (or empty block) is inserted as a styled code block in the editor

### TASK-4-4: Update htmlToMarkdown for code block metadata
- **File:** `src/components/Editor.astro`
- **Change:** Ensure `htmlToMarkdown` preserves language and optional filename
- **Details:**
  - When converting `<pre><code class="language-xxx">`, output ` ```xxx ` or ` ```xxx title="file" `
  - Extract `data-filename` from the `<pre>` element if present
  - Ensure plain `<pre>` without language class outputs ` ```text `
  - Verify the generated markdown is compatible with the remark plugin from Story 1
- **Definition of Done:** Code blocks in the editor convert to markdown that correctly renders with language labels and filenames

### TASK-4-TEST-1: Write e2e tests for editor code block integration
- **File:** `e2e/features/feat_add_code_block/story-4.spec.ts`
- **Change:** Create e2e tests for editor code block functionality
- **Details:**
  - Open the editor page (`/admin/write`)
  - Click the code block button and select a language
  - Verify a code block is inserted in the content area
  - Type code into the block and verify it appears correctly
  - Export the draft and verify the markdown contains correct fence syntax
- **Definition of Done:** All e2e tests pass on Chromium

---

## Story 5: Comprehensive Test Coverage

### TASK-5-TEST-1: Verify overall test suite and build
- **File:** N/A (run commands)
- **Change:** Run full test suite and build to validate all stories
- **Details:**
  - Run `npm test` and confirm all new unit tests pass
  - Run `npm run test:e2e` and confirm all new e2e tests pass
  - Run `astro check` and confirm 0 errors, 0 warnings, 0 hints
  - Run `astro build` and confirm build completes successfully
  - Verify coverage report shows >80% coverage for `src/components/CodeBlock.astro` and editor-related changes
- **Definition of Done:** All tests pass, build succeeds, coverage threshold met
