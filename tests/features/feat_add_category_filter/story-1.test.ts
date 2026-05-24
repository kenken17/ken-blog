import { describe, it, expect } from 'vitest';
import { filterPostsByTags } from '../../../src/utils/tags';

describe('filterPostsByTags', () => {
  const posts = [
    { data: { tags: ['astro', 'typescript'] } },
    { data: { tags: ['react', 'javascript'] } },
    { data: { tags: ['astro', 'css'] } },
    { data: { tags: ['vue'] } },
  ];

  it('returns all posts when no tags are selected', () => {
    const result = filterPostsByTags(posts, []);
    expect(result).toHaveLength(4);
    expect(result).toEqual(posts);
  });

  it('returns posts matching a single selected tag', () => {
    const result = filterPostsByTags(posts, ['astro']);
    expect(result).toHaveLength(2);
    expect(result[0].data.tags).toContain('astro');
    expect(result[1].data.tags).toContain('astro');
  });

  it('returns posts matching ANY selected tag (OR logic)', () => {
    const result = filterPostsByTags(posts, ['astro', 'react']);
    expect(result).toHaveLength(3);
    const tags = result.map((p) => p.data.tags);
    expect(tags).toContainEqual(['astro', 'typescript']);
    expect(tags).toContainEqual(['react', 'javascript']);
    expect(tags).toContainEqual(['astro', 'css']);
  });

  it('returns empty array when no posts match selected tag', () => {
    const result = filterPostsByTags(posts, ['nonexistent']);
    expect(result).toHaveLength(0);
  });

  it('returns empty array when selected tags do not match any posts', () => {
    const result = filterPostsByTags(posts, ['nonexistent', 'also-missing']);
    expect(result).toHaveLength(0);
  });

  it('returns a single post when only one matches multiple selected tags', () => {
    const result = filterPostsByTags(posts, ['astro', 'typescript']);
    expect(result).toHaveLength(2);
    expect(result[0].data.tags).toContain('astro');
    expect(result[1].data.tags).toContain('astro');
  });

  it('does not mutate the original array', () => {
    const original = [...posts];
    filterPostsByTags(posts, ['astro']);
    expect(posts).toEqual(original);
  });

  it('handles posts with empty tags array', () => {
    const postsWithEmpty = [
      ...posts,
      { data: { tags: [] as string[] } },
    ];
    const result = filterPostsByTags(postsWithEmpty, ['astro']);
    expect(result).toHaveLength(2);
  });
});
