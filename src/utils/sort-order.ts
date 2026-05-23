export type SortOrder = 'chronological' | 'reverse-chronological';

export const STORAGE_KEY = 'sort_order';

export function getStoredSortOrder(): SortOrder | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'chronological' || stored === 'reverse-chronological') {
      return stored;
    }
    return null;
  } catch {
    return null;
  }
}

export function setStoredSortOrder(order: SortOrder): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, order);
  } catch {
    return;
  }
}

export function getDefaultSortOrder(): SortOrder {
  return 'reverse-chronological';
}

export function getEffectiveSortOrder(): SortOrder {
  const stored = getStoredSortOrder();
  if (stored) return stored;
  return getDefaultSortOrder();
}

export function toggleSortOrder(current: SortOrder): SortOrder {
  return current === 'chronological' ? 'reverse-chronological' : 'chronological';
}

interface PostWithPubDate {
  data: {
    pubDate: Date;
  };
}

export function sortPosts<T extends PostWithPubDate>(
  posts: T[],
  order: SortOrder
): T[] {
  const sorted = [...posts];
  if (order === 'chronological') {
    sorted.sort((a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf());
  } else {
    sorted.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
  }
  return sorted;
}

export function sortTags(tags: string[], order: SortOrder): string[] {
  const sorted = [...tags];
  if (order === 'chronological') {
    sorted.sort((a, b) => a.localeCompare(b));
  } else {
    sorted.sort((a, b) => b.localeCompare(a));
  }
  return sorted;
}
