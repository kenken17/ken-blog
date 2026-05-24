import type { CollectionEntry } from 'astro:content';

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
  tag: string
): CollectionEntry<'posts'>[] {
  return posts
    .filter((post) => post.data.tags.includes(tag))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
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

interface PostWithTags {
  data: {
    tags: string[];
  };
}

export function filterPostsByTags<T extends PostWithTags>(
  posts: T[],
  selectedTags: string[]
): T[] {
  if (selectedTags.length === 0) return posts;
  return posts.filter((post) => selectedTags.some((tag) => post.data.tags.includes(tag)));
}
