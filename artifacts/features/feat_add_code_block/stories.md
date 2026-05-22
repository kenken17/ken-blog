# User Stories — feat_add_code_block

## Story 1: Enhanced Code Block Rendering with Language Label, Filename, and Copy Button

**As a** blog reader,
**I want** code blocks to display the programming language, an optional filename header, and a copy-to-clipboard button,
**so that** I can easily identify, reference, and copy code snippets without formatting issues.

**Acceptance criteria:**
- A reusable `CodeBlock.astro` component is created to wrap `<pre>` elements
- The component detects the programming language from Shiki/CSS class names and displays it as a badge
- An optional filename header is shown when specified in the markdown code fence metadata
- A copy button is present that copies only the code content (not the language badge or filename)
- The code block styling is consistent with the blog's design system (Tailwind CSS, dark/light mode)
- The component is integrated into `src/pages/blog/[slug].astro` via the `<Content components={{ pre: CodeBlock }} />` pattern
- Copy button provides visual feedback on success (e.g., icon change or tooltip)

---

## Story 2: Line Numbers in Code Blocks

**As a** blog reader,
**I want** code blocks to optionally display line numbers,
**so that** I can reference specific lines when reading or discussing technical content.

**Acceptance criteria:**
- Line numbers are rendered alongside code blocks via Shiki transformer or CSS counters
- Line numbers are visually distinct (muted color, right-aligned) and do not interfere with code readability
- Line numbers are not included when the user copies code via the copy button
- Line numbers render correctly for all supported languages (Text, Bash, Python, JavaScript, Java, C++, Ruby)
- Line numbers adapt to the code block's dark/light mode theme

---

## Story 3: Responsive Code Block Design

**As a** blog reader on a mobile device,
**I want** code blocks to be readable and usable on small screens,
**so that** I can consume technical content on any device without horizontal overflow or inaccessible controls.

**Acceptance criteria:**
- Code blocks use horizontal scrolling on narrow viewports instead of wrapping
- The copy button meets minimum touch target size (44×44px) on mobile
- Code font size is readable on small screens (no smaller than 14px)
- Language badge and filename header stack or shrink gracefully on mobile
- No content overflow or layout breakage at viewports 320px and above
- Line numbers remain aligned and readable at all breakpoints

---

## Story 4: Editor Integration for Code Blocks

**As a** blog author,
**I want** to insert and preview code blocks with language selection in the blog post editor,
**so that** I can easily add formatted code snippets to my drafts before publishing.

**Acceptance criteria:**
- The `Editor.astro` toolbar gains a dedicated "Code Block" button
- A language selection interface (dropdown or modal) allows choosing from supported languages
- Inserting a code block creates a `<pre><code class="language-xxx">` structure in the editor's content area
- The editor's `htmlToMarkdown` conversion preserves language and filename attributes
- Code blocks in the editor preview match the styling of published blog post code blocks
- The language selection defaults to "Text" and remembers the last used language

---

## Story 5: Comprehensive Test Coverage

**As a** developer,
**I want** unit and end-to-end tests covering all code block functionality,
**so that** I can ensure correctness, prevent regressions, and maintain >80% coverage for new code.

**Acceptance criteria:**
- Unit tests verify `CodeBlock.astro` rendering, language detection, and copy functionality
- E2E tests verify code blocks display language labels, filenames, copy buttons, and line numbers correctly
- E2E tests verify responsive behavior at mobile, tablet, and desktop viewports
- E2E tests verify editor code block insertion and language selection
- All new test files pass, and overall coverage for the feature's files exceeds 80%
- Build passes with `astro check` reporting 0 errors, 0 warnings, 0 hints
