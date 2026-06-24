import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const blogPagePath = path.resolve(process.cwd(), 'src/pages/blog.astro');

describe('Story 5: Blog list integration for photo posts', () => {
  let pageSource: string;

  beforeAll(() => {
    pageSource = fs.readFileSync(blogPagePath, 'utf-8');
  });

  it('blog page file exists', () => {
    expect(fs.existsSync(blogPagePath)).toBe(true);
  });

  it('imports isPhotoPost and getPhotoThumbnail utilities', () => {
    expect(pageSource).toContain("import { getPhotoThumbnail, isPhotoPost } from '../utils/posts'");
  });

  it('computes photoPost flag for each post in the list', () => {
    expect(pageSource).toContain('photoPost: isPhotoPost(post)');
  });

  it('extracts photoThumbnail for each post', () => {
    expect(pageSource).toContain('photoThumbnail: getPhotoThumbnail(post)');
  });

  it('renders camera icon SVG for photo posts', () => {
    expect(pageSource).toContain('<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z">');
    expect(pageSource).toContain('<circle cx="12" cy="13" r="4">');
  });

  it('renders "Photo" label text next to camera icon', () => {
    expect(pageSource).toContain('Photo');
    expect(pageSource).toContain('aria-label="Photo post"');
  });

  it('conditionally shows camera icon only for photo posts', () => {
    expect(pageSource).toContain('{photoPost && (');
  });

  it('renders thumbnail image for photo posts', () => {
    expect(pageSource).toContain('{photoPost && photoThumbnail && (');
    expect(pageSource).toContain('<img');
  });

  it('thumbnail has responsive srcset', () => {
    expect(pageSource).toContain('srcset={');
    expect(pageSource).toContain('480w');
    expect(pageSource).toContain('768w');
  });

  it('thumbnail has sizes attribute', () => {
    expect(pageSource).toContain('sizes=');
  });

  it('thumbnail has lazy loading', () => {
    expect(pageSource).toContain('loading="lazy"');
  });

  it('thumbnail has alt text', () => {
    expect(pageSource).toContain('alt={photoThumbnail.alt}');
  });

  it('thumbnail uses the first image URL', () => {
    expect(pageSource).toContain('photoThumbnail.url');
  });

  it('each post article has a data-pub-date attribute', () => {
    expect(pageSource).toContain('data-pub-date=');
  });

  it('each post article has a data-tags attribute', () => {
    expect(pageSource).toContain('data-tags=');
  });

  it('maintains consistent styling for all posts', () => {
    expect(pageSource).toContain('class="group animate-fade-in"');
    expect(pageSource).toContain('{post.data.title}');
    expect(pageSource).toContain('{post.data.description}');
  });

  it('post count is displayed', () => {
    expect(pageSource).toContain('data-post-count');
    expect(pageSource).toContain('post{posts.length !== 1 ? \'s\' : \'\'}');
  });
});
