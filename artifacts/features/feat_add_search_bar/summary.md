# Feature Summary: Add Search Bar to All Pages

| Story | Points | Priority | Acceptance Criteria |
|-------|--------|----------|-------------------|
| S1: Search Index Generation | 2 | P1 | JSON index built at deploy time with all non-draft posts; <100KB for 500 posts |
| S2: Search Bar UI Component | 3 | P1 | SearchBar in BaseLayout header; responsive (inline desktop, icon-expand mobile); Cmd/Ctrl+K shortcut; accessible |
| S3: Client-Side Search Logic | 5 | P1 | Lazy-loaded index; matches title/description/tags; debounced; results with highlights; keyboard nav |
| S4: Search Results Dropdown | 3 | P1 | Styled dropdown; max 8 results; arrow key nav; click-outside close; fade-in animation |
| S5: Performance & Build Integration | 2 | P1 | Lazy-loaded JS; no critical-path impact; build succeeds; existing tests pass |

**Total points:** 15 | **Complexity:** Low | **Risk:** Minimal (static site, client-side only)

### Key Design Decisions

- **Static search index** in `public/search-index.json` — generated at build time, served as a static file. No server needed, no API routes, compatible with `output: 'static'`.
- **Lazy loading** — index fetched only on first search interaction, not on page load. Keeps initial bundle clean.
- **BaseLayout integration** — single point of change ensures search bar appears on every page without modifying individual page components.
- **No external dependencies** — pure TypeScript search matching. No Pagefind, Fuse.js, or other libraries needed for a small blog index.
