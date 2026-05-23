# Planning Output: feat_add_chronological_order_toggle

## Feature Overview

**Name:** Add Chronological Order Toggle to Listing of Blog Posts/Tags
**Branch:** `feat_add_chronological_order_toggle`
**Priority:** P1

Allow users to toggle between chronological and reverse-chronological order when viewing blog post listings and tag listings, with the preference persisted across sessions.

---

## User Stories

### Story 1 — Blog Post Listing Order Toggle
As a blog reader, I want to toggle between chronological and reverse-chronological order on the blog post listing page so that I can view posts in my preferred sequence.

**Acceptance Criteria:**
- Toggle button visible on blog post listing page
- Clicking toggle switches between oldest-first and newest-first
- Active sort order clearly indicated in the UI
- Page updates without full reload
- Default order remains reverse chronological when no preference is stored

### Story 2 — Tag Listing Order Toggle
As a blog reader, I want to toggle between chronological and reverse-chronological order on the tag listing page so that I can view posts for a specific tag in my preferred sequence.

**Acceptance Criteria:**
- Toggle button visible on tag listing page
- Clicking toggle switches between oldest-first and newest-first
- Active sort order clearly indicated in the UI
- Page updates without full reload
- Default order remains reverse chronological when no preference is stored

### Story 3 — Persist Sort Order Preference Across Sessions
As a blog reader, I want my preferred sort order to be remembered across browser sessions so that I do not have to re-select it each time I visit the site.

**Acceptance Criteria:**
- Selected sort order saved to `localStorage` immediately upon change
- Saved sort order applied automatically on return to blog or tag listing pages
- Preference shared globally across both listing pages
- Graceful fallback to default order if `localStorage` is unavailable
- Stored preference does not contain PII and is scoped to site origin

---

## Engineering Tasks

### Story 1 Tasks
| Task ID | Title | File | Definition of Done |
|---------|-------|------|-------------------|
| TASK-1-1 | Add sort order parameter to blog post listing data fetch | `lib/posts.ts` or equivalent | Fetch accepts `sortOrder` param; default behavior unchanged |
| TASK-1-2 | Implement OrderToggle UI component | `components/OrderToggle.tsx` | Reusable, accessible, accepts `currentOrder` + `onToggle` props |
| TASK-1-3 | Integrate OrderToggle into blog post listing page | Blog listing page component | Toggle visible and functional; re-orders posts on click |
| TASK-1-TEST-1 | Unit tests for sort order logic | `tests/features/feat_add_chronological_order_toggle/story-1.test.ts` | Sort logic covered >80%; all assertions pass |
| TASK-1-TEST-2 | E2E tests for blog post listing toggle | `e2e/features/feat_add_chronological_order_toggle/story-1.spec.ts` | Toggle visible, reverses order, UI reflects state; all assertions pass |

### Story 2 Tasks
| Task ID | Title | File | Definition of Done |
|---------|-------|------|-------------------|
| TASK-2-1 | Add sort order parameter to tag listing data fetch | `lib/tags.ts` or equivalent | Fetch accepts `sortOrder` param; default behavior unchanged |
| TASK-2-2 | Integrate OrderToggle into tag listing page | Tag listing page component | Toggle visible and functional; re-orders posts on click |
| TASK-2-TEST-1 | Unit tests for tag sort order logic | `tests/features/feat_add_chronological_order_toggle/story-2.test.ts` | Sort logic covered >80%; all assertions pass |
| TASK-2-TEST-2 | E2E tests for tag listing toggle | `e2e/features/feat_add_chronological_order_toggle/story-2.spec.ts` | Toggle visible on tag page, reverses order, UI reflects state; all pass |

### Story 3 Tasks
| Task ID | Title | File | Definition of Done |
|---------|-------|------|-------------------|
| TASK-3-1 | Implement sort order storage service | `lib/sortPreference.ts` | `getSortPreference()` / `setSortPreference()` with `localStorage`; graceful fallback |
| TASK-3-2 | Integrate storage service with blog post listing page | Blog listing page component | Reads initial state from storage; writes on toggle |
| TASK-3-3 | Integrate storage service with tag listing page | Tag listing page component | Reads initial state from storage; writes on toggle |
| TASK-3-TEST-1 | Unit tests for storage service | `tests/features/feat_add_chronological_order_toggle/story-3.test.ts` | Storage service covered >80%; default, save, read, fallback cases pass |
| TASK-3-TEST-2 | E2E tests for persistence across sessions | `e2e/features/feat_add_chronological_order_toggle/story-3.spec.ts` | Preference survives page reload on blog and tag pages; all pass |

---

## Key Design Decisions

- **Reusable component:** `OrderToggle` is built once and reused on both blog and tag listing pages.
- **Single global preference:** One `localStorage` key (`blog:sort-order`) shared across pages so the user’s choice is consistent everywhere.
- **Client-side first:** Sorting is handled client-side where possible to avoid full page reloads; API parameters are provided as a bridge if server-side sorting is required.
- **Accessibility:** Toggle includes `aria-pressed` and `aria-label` attributes.
- **Graceful degradation:** If `localStorage` is unavailable (e.g., private mode, disabled by policy), the feature falls back silently to the default reverse-chronological order.

---

## Test Coverage Targets

- Unit test coverage for story files: **>80%**
- E2E tests for each story covering happy path and UI state
- No tests required for existing untouched code
