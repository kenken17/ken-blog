export type SortOrder = 'asc' | 'desc';

export const SORT_PREFERENCE_KEY = 'blog:sort-order';

export function getSortPreference(): SortOrder {
  if (typeof window === 'undefined') return 'desc';

  try {
    const stored = window.localStorage.getItem(SORT_PREFERENCE_KEY);
    return stored === 'asc' || stored === 'desc' ? stored : 'desc';
  } catch {
    return 'desc';
  }
}

export function setSortPreference(order: SortOrder): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(SORT_PREFERENCE_KEY, order);
  } catch {
    return;
  }
}
