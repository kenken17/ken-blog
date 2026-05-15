import { describe, it, expect, vi } from 'vitest';

vi.mock('astro:content', () => ({
  getCollection: vi.fn(),
}));

import { GET } from '../../../src/pages/rss.xml';
import { getCollection } from 'astro:content';

describe('RSS feed generation', () => {
  const mockSite = new URL('https://ken-blog.pages.dev');
  const mockContext = { site: mockSite } as any;

  it('returns valid XML with correct channel metadata', async () => {
    vi.mocked(getCollection).mockResolvedValue([
      {
        id: 'my-ai-era',
        data: {
          title: 'My AI era...',
          pubDate: new Date('2026-05-10'),
          description: 'Thoughts on AI',
        },
      },
    ]);

    const response = await GET(mockContext);
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('application/xml');

    const xml = await response.text();
    expect(xml).toContain('<rss');
    expect(xml).toContain('</rss>');
    expect(xml).toContain("<title>Ken&apos;s Blog</title>");
    expect(xml).toContain('<link>https://ken-blog.pages.dev/</link>');
    expect(xml).toContain('<description>A place for thoughts on engineering, design, and technology.</description>');
  });

  it('excludes draft posts', async () => {
    vi.mocked(getCollection).mockResolvedValue([
      {
        id: 'draft-post',
        data: {
          title: 'Draft Post',
          pubDate: new Date('2026-05-10'),
          description: 'This is a draft',
          draft: true,
        },
      },
    ]);

    const response = await GET(mockContext);
    const xml = await response.text();
    expect(xml).not.toContain('Draft Post');
  });

  it('sorts posts by pubDate descending', async () => {
    vi.mocked(getCollection).mockResolvedValue([
      {
        id: 'older-post',
        data: {
          title: 'Older Post',
          pubDate: new Date('2026-01-01'),
          description: 'Older',
        },
      },
      {
        id: 'newer-post',
        data: {
          title: 'Newer Post',
          pubDate: new Date('2026-05-10'),
          description: 'Newer',
        },
      },
    ]);

    const response = await GET(mockContext);
    const xml = await response.text();
    const newerIndex = xml.indexOf('Newer Post');
    const olderIndex = xml.indexOf('Older Post');
    expect(newerIndex).toBeLessThan(olderIndex);
  });

  it('includes required fields per item', async () => {
    vi.mocked(getCollection).mockResolvedValue([
      {
        id: 'test-post',
        data: {
          title: 'Test Post',
          pubDate: new Date('2026-05-10'),
          description: 'Test description',
        },
      },
    ]);

    const response = await GET(mockContext);
    const xml = await response.text();
    expect(xml).toContain('<title>Test Post</title>');
    expect(xml).toContain('<link>https://ken-blog.pages.dev/blog/test-post/</link>');
    expect(xml).toContain('<guid isPermaLink="true">https://ken-blog.pages.dev/blog/test-post/</guid>');
    expect(xml).toContain('<description>Test description</description>');
  });

  it('handles empty description gracefully', async () => {
    vi.mocked(getCollection).mockResolvedValue([
      {
        id: 'no-desc',
        data: {
          title: 'No Description',
          pubDate: new Date('2026-05-10'),
          description: '',
        },
      },
    ]);

    const response = await GET(mockContext);
    const xml = await response.text();
    expect(xml).toContain('<title>No Description</title>');
    expect(xml).toContain('<link>https://ken-blog.pages.dev/blog/no-desc/</link>');
  });
});
