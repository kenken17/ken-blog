# Feature: Add Author Bio — Summary

| Story | Points | Priority | Acceptance Criteria |
|-------|--------|----------|-------------------|
| S1: Author content collection and data model | 2 | High | `authors` collection defined with name/avatar/bio schema; `posts` gains optional `author` field; existing posts backward compatible |
| S2: Author bio page | 3 | High | `/author/{id}` page renders name, avatar, bio, and post list; responsive; Swiss Modernism 2.0 design |
| S3: Author link from blog posts | 2 | High | Author name in post header links to `/author/{id}`; matches existing metadata styling |
| S4: SEO and accessibility | 1 | Medium | Proper title/OG/JSON-LD; h1/h2 hierarchy; avatar alt text; passes a11y audit |

**Total points:** 8

**Key decisions:**
- Author data lives in a content collection (`src/content/authors/`) — consistent with how posts are managed, no external CMS needed.
- Posts reference authors by ID string (default "ken") — minimal schema change, backward compatible.
- Author page at `/author/[id]` — follows Astro dynamic route convention, matches blog post URL pattern.
- No new global CSS — all styling via existing Tailwind utilities and design tokens.
- Social media links explicitly out of scope per feature spec.
