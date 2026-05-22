# Feature Summary — feat_add_code_block

## Overview
Enhance code block presentation in blog posts with language labels, optional filename headers, copy-to-clipboard buttons, line numbers, and responsive mobile design. Integrate code block insertion into the existing blog post editor with language selection.

## Stories Summary

| Story | Description | Key Acceptance Criteria |
|-------|-------------|------------------------|
| **Story 1** | Enhanced Code Block Rendering with Language Label, Filename, and Copy Button | `CodeBlock.astro` component with language detection, filename support, copy button, dark/light mode styling |
| **Story 2** | Line Numbers in Code Blocks | Shiki transformer configuration, styled line numbers that don't get copied |
| **Story 3** | Responsive Code Block Design | Horizontal scroll on mobile, 44×44px touch targets, no overflow at ≥320px |
| **Story 4** | Editor Integration for Code Blocks | Toolbar button, language dropdown, code block insertion, htmlToMarkdown preservation |
| **Story 5** | Comprehensive Test Coverage | Unit and e2e tests for all stories, >80% coverage, build passes |

## Task Count
- **Story 1:** 6 tasks (TASK-1-1, TASK-1-2, TASK-1-3, TASK-1-4, TASK-1-TEST-1, TASK-1-TEST-2)
- **Story 2:** 3 tasks (TASK-2-1, TASK-2-2, TASK-2-TEST-1)
- **Story 3:** 3 tasks (TASK-3-1, TASK-3-2, TASK-3-TEST-1)
- **Story 4:** 5 tasks (TASK-4-1, TASK-4-2, TASK-4-3, TASK-4-4, TASK-4-TEST-1)
- **Story 5:** 1 task (TASK-5-TEST-1)
- **Total:** 18 tasks

## Files to Create/Modify
- `src/components/CodeBlock.astro` — New enhanced code block wrapper component
- `src/pages/blog/[slug].astro` — Integrate CodeBlock via `<Content components={{ pre: CodeBlock }} />`
- `src/components/Editor.astro` — Add code block toolbar button, language selection, insertion logic
- `astro.config.mjs` — Add remark plugin for filename metadata, Shiki line number transformer
- `src/styles/global.css` — Code block line number and responsive styles
- `package.json` — Add `@shikijs/transformers` dependency
- `tests/features/feat_add_code_block/story-1.test.ts` — Unit tests for CodeBlock
- `e2e/features/feat_add_code_block/story-1.spec.ts` — E2E tests for enhanced code blocks
- `e2e/features/feat_add_code_block/story-2.spec.ts` — E2E tests for line numbers
- `e2e/features/feat_add_code_block/story-3.spec.ts` — E2E tests for responsive design
- `e2e/features/feat_add_code_block/story-4.spec.ts` — E2E tests for editor integration

## Dependencies
- `@shikijs/transformers` — Shiki transformers for line numbers
- Existing `astro:content` and `<Content />` component pattern
- Existing `BaseLayout.astro`, Tailwind CSS, and CSS custom property theming
- Existing `Editor.astro` contenteditable and `htmlToMarkdown` infrastructure

## Priority
P1 — High priority feature for technical content readability and author experience

## Estimated Effort
- **Story 1:** Medium (6 tasks)
- **Story 2:** Small (3 tasks)
- **Story 3:** Small (3 tasks)
- **Story 4:** Medium (5 tasks)
- **Story 5:** Small (1 task)
- **Total:** Medium effort (18 tasks)

## Risk Assessment
- **Low Risk:** Astro's `components` prop for `<Content />` is a well-documented pattern
- **Low Risk:** Shiki transformers are official and actively maintained
- **Medium Risk:** `contenteditable` + code block insertion may have browser inconsistencies; mitigate by testing in Chromium E2E
- **Mitigation:** Implement filename parsing via standard remark plugin pattern; test copy behavior carefully to avoid copying line numbers or metadata
