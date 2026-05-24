# feat_add_category_filter — Summary (Updated: Enhanced Tag Filtering)

| # | Story | Acceptance Criteria |
|---|-------|---------------------|
| 1 | **BlogTagFilter component** | Horizontal pill list of tags with counts on `/blog`; each pill is a toggle button (not a link); multi-select with OR logic; `blog-tag-filter:change` custom event; localStorage persistence (`blog_tag_filter`); keyboard accessible; Swiss Modernism 2.0 styling |
| 2 | **Blog page integration & client-side filtering** | `BlogTagFilter` rendered between header and post list on `/blog`; posts have `data-tags` attribute with JSON tag array; selecting tags hides/shows posts instantly via client-side JS; "N posts" count updates dynamically; composes with existing `SortOrderToggle`; `aria-live` region for accessibility; FOUC prevention |
| 3 | **Testing** | Unit tests for client-side filter logic; DOM tests for `BlogTagFilter` component; Playwright E2E for rendering, multi-select, persistence, sort-order composition, keyboard accessibility |

**Key change:** Reuses existing `tags` data and `src/utils/tags.ts`. No schema changes, no new utility module, no new frontmatter fields.
