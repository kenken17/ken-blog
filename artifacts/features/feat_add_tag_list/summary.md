# feat_add_tag_list — Summary

| # | Story | Acceptance Criteria |
|---|-------|-------------------|
| 1 | View all tags on a dedicated page | `/tags` lists every unique tag alphabetically with post counts; responsive; uses BaseLayout |
| 2 | Navigate from a tag to its filtered post list | `/tags/[tag]` shows all published posts for that tag sorted by date; links back to `/tags`; uses BaseLayout |
| 3 | Navigate from a blog post to the tag listing page | Tags in `/blog/[slug]` and `/blog` are clickable links to `/tags/[tag]`; keyboard-accessible with aria-labels |
| 4 | Performance and SEO | All tag pages are SSG; proper `<title>` and `<meta description>`; no client-side JS added |