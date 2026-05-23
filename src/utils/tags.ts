import type { CollectionEntry } from 'astro:content';

export type SortOrder = 'asc' | 'desc';

export function sortPostsByDate(
  posts: CollectionEntry<'posts'>[],
  sortOrder: SortOrder = 'desc'
): CollectionEntry<'posts'>[] {
  return [...posts].sort((a, b) => {
    const diff = a.data.pubDate.valueOf() - b.data.pubDate.valueOf();
    return sortOrder === 'asc' ? diff : -diff;
  });
}

export function getAllTags(posts: CollectionEntry<'posts'>[]): string[] {
  const tagSet = new Set<string>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      tagSet.add(tag);
    }
  }
  return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
}

export function getPostsByTag(
  posts: CollectionEntry<'posts'>[],
  tag: string,
  sortOrder: SortOrder = 'desc'
): CollectionEntry<'posts'>[] {
  const taggedPosts = posts.filter((post) => post.data.tags.includes(tag));
  return sortPostsByDate(taggedPosts, sortOrder);
}

export function getTagCounts(posts: CollectionEntry<'posts'>[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return counts;
}
