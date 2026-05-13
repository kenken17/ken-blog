# feat_add_comment_section — Summary

| # | Story | Points | Priority | Acceptance Criteria |
|---|-------|--------|----------|-------------------|
| 1 | Display Giscus comment section on blog posts | 3 | P1 | Comments.astro renders Giscus widget on every `/blog/[slug]` page; configured via props (no hard-coded values); slug-based discussion mapping; graceful degradation on script failure |
| 2 | Responsive and visually consistent comment section | 2 | P1 | Container aligns with `max-w-3xl` content width; border separator matches existing footer style; heading uses `font-display`/`text-foreground-muted`; Giscus `light` theme; no overflow on mobile |
| 3 | Performance and configuration | 2 | P1 | Giscus loads lazily (`data-loading="lazy"`); config centralized in `src/config/giscus.ts`; no Lighthouse regression >5pts; static build unchanged; zero build errors |

**Total points:** 7 | **Complexity:** Low | **Risk:** Minimal (client-side widget, no server dependencies)

### Key Design Decisions

- **Giscus via `<script>` injection** — No npm package dependency. The Giscus client is loaded from CDN as a script tag, keeping the bundle clean and compatible with `output: 'static'`.
- **Centralized configuration** — All Giscus parameters live in `src/config/giscus.ts`, making it easy to update repo/category settings without touching component code.
- **`pathname` mapping** — Each blog post URL maps to a unique GitHub Discussion, ensuring comments are scoped per post.
- **Lazy loading** — `data-loading="lazy"` ensures the Giscus script does not block initial page render, preserving the blog's fast load times.
- **No new dependencies** — Zero additions to `package.json`. Giscus is a client-side script, not an Astro integration or npm package.